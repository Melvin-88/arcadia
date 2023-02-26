import { Injectable, OnModuleInit } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { AppLogger } from '../logger/logger.service';
import { ServerRMQ } from '../rmq.server/rmq.server';
import { BusEventType } from './bus.event.type';
import { BaseEvent } from './dto/base.event';
import { BetBehindWinEvent } from './dto/bet.behind.win.event';
import { ChangeQueueEvent } from './dto/change.queue.event';
import { EngageSessionEvent } from './dto/engage.session.event';
import { FinalizeSessionEvent } from './dto/finalize.session.event';
import { JackpotContributeEvent } from './dto/jackpot.contribute.event';
import { QueueUpdatesEvent } from './dto/queue.updates.event';
import { EVENT_BUS_QUEUE } from './event.bus.constants';

@Injectable()
export class EventBusPublisher implements OnModuleInit {
  private server: ServerRMQ;

  constructor(private readonly logger: AppLogger) {
  }

  public async onModuleInit(): Promise<void> {
    this.server = ServerRMQ.getInstance();
    await this.server.setupChannel(new Set([EVENT_BUS_QUEUE]));
  }

  public sendEvent(payload: BaseEvent, correlationId: string = uuidv4()): void {
    this.logger.log(`Sending event: type=${payload.type}, payload=${JSON.stringify(payload)}, corrId=${correlationId}`);
    this.server.sendMessage({ ...payload, correlationId }, EVENT_BUS_QUEUE);
  }

  public sendBetBehindWin(payload: BetBehindWinEvent, correlationId?: string): void {
    this.sendEvent({ ...payload, type: BusEventType.BET_BEHIND_WIN }, correlationId);
  }

  public finalizeSession(payload: FinalizeSessionEvent, correlationId?: string): void {
    this.sendEvent({ ...payload, type: BusEventType.FINALIZE_SESSION }, correlationId);
  }

  public sendRoundEnd(payload: BaseEvent, correlationId?: string): void {
    this.sendEvent({ ...payload, type: BusEventType.ROUND_END }, correlationId);
  }

  public terminateSession(payload: FinalizeSessionEvent, correlationId?: string): void {
    this.sendEvent({ ...payload, type: BusEventType.TERMINATE_SESSION }, correlationId);
  }

  public sendJackpotContribute(payload: JackpotContributeEvent, correlationId?: string): void {
    this.sendEvent({ ...payload, type: BusEventType.JACKPOT_CONTRIBUTE }, correlationId);
  }

  public engageNextSession(payload: EngageSessionEvent, correlationId?: string): void {
    this.sendEvent({ ...payload, type: BusEventType.ENGAGE_SESSION }, correlationId);
  }

  public queueChange(payload: ChangeQueueEvent, correlationId?: string): void {
    this.sendEvent({ ...payload, type: BusEventType.CHANGE_QUEUE }, correlationId);
  }

  public notifyQueueUpdate(payload: QueueUpdatesEvent, correlationId?: string): void {
    this.sendEvent({ ...payload, type: BusEventType.QUEUE_UPDATES }, correlationId);
  }
}
