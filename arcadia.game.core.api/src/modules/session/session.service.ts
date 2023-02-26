/* eslint-disable max-lines */
import { Inject, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import {
  connectionNames,
  InjectRepository,
  RoundArchiveEntity,
  RoundArchiveRepository,
  RoundRepository,
  RoundStatus,
  RoundType,
  SessionArchiveRepository,
  SessionEndReason,
  SessionEntity,
  SessionRepository,
  SessionStatus,
} from 'arcadia-dal';
import * as CacheManager from 'cache-manager';
import * as moment from 'moment';
import { SESSION_CACHE_TTL } from '../../constants/cache.keys';
import { Cache } from '../../decorators/cache';
import { CacheClear } from '../../decorators/cache.clear';
import { REDIS_CACHE } from '../global.cache/redis.cache.module';
import { AppLogger } from '../logger/logger.service';
import { EventSource, EventType } from '../monitoring.worker.client/enum';
import { MonitoringWorkerClientService } from '../monitoring.worker.client/monitoring.worker.client.service';
import { PlayerClientService } from '../player.client/player.client.service';
import { SessionDataManager } from '../session.data.manager/sessionDataManager';
import { sessionCacheKeyFactory } from './session.cache.key.factory';

@Injectable()
export class SessionService {
  constructor(
    private readonly logger: AppLogger,
    @InjectRepository(SessionRepository, connectionNames.DATA)
    private readonly sessionRepo: SessionRepository,
    @InjectRepository(SessionArchiveRepository, connectionNames.DATA)
    private readonly sessionArchiveRepo: SessionArchiveRepository,
    private readonly playerPublisher: PlayerClientService,
    @Inject(REDIS_CACHE) public readonly cacheManager: CacheManager.Cache,
    private readonly sessionDataManager: SessionDataManager,
    private readonly monitoringClient: MonitoringWorkerClientService,
  ) {
  }

  @Cache({ ttl: SESSION_CACHE_TTL }, args => sessionCacheKeyFactory(args[0]))
  public async findByIdCached(sessionId: number): Promise<SessionEntity | undefined> {
    return this.sessionRepo.findOne(sessionId,
      { relations: ['player', 'group', 'operator', 'machine', 'queue', 'machine.site'] });
  }

  public createSession(sessionOptions: Partial<SessionEntity>): Promise<SessionEntity> {
    const session = this.sessionRepo.create({
      ...sessionOptions,
      playerIP: () => `INET6_ATON('${sessionOptions.playerIP}')`,
      sessionDescription: {},
    });
    return this.sessionRepo.save(session, { transaction: false });
  }

  public async finalizeSession(id: number, terminate: boolean = false, reason: SessionEndReason | string = SessionEndReason.NORMAL): Promise<void> {
    try {
      await this.archiveSession(id, terminate, reason);
    } catch (reason) {
      this.logger.error(`Session failed to archive. SessionId: ${id}, error: ${JSON.stringify(reason.message)}`);
      throw new RpcException(reason);
    }
  }

  @CacheClear(args => sessionCacheKeyFactory(args[0]))
  private async archiveSession(sessionId: number, isTerminated: boolean, reason: SessionEndReason | string): Promise<void> {
    const session = await this.sessionRepo.findOne(sessionId, {
      relations: ['player', 'group', 'operator', 'machine', 'queue', 'rounds', 'machine.site'],
    });
    if (!session) {
      this.logger.error(`Session archiving failed: session not found. SessionId: ${sessionId}`);
      return;
    }
    const {
      player, group, operator, machine, queue, rounds,
    } = session;
    await this.sessionDataManager.deleteSessionToken(session.id, player.cid);
    await this.sessionDataManager.dropSessionData(session.id);
    this.playerPublisher.notifyReturnToLobby(session.id);

    await this.sessionRepo.manager.transaction(async manager => {
      const sessionArchiveRepo = manager.getCustomRepository(SessionArchiveRepository);
      const roundArchiveRepo = manager.getCustomRepository(RoundArchiveRepository);
      let isScatter = false;
      if (rounds?.length) {
        isScatter = !!rounds.find(({ type }) => type === RoundType.SCATTER);
        const roundsArchived: RoundArchiveEntity[] = rounds.map(round => roundArchiveRepo.create({
          id: round.id,
          sessionId: session.id,
          machineId: machine.id,
          bet: round.bet,
          betInCash: round.betInCash,
          coins: isTerminated && round.status === RoundStatus.ACTIVE
            ? round.coins
            : group.stackSize,
          startDate: round.createDate,
          endDate: round.endDate || new Date(),
          status: isTerminated && round.status === RoundStatus.ACTIVE
            ? RoundStatus.TERMINATED
            : round.status,
          type: round.type,
          wins: round.wins,
          winInCash: round.winInCash,
          isAutoplay: round.isAutoplay,
          voucherId: round.voucherId,
          jackpotContribution: round.jackpotContribution,
        }));
        await roundArchiveRepo.save(roundsArchived, { transaction: false, reload: false });
        await manager.getCustomRepository(RoundRepository)
          .delete(rounds.map(value => value.id));
      }

      const sessionArchive = sessionArchiveRepo.create({
        id: session.id,
        browser: session.browser,
        clientApiServerIP: () => 'INET6_ATON("127.0.0.1")', // fixme: replace with actual data
        clientAppVersion: session.clientVersion,
        configuration: JSON.stringify(session.configuration),
        currency: session.currency,
        currencyConversionRate: session.currencyConversionRate,
        deviceType: session.deviceType,
        duration: moment().diff(session.createDate, 'seconds'),
        startDate: session.createDate,
        endDate: new Date(),
        groupId: group.id,
        groupName: group.name,
        isScatter,
        lastPurchaseAmount: group.denominator,
        locale: session.locale,
        machineId: machine.id,
        siteId: machine.site.id,
        machineSerial: machine.serial,
        operatorId: operator.id,
        operatorName: operator.name,
        os: session.os,
        playerCid: player.cid,
        playerIP: session.playerIP,
        playerName: player.name || 'no-name',
        queueDuration: session.queueDuration,
        queueId: queue.id,
        sessionDescription: JSON.stringify(session.sessionDescription),
        stackSize: group.stackSize,
        status: isTerminated ? SessionStatus.TERMINATED : SessionStatus.COMPLETED,
        totalBets: session.totalBets,
        totalBetsInCash: session.totalBetsInCash,
        totalNetCash: session.totalNetCash,
        jackpotWin: session.jackpotWin,
        totalStacksUsed: session.totalStacksUsed,
        totalWinning: session.totalWinning,
        totalWinInCash: session.totalWinInCash,
        viewerDuration: session.viewerDuration,
        denominator: group.denominator,
        offlineDuration: session.offlineDuration,
        isDenominationChanged: session.isDenominationChanged,
      });
      await sessionArchiveRepo.save(sessionArchive, { reload: false, transaction: false });
      await manager.getCustomRepository(SessionRepository)
        .delete({ id: session.id });
      await this.monitoringClient.sendEventLogMessage({
        eventType: EventType.END_SESSION,
        source: EventSource.GAME,
        params: {
          reason,
          sessionId: session.id,
          machineSerial: machine.serial,
        },
      });
    });
  }
}
