import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {
  connectionNames,
  getRepositoryToken,
  SessionRepository,
  SessionStatus,
} from 'arcadia-dal';
import { ContextId, ModuleRef } from '@nestjs/core';
import { v4 as uuidv4 } from 'uuid';
import * as moment from 'moment';
import { SessionResponse, SessionsResponse } from './sessions.interface';
import { SESSION_NOT_FOUND, SESSION_TERMINATE_FORBIDDEN } from '../../messages/messages';
import { MonitoringClientService } from '../monitoring.client/monitoring.client.service';
import { EventLogsResponse } from '../monitoring.client/monitoring.client.interface';
import { GameCoreClientService } from '../game.core.client/game.core.client.service';
import { MyLogger } from '../logger/logger.service';

@Injectable()
export class SessionsService {
  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly monitoringClientService: MonitoringClientService,
    private readonly gameCoreClientService: GameCoreClientService,
    private readonly logger: MyLogger,
  ) {}

  public async getSessions(filters: any, contextId: ContextId): Promise<SessionsResponse> {
    const sessionsRepository: SessionRepository = await this.moduleRef
      .resolve<SessionRepository>(getRepositoryToken(SessionRepository, connectionNames.DATA), contextId);
    const sessionsRaw = await sessionsRepository.getAllSessions(filters);

    const sessions = sessionsRaw[0].map(s => ({
      status: s.status,
      id: s.id,
      groupName: s.groupName,
      machineId: s.machineId,
      operatorName: s.operatorName,
      playerCid: s.playerCid,
      ip: s.playerIp,
      startDate: s.startDate,
      duration: (s.status === SessionStatus.COMPLETED || s.status === SessionStatus.TERMINATED) ? s.duration : moment().diff(s.startDate, 's'),
      rounds: s.rounds,
      totalWinning: s.totalWinning,
      totalNetCash: s.totalNetCash,
      viewerDuration: s.viewerDuration,
      queueDuration: s.queueDuration,
      totalBets: s.totalBets,
      totalStacksUsed: s.totalStacksUsed,
      currency: s.currency,
      clientVersion: s.clientVersion,
      os: s.os,
      deviceType: s.deviceType,
      browser: s.browser,
      systemSettings: s.systemSettings,
      videoUrl: 'N/A', // TODO: ???? Probably from machine's column
    }));
    return {
      total: sessionsRaw[1],
      sessions,
    };
  }

  public async terminateSession(id: number, contextId: ContextId): Promise<SessionResponse> {
    const correlationId = uuidv4();

    this.logger.log(`Terminating session: ${id}, correlationId=${correlationId}`);

    const sessionsRepository: SessionRepository = await this.moduleRef
      .resolve<SessionRepository>(getRepositoryToken(SessionRepository, connectionNames.DATA), contextId);
    const session = await sessionsRepository.findOne({ where: { id, isDeleted: false } });
    if (!session) {
      throw new NotFoundException(SESSION_NOT_FOUND.en);
    }

    if (session.status === SessionStatus.COMPLETED
      || session.status === SessionStatus.TERMINATING
      || session.status === SessionStatus.TERMINATED) {
      throw new BadRequestException(SESSION_TERMINATE_FORBIDDEN.en);
    }

    return this.gameCoreClientService.terminateSession(id, correlationId);
  }

  public async getEventLogs(sessionId: number, filters: any): Promise<EventLogsResponse> {
    return this.monitoringClientService.getEventLogs(sessionId, filters);
  }
}
