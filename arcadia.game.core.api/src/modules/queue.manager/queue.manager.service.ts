/* eslint-disable max-lines */
import { Injectable } from '@nestjs/common';
import {
  connectionNames,
  InjectRepository,
  QueueRepository,
  SessionEntity,
  SessionStatus,
} from 'arcadia-dal';
import { EventSource, EventType } from '../monitoring.worker.client/enum';
import { MonitoringWorkerClientService } from '../monitoring.worker.client/monitoring.worker.client.service';
import { PlayerClientService } from '../player.client/player.client.service';
import { getSessionHash } from '../session/session.hash';
import { QueueMessageDto } from './dto/queue.message.dto';

@Injectable()
export class QueueManagerService {
  constructor(
    @InjectRepository(QueueRepository, connectionNames.DATA)
    private readonly queueRepo: QueueRepository,
    private readonly monitoringService: MonitoringWorkerClientService,
    private readonly playerPublisher: PlayerClientService,
  ) {
  }

  private getQueueUpdateMessage(sessions: SessionEntity[]): QueueMessageDto {
    const message: QueueMessageDto = { queue: [], viewers: 0 };
    if (!sessions?.length) {
      return message;
    }
    return sessions
      .sort((a, b) => (
        (a.buyDate ? a.buyDate.valueOf() : Date.now()) - (b.buyDate ? b.buyDate.valueOf() : Date.now())))
      .reduce((accum, session) => {
        switch (session.status) {
          case SessionStatus.VIEWER:
          case SessionStatus.VIEWER_BET_BEHIND:
            // eslint-disable-next-line no-param-reassign
            accum.viewers += 1;
            break;
          case SessionStatus.QUEUE:
          case SessionStatus.QUEUE_BET_BEHIND:
          case SessionStatus.PLAYING:
          case SessionStatus.AUTOPLAY:
          case SessionStatus.FORCED_AUTOPLAY:
            accum.queue.push({
              queueToken: getSessionHash(session),
              stacks: session.roundsLeft,
              status: session.status,
            });
            break;
          default:
        }
        return accum;
      }, message);
  }

  public async notifyQueueUpdate(queueId: number, eventLogSession?: SessionEntity): Promise<void> {
    const queue = await this.queueRepo.findOne(queueId,
      { relations: ['sessions', 'machine'] });
    const message = this.getQueueUpdateMessage(queue.sessions);
    if (eventLogSession) {
      const position = queue.sessions.findIndex(s => s.id === eventLogSession.id);
      await this.monitoringService.sendEventLogMessage({
        eventType: EventType.QUEUE_POSITION,
        source: EventSource.GAME,
        params: {
          machineSerial: queue.machine.serial,
          sessionId: eventLogSession.id,
          position,
        },
      });
    }
    this.playerPublisher.notifyQueueUpdate(queue.machine.serial, message);
  }
}
