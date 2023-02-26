/* eslint-disable max-lines */
import {
  HttpException,
  HttpService,
  HttpStatus,
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  OnApplicationBootstrap,
  UnauthorizedException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import {
  AlertSeverity,
  AlertSource,
  AlertType,
  connectionNames,
  InjectRepository,
  RoundEntity,
  RoundRepository,
  SessionEntity,
  SessionRepository,
  SessionStatus,
} from 'arcadia-dal';
import BigNumber from 'bignumber.js';
import * as CacheManager from 'cache-manager';
import * as jwt from 'jsonwebtoken';
import { from } from 'rxjs';
import {
  map, mergeMap, retryWhen, toArray,
} from 'rxjs/operators';
import { promisify } from 'util';
import { v4 as uuidv4 } from 'uuid';
import { PLAYER_TO_CORE_QUEUE } from '../../constants/rabbit.constants';
import { Cache } from '../../decorators/cache';
import { genericRetryStrategy } from '../../util/generic.retry.strategy';
import { toCash } from '../../util/toCash';
import { ConfigService } from '../config/config.service';
import { JackpotContributeEvent } from '../event.bus/dto/jackpot.contribute.event';
import { REDIS_CACHE } from '../global.cache/redis.cache.module';
import { AppLogger } from '../logger/logger.service';
import { PlayerMessageType } from '../messaging/player.handling/enum/player.message.type';
import { EventSource, EventType } from '../monitoring.worker.client/enum';
import { MonitoringWorkerClientService } from '../monitoring.worker.client/monitoring.worker.client.service';
import { BalanceData } from '../operator.api.client/dto/balanceData';
import { OperatorApiClientService } from '../operator.api.client/operator.api.client.service';
import { PlayerClientService } from '../player.client/player.client.service';
import { ServerRMQ } from '../rmq.server/rmq.server';
import { SessionDataManager } from '../session.data.manager/sessionDataManager';
import { AmountInCurrency, JackpotWinDto, PlaceBetDto } from './dto';
import { BlueRibbonTokenPayload } from './dto/blue.ribbon.token.payload';
import { CancelDetailsDto } from './dto/cancel.details.dto';
import { CurrencyData } from './dto/currency.data';
import { FundingDetails } from './dto/funding.details';
import { GameInfo } from './dto/game.info';
import { PlaceBetResp } from './dto/place.bet.resp';
import { getJackpotRoundId } from './jackpotRoundIdFactory';

@Injectable()
export class JackpotApiClientService implements OnApplicationBootstrap {
  private rmqPublisher: ServerRMQ;

  private readonly baseUrl: string;
  private readonly authenticationKey: string;
  private readonly authenticationSecret: string;
  private readonly tokenVerifier: (token: string, secret: string, options: Record<string, any>) =>
    Promise<any> = promisify<string, string, Record<string, any>>(jwt.verify);

  constructor(
    config: ConfigService,
    private readonly logger: AppLogger,
    private readonly httpService: HttpService,
    @InjectRepository(SessionRepository, connectionNames.DATA)
    private readonly sessionRepo: SessionRepository,
    @InjectRepository(RoundRepository, connectionNames.DATA)
    private readonly roundRepo: RoundRepository,
    @Inject(REDIS_CACHE) public readonly cacheManager: CacheManager.Cache,
    private readonly playerPublisher: PlayerClientService,
    private readonly operatorClient: OperatorApiClientService,
    private readonly monitoringWorkerClient: MonitoringWorkerClientService,
    private readonly sessionDataManager: SessionDataManager,
  ) {
    this.baseUrl = config.get(['core', 'BLUE_RIBBON_API_URL']) as string;
    this.authenticationKey = config.get(['core', 'BLUE_RIBBON_AUTHENTICATION_KEY']) as string;
    this.authenticationSecret = config.get(['core', 'BLUE_RIBBON_AUTHENTICATION_SECRET']) as string;
  }

  public async onApplicationBootstrap(): Promise<void> {
    this.rmqPublisher = ServerRMQ.getInstance();
  }

  private async makeApiRequest(
    path: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    params: { data?: any; query?: any },
    authToken?: string,
  ): Promise<any> {
    return this.httpService.request({
      method,
      baseURL: this.baseUrl,
      url: path,
      data: params.data,
      params: params.query,
      headers: authToken ? { Authentication: `Bearer ${authToken}` } : null,
    }).pipe(
      retryWhen(genericRetryStrategy()),
      map(value => value.data),
    ).toPromise()
      .catch(reason => {
        throw new RpcException(reason);
      });
  }

  private async makeApiRequestWithAuth(
    path: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', params?: { data?: any; query?: any },
  ): Promise<any> {
    const authToken = await this.getAuthToken();
    return this.makeApiRequest(path, method, params, authToken);
  }

  // 12 hour cache
  @Cache({ ttl: 43200 }, 'blue-ribbon-api-auth-token')
  private async getAuthToken(): Promise<string> {
    try {
      const result = await this.httpService.request({
        method: 'PUT',
        baseURL: this.baseUrl,
        url: '/auth/login',
        data: {
          authenticationData: {
            authenticationKey: this.authenticationKey,
            authenticationSecret: this.authenticationSecret,
          },
        },
      }).pipe(
        retryWhen(genericRetryStrategy()),
        map(value => value.data),
      ).toPromise();
      return result.data.userJWT;
    } catch (err) {
      await this.monitoringWorkerClient.sendAlertMessage({
        alertType: AlertType.WARNING,
        severity: AlertSeverity.MEDIUM,
        source: AlertSource.GAME_CORE,
        description: 'Failed to authorize with jackpots service',
        additionalInformation: {
          errorMessage: err.message,
        },
      });
      this.logger.error('BlueRibbon auth error', err);
      throw new RpcException(err);
    }
  }

  @Cache({ ttl: 300 }, 'blue-ribbon-game-config')
  private async getGameConfig(
    brOperatorId: string, brGameId: string,
  ): Promise<{ fundingDetails: FundingDetails; currencies: CurrencyData[] }> {
    const results = await this.makeApiRequestWithAuth(`/game/configuration?operatorId=${brOperatorId}&gameIds=${brGameId}`, 'GET', {});
    if (results?.data?.games?.length) {
      const game: GameInfo = results.data.games[0];
      return {
        fundingDetails: game.fundingDetails,
        currencies: game.currenciesDetails.currencies,
      };
    }
    throw new NotFoundException('Game not found'); // No jackpot for provided game id
  }

  private async getJackpotGameIdByOptedPlayers(operatorId: string, playerId: string): Promise<string[]> {
    const results = await this.makeApiRequestWithAuth(`/player/jackpotGameByPlayerIds?operatorId=${operatorId}&playerIds=${playerId}`, 'GET', {});
    if (results?.data?.players?.length) {
      return results.data.players[0].jackpotGameIds;
    }
    return [];
  }

  private async isJackpotAvailable(
    operatorBlueRibbonId: string, groupBlueRibbonId: string, playerId: string,
  ): Promise<boolean> {
    try {
      const optedGameIds = await this.getJackpotGameIdByOptedPlayers(operatorBlueRibbonId, playerId);
      this.logger.log(`Opted in: ${JSON.stringify(optedGameIds)}`);
      return !!(optedGameIds?.find(value => value === groupBlueRibbonId));
    } catch (err) {
      this.logger.error('Error checking for opted in, defaulting to false', err);
      return false;
    }
  }

  private getContributionAmount(
    fundingDetails: FundingDetails, betInValue: number,
  ): {
    operatorContributionAmount: number;
    playerContributionAmount: number;
    totalContributionAmount: number;
  } {
    const totalAmount = (fundingDetails.fundingContributionType === 'FIXED')
      ? new BigNumber(fundingDetails.jackpotContributionValue)
      // todo: check number format for jackpotContributionValue in percentage mode (e.g 0.03 or 3 as 3%)
      : new BigNumber(fundingDetails.jackpotContributionValue).dividedBy(100)
        .multipliedBy(betInValue).dp(2);
    const playerAmount = new BigNumber(fundingDetails.playerContributionPercentage)
      .dividedBy(100).multipliedBy(totalAmount).dp(2);
    return {
      operatorContributionAmount: totalAmount.minus(playerAmount).dp(2).toNumber(),
      playerContributionAmount: playerAmount.toNumber(),
      totalContributionAmount: totalAmount.toNumber(),
    };
  }

  private async getContribution(
    operatorBlueRibbonId: string, groupBlueRibbonId: string, playerCid: string, betInValue: number,
    currency: string,
  ): Promise<PlaceBetDto> {
    const emptyJackpot: PlaceBetDto = {
      operatorId: operatorBlueRibbonId,
      gameId: groupBlueRibbonId,
      playerId: playerCid,
      currency,
      playerContributionAmount: 0,
      operatorContributionAmount: 0,
      totalContributionAmount: 0,
      betInCash: 0,
    };
    try {
      if (await this.isJackpotAvailable(operatorBlueRibbonId, groupBlueRibbonId, playerCid)) {
        const { fundingDetails, currencies } = await this.getGameConfig(operatorBlueRibbonId,
          groupBlueRibbonId);
        const brCurrencyData = currencies?.find(value => value.currency === currency);
        if (!brCurrencyData) {
          this.logger.warn('No blueribbon currency data, skipping jackpot');
          return emptyJackpot;
        }
        const contributionData = this.getContributionAmount(fundingDetails, betInValue);
        return {
          ...emptyJackpot,
          ...contributionData,
          betInCash: new BigNumber(contributionData.playerContributionAmount)
            .multipliedBy(brCurrencyData.rate).dp(2).toNumber(),
        };
      }
      this.logger.log(`Jackpot unavailable, playerCid: ${playerCid}`);
    } catch (err) {
      this.logger.error(err);
    }
    return emptyJackpot;
  }

  private async placeBet(betData: PlaceBetDto): Promise<PlaceBetResp> {
    const body = {
      operatorId: betData.operatorId,
      playerDetails: {
        playerId: betData.playerId,
      },
      wagerDetails: {
        amount: betData.playerContributionAmount,
        currencySymbol: betData.currency,
      },
      gameDetails: {
        gameId: betData.gameId,
      },
      jackpotContributionDetails: {
        totalContributionAmount: betData.totalContributionAmount,
        fundingDetails: {
          operatorContributionAmount: betData.operatorContributionAmount,
          playerContributionAmount: betData.playerContributionAmount,
        },
      },
    };
    return this.makeApiRequestWithAuth('/bet/async/placeBet', 'POST', { data: body })
      .then(value => value.data);
  }

  public async contribute(data: JackpotContributeEvent): Promise<void> {
    const {
      session, group, operator, player, round, correlationId, machine,
    } = data;
    const betData = await this.getContribution(
      operator.blueRibbonId, group.blueRibbonGameId, player.cid, round.bet, session.currency,
    );
    if (betData.playerContributionAmount === 0 || betData.betInCash === 0) {
      this.logger.warn(`Jackpot contribution skipped, sessionId: ${session.id}, roundId: ${round.id}, betData: ${JSON.stringify(betData)}`);
      return;
    }
    this.logger.log(`Contributing to jackpot: ${JSON.stringify(betData)}`);
    const sessionToken = await this.sessionDataManager.getSessionToken(session.id, player.cid);
    const {
      balance,
      transactionId,
    } = await this.operatorClient.bet(operator.apiConnectorId,
      player.cid, betData.betInCash, sessionToken, getJackpotRoundId(round.id), correlationId)
      .catch(reason => {
        this.logger.error(`Jackpot bet transaction failed: ${JSON.stringify(betData)}`);
        throw new RpcException(reason);
      });
    try {
      const result = await this.placeBet(betData)
        .then(value => {
          if (value.rc !== 100) { // 100 is the only valid resp code, everything else means errors
            this.logger.error(`Place bet is not accepted, data: ${JSON.stringify(value)}`);
            throw new Error(`Place bet is not accepted, data: ${JSON.stringify(value)}`);
          }
          return value;
        });
      await this.sessionDataManager.setJackpotContributionData(result.eventId, {
        sessionId: session.id,
        playerId: player.cid,
        roundId: round.id,
        operatorConnector: operator.apiConnectorId,
        betInCash: betData.betInCash,
        currency: betData.currency,
        contributionDetails: result,
      });
    } catch (err) {
      await this.operatorClient.cancelBet(
        operator.apiConnectorId, player.cid, betData.betInCash, sessionToken,
        getJackpotRoundId(round.id), transactionId, correlationId,
      ).catch(reason => {
        this.logger.error(`Jackpot cancelBet transaction failed: ${reason.message}`);
        throw new RpcException(reason);
      });
      throw new RpcException(err);
    }
    await this.roundRepo.increment({ id: round.id }, 'jackpotContribution',
      betData.playerContributionAmount);
    await this.sessionDataManager.setJackpotTransactionId(round.id, transactionId);
    this.playerPublisher.notifyBalance(session.id, { valueInCash: balance });
    await this.monitoringWorkerClient.sendEventLogMessage({
      eventType: EventType.JACKPOT_BET_PLACED,
      source: EventSource.GAME,
      params: {
        sum: betData.betInCash,
        currency: betData.currency,
        sessionId: session.id,
        machineSerial: machine.serial,
        round: round.id,
      },
    });
  }

  public async jackpotWinCallback(data: JackpotWinDto, correlationId: string = uuidv4()): Promise<any> {
    this.logger.log(`Jackpot win callback: ${JSON.stringify(data)}, correlationId=${correlationId}`);
    const { amountInCurrency, playerId, operatorId } = data.winnerDetails;
    const sessions = await this.sessionRepo.getJackpotTargetSessions(playerId, operatorId);
    const { session: targetSession, round: targetRound } = this.getPayoutTarget(sessions);
    if (!targetSession) {
      throw new NotAcceptableException('No active session to payout jackpot!');
    }
    this.logger.log(`Jackpot payout to: sessionId=${targetSession.id}, roundId=${targetRound?.id}, correlationId=${correlationId}`);

    const { winInCash, winInValue } = this.getWinData(amountInCurrency, targetSession);
    await this.monitoringWorkerClient.sendEventLogMessage({
      eventType: EventType.JACKPOT,
      source: EventSource.GAME,
      params: {
        sum: winInCash,
        currency: targetSession.currency,
        sessionId: targetSession.id,
        machineSerial: targetSession.machine?.serial,
        machineId: targetSession.machine?.id,
        operatorId: targetSession.operator?.id,
        groupId: targetSession.group?.id,
      },
    });
    const {
      roundId,
      transactionId,
      finish,
    } = await this.getPayoutTargetTransaction(targetSession, targetRound);
    const sessionToken = await this.sessionDataManager.getSessionToken(targetSession.id, targetSession.player.cid);
    let payoutData: BalanceData;
    try {
      payoutData = await this.operatorClient.payout(correlationId, targetSession.operator.apiConnectorId,
        targetSession.player.cid, winInCash, sessionToken, roundId, transactionId, finish);
    } catch (err) {
      await this.monitoringWorkerClient.sendAlertMessage({
        alertType: AlertType.CRITICAL,
        source: AlertSource.GAME_CORE,
        severity: AlertSeverity.HIGH,
        description: 'Jackpot payout failed',
        additionalInformation: {
          errorMessage: err.response?.data || err.message,
        },
      });
      this.logger.error(`Jackpot payout failed! error=${JSON.stringify(err.response?.data || err.message)}`);
      throw new HttpException(err.response?.data || { message: err.message },
        err.response?.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const { balance } = payoutData;
    this.playerPublisher.notifyBalance(targetSession.id, { valueInCash: balance });
    await this.sessionRepo.countJackpotWin(targetSession.id, winInValue, winInCash);
    const totalWinInCash = new BigNumber(targetSession.totalWinInCash).plus(winInCash)
      .dp(2).toNumber();
    this.playerPublisher.notifyTotalWin(targetSession.id, { totalWin: totalWinInCash });
    await this.monitoringWorkerClient.sendEventLogMessage({
      eventType: EventType.JACKPOT_PAYOUT,
      source: EventSource.GAME,
      params: {
        sum: winInCash,
        currency: targetSession.currency,
        sessionId: targetSession.id,
        machineSerial: targetSession.machine?.serial,
        machineId: targetSession.machine?.id,
        operatorId: targetSession.operator?.id,
        groupId: targetSession.group?.id,
      },
    });
    await this.checkJackpotWinThreshold(sessions, correlationId);
    return { status: 'ok' };
  }

  private async checkJackpotWinThreshold(sessions: SessionEntity[], correlationId: string): Promise<void> {
    await from(sessions).pipe(
      mergeMap(async session => {
        let message;
        if (session.status === SessionStatus.QUEUE_BET_BEHIND
          || session.status === SessionStatus.VIEWER_BET_BEHIND) {
          const { betBehind } = await this.sessionDataManager.getSessionData(session.id);
          if (betBehind && betBehind.stopIfJackpot) {
            message = {
              type: PlayerMessageType.DISABLE_BET_BEHIND,
              sessionId: session.id,
            };
          }
        }
        if (session.status === SessionStatus.AUTOPLAY) {
          const { autoplay } = await this.sessionDataManager.getSessionData(session.id);
          if (autoplay && autoplay.stopIfJackpot) {
            message = {
              type: PlayerMessageType.DISABLE_AUTOPLAY,
              sessionId: session.id,
            };
          }
        }
        if (session.status === SessionStatus.FORCED_AUTOPLAY) {
          message = {
            type: PlayerMessageType.DISABLE_AUTOPLAY,
            sessionId: session.id,
          };
        }
        if (message) {
          this.rmqPublisher.sendMessage(message, PLAYER_TO_CORE_QUEUE, correlationId);
          return session;
        }
        return null;
      }),
      toArray(),
    ).toPromise().catch(reason => {
      this.logger.error(reason.message, reason.stack);
    });
  }

  private async getPayoutTargetTransaction(
    targetSession: SessionEntity, targetRound?: RoundEntity,
  ): Promise<{ roundId: string; transactionId: string; finish: boolean }> {
    const { operator, player } = targetSession;
    let roundId: string;
    let transactionId: string;
    let finish = false;
    if (targetRound) {
      roundId = getJackpotRoundId(targetRound.id);
      transactionId = await this.sessionDataManager.getJackpotTransactionId(targetRound.id);
      if (!transactionId) {
        roundId = `${targetRound.id}`;
        transactionId = await this.sessionDataManager.getRoundTransactionId(targetRound.id);
      }
    } else {
      const correlationId = uuidv4();
      roundId = `jp-round-id-${targetSession.id}-${correlationId}`;
      finish = true;
      const sessionToken = await this.sessionDataManager.getSessionToken(targetSession.id, player.cid);
      try {
        const betData = await this.operatorClient.bet(operator.apiConnectorId, player.cid,
          0, sessionToken, roundId, correlationId);
        transactionId = betData.transactionId;
      } catch (err) {
        await this.monitoringWorkerClient.sendAlertMessage({
          alertType: AlertType.CRITICAL,
          source: AlertSource.GAME_CORE,
          severity: AlertSeverity.HIGH,
          description: 'Jackpot win fallback bet failed',
          additionalInformation: {
            sessionId: targetSession.id,
            playerId: player.cid,
            round: roundId,
            errorMessage: err.response?.data || err.message,
          },
        });
        this.logger.error(`Jackpot payout failed! error=${JSON.stringify(err.response?.data || err.message)}`);
        throw new HttpException(err.response?.data || { message: err.message },
          err.response?.status || HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
    return { roundId, transactionId, finish };
  }

  private getWinData(
    amountInCurrency: AmountInCurrency[], targetSession: SessionEntity,
  ): { winInCash: number; winInValue: number; } {
    const winDataEUR = amountInCurrency.find(value => value.currency === 'EUR');
    if (!winDataEUR) {
      throw new NotAcceptableException('EUR win amount is missing, cant convert jackpot win');
    }
    const amountInSessionCurrency = amountInCurrency
      .find(value => value.currency === targetSession.currency);
    const winInCash = amountInSessionCurrency
      ? Number(amountInSessionCurrency.amount)
      : toCash(winDataEUR.amount, targetSession.currencyConversionRate);
    return { winInCash, winInValue: Number(winDataEUR.amount) };
  }

  private getPayoutTarget(sessions: SessionEntity[]): { session: SessionEntity, round: RoundEntity } {
    if (!sessions?.length) {
      return { session: null, round: null };
    }
    return sessions
      .sort((a, b) => a.createDate.valueOf() - b.createDate.valueOf())
      .reduce((acc: { session: SessionEntity, round: RoundEntity }, session) => {
        if (acc.round === null) {
          acc.session = session;
          const activeRound = session.getActiveRound();
          if (activeRound) {
            acc.round = activeRound;
          }
        }
        return acc;
      }, { session: null, round: null });
  }

  public async loginAnonymous(token: string): Promise<any> {
    await this.verifyToken(token);
    try {
      return await this.httpService.put(`${this.baseUrl}/auth/login/anonymous`, {
        authenticationData: {
          authenticationKey: this.authenticationKey,
          authenticationSecret: this.authenticationSecret,
        },
      }).pipe(retryWhen(genericRetryStrategy()), map(value => value.data))
        .toPromise();
    } catch (e) {
      throw new UnauthorizedException(e);
    }
  }

  public async loginPlayer(token: string): Promise<any> {
    const { playerId } = await this.verifyToken(token);
    try {
      return await this.httpService.put(`${this.baseUrl}/auth/login/player`, {
        authenticationData: {
          authenticationKey: this.authenticationKey,
          authenticationSecret: this.authenticationSecret,
          playerId,
        },
      }).pipe(retryWhen(genericRetryStrategy()), map(value => value.data))
        .toPromise();
    } catch (err) {
      throw new UnauthorizedException(err);
    }
  }

  private verifyToken(token: string): Promise<BlueRibbonTokenPayload> {
    return this.tokenVerifier(token, this.authenticationSecret, {
      clockTolerance: 2,
      maxAge: '1h',
      ignoreExpiration: false,
    }).catch(reason => {
      throw new UnauthorizedException('Token verification failed!', reason.message);
    });
  }

  public async cancelContribution(data: CancelDetailsDto): Promise<void> {
    const correlationId = uuidv4();
    this.logger.log(`Cancel contribution, data: ${JSON.stringify(data)}, correlationId: ${correlationId}`);
    const { eventIdToCancel } = data;
    const contributionData = await this.sessionDataManager.getJackpotContributionData(eventIdToCancel);
    await this.sessionDataManager.deleteJackpotContributionData(eventIdToCancel); // try cancelling only once
    if (!contributionData) {
      this.logger.warn(`No contribution data for eventId=${eventIdToCancel}`);
      this.monitoringWorkerClient.sendAlertMessage({
        alertType: AlertType.CRITICAL,
        source: AlertSource.GAME_CORE,
        severity: AlertSeverity.HIGH,
        description: 'Jackpot cancel contribution failed',
        additionalInformation: {
          reason: 'No contribution data',
          cancelData: data,
        },
      });
      return;
    }
    const {
      operatorConnector, betInCash, sessionId, roundId, playerId,
    } = contributionData;
    const sessionToken = await this.sessionDataManager.getSessionToken(sessionId, playerId);
    if (!sessionToken) {
      this.logger.warn(`session token for sessionId=${sessionId} not found, cant cancel contribution`);
      this.monitoringWorkerClient.sendAlertMessage({
        alertType: AlertType.CRITICAL,
        source: AlertSource.GAME_CORE,
        severity: AlertSeverity.HIGH,
        description: 'Jackpot cancel contribution failed',
        additionalInformation: {
          reason: 'No session token',
          contributionData,
          cancelData: data,
        },
      });
      return;
    }
    try {
      const jpRoundTransactionId = await this.sessionDataManager.getJackpotTransactionId(roundId);
      if (jpRoundTransactionId) {
        await this.operatorClient.cancelBet(
          operatorConnector, playerId, betInCash, sessionToken, getJackpotRoundId(roundId),
          jpRoundTransactionId, correlationId,
        );
      } else {
        const cancelRoundId = `cancel-jp-round-id-${sessionId}-${correlationId}`;
        const betData = await this.operatorClient.bet(operatorConnector, playerId,
          0, sessionToken, cancelRoundId, correlationId);
        await this.operatorClient.payout(correlationId, operatorConnector,
          playerId, betInCash, sessionToken, cancelRoundId, betData.transactionId);
      }
    } catch (err) {
      this.logger.error(err.message, err.stack);
      await this.monitoringWorkerClient.sendAlertMessage({
        alertType: AlertType.CRITICAL,
        source: AlertSource.GAME_CORE,
        severity: AlertSeverity.HIGH,
        description: 'Jackpot cancel contribution failed',
        additionalInformation: {
          reason: err.message,
          contributionData,
          cancelData: data,
        },
      });
    }
  }
}
