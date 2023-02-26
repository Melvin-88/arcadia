import {
  ChipEntity,
  ChipTypeEntity,
  GroupEntity,
  MachineEntity,
  OperatorEntity,
  PlayerEntity,
  RoundEntity, SessionEntity
} from 'arcadia-dal';
import { EventBusPublisher } from './event.bus.publisher';
import { eventBusRmqServerMock, makeTestModule } from './mocks/beforeAll.mock';
import { BusEventType } from './bus.event.type';
import { EVENT_BUS_QUEUE } from './event.bus.constants';
import { BetBehindWinEvent } from './dto/bet.behind.win.event';
import { FinalizeSessionEvent } from './dto/finalize.session.event';
import { JackpotContributeEvent } from './dto/jackpot.contribute.event';
import {EngageSessionEvent} from "./dto/engage.session.event";
import {BaseEvent} from "./dto/base.event";

jest.mock('../logger/logger.service');

describe('Event Bus Publisher (Unit)', () => {
  let eventBusPublisher: EventBusPublisher;

  beforeAll(async () => {
    const moduleFixture = await makeTestModule();
    eventBusPublisher = moduleFixture.get<EventBusPublisher>(EventBusPublisher);
    await eventBusPublisher.onModuleInit();
  });

  describe('sendEvent', () => {
    it('should send message using rabbitMQ', async () => {
      const sendMessageSpy = jest.spyOn(eventBusRmqServerMock, 'sendMessage');
      await eventBusPublisher.sendEvent({ type: BusEventType.DEFAULT }, '<corr>');

      expect(sendMessageSpy).toBeCalledWith({ type: BusEventType.DEFAULT, correlationId: '<corr>' }, EVENT_BUS_QUEUE);
    });
  });

  describe('sendBetBehindWin', () => {
    it('should send bet behind win event', async () => {
      const payload: BetBehindWinEvent = {
        chip: new ChipEntity(),
        chipType: new ChipTypeEntity(),
        type: BusEventType.BET_BEHIND_WIN,
      };
      const sendEventSpy = jest.spyOn(eventBusPublisher, 'sendEvent');

      await eventBusPublisher.sendBetBehindWin(payload, '<corr>');

      expect(sendEventSpy).toBeCalledWith(payload, '<corr>');
    });
  });

  describe('sendFinalizeSession', () => {
    it('should send finalize session event', async () => {
      const payload: FinalizeSessionEvent = {
        terminate: true,
        type: BusEventType.FINALIZE_SESSION,
      };
      const sendEventSpy = jest.spyOn(eventBusPublisher, 'sendEvent');

      await eventBusPublisher.finalizeSession(payload, '<corr>');

      expect(sendEventSpy).toBeCalledWith(payload, '<corr>');
    });
  });

  describe('sendRoundEnd', () => {
    it('should send round end event', async () => {
      const payload: BaseEvent = {
        type: BusEventType.ROUND_END,
      };
      const sendEventSpy = jest.spyOn(eventBusPublisher, 'sendEvent');

      await eventBusPublisher.sendRoundEnd(payload, '<corr>');

      expect(sendEventSpy).toBeCalledWith(payload, '<corr>');
    });
  });

  describe('terminateSession', () => {
    it('should send terminate session event', async () => {
      const payload: FinalizeSessionEvent = {
        type: BusEventType.ROUND_END,
      };
      const sendEventSpy = jest.spyOn(eventBusPublisher, 'sendEvent');

      await eventBusPublisher.sendRoundEnd(payload, '<corr>');

      expect(sendEventSpy).toBeCalledWith(payload, '<corr>');
    });
  });

  describe('sendJackpotContribute', () => {
    it('should send jackpot state event', async () => {
      const payload: JackpotContributeEvent = {
        group: new GroupEntity(),
        machine: new MachineEntity(),
        operator: new OperatorEntity(),
        player: new PlayerEntity(),
        round: new RoundEntity(),
        session: new SessionEntity(),
        type: BusEventType.JACKPOT_CONTRIBUTE
      };
      const sendEventSpy = jest.spyOn(eventBusPublisher, 'sendEvent');

      await eventBusPublisher.sendJackpotContribute(payload, '<corr>');

      expect(sendEventSpy).toBeCalledWith(payload, '<corr>');
    });
  });

  describe('engageNextSession', () => {
    it('should send engage next session event', async () => {
      const payload: EngageSessionEvent = {
        machineId: 1,
        type: BusEventType.ENGAGE_SESSION,
      };
      const sendEventSpy = jest.spyOn(eventBusPublisher, 'sendEvent');

      await eventBusPublisher.engageNextSession(payload, '<corr>');

      expect(sendEventSpy).toBeCalledWith(payload, '<corr>');
    });
  });
});