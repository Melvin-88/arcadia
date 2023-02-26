import { TiltMode } from 'arcadia-dal';
import { RobotClientService } from './robot.client.service';
import { makeTestModule, robotRmqServerMock } from './mocks/beforeAll.mock';
import { CoreToRobotMessage } from './robot.interface';
import { CoreMessage } from '../messaging/robot.handling/enum/core.message';
import { ServerRMQ } from '../rmq.server/rmq.server';
import { TO_QUEUE } from '../../constants/rabbit.constants';

describe('Robot Client Service (Unit)', () => {
  let robotClientService: RobotClientService;
  let sendRobotMessageSpy: any;

  beforeAll(async () => {
    const moduleFixture = await makeTestModule();
    robotClientService = moduleFixture.get<RobotClientService>(RobotClientService);
    await robotClientService.onModuleInit();
    sendRobotMessageSpy = jest.spyOn(robotClientService, 'sendRobotMessage');
  });

  describe('sendRobotMessage', () => {
    it('should send message to robot using rabbitmq', async () => {
      const sendMessageSpy = jest.spyOn(robotRmqServerMock, 'sendMessage');
      const message: CoreToRobotMessage = {
        action: CoreMessage.ALLOW_DISPENSING,
      };
      await robotClientService.sendRobotMessage(message, '<serial>');
      expect(sendMessageSpy).toBeCalledWith(message, ServerRMQ.getQueueName(TO_QUEUE, '<serial>'));
    });
  });

  describe('sendAllowCoinsMessage', () => {
    it('should send allow coins message', async () => {
      const allowCoinsMessage = {
        action: CoreMessage.ALLOW_DISPENSING,
        coins: 322,
        session: 21,
      };
      await robotClientService.sendAllowCoinsMessage(allowCoinsMessage.coins, '<serial>', allowCoinsMessage.session);
      expect(sendRobotMessageSpy).toBeCalledWith(allowCoinsMessage, '<serial>');
    });
  });

  describe('sendEngageMessage', () => {
    it('should send engage message', async () => {
      const engageMessage = { action: CoreMessage.ENGAGE, session: 21 };
      await robotClientService.sendEngageMessage(engageMessage.session, '<serial>');
      expect(sendRobotMessageSpy).toBeCalledWith(engageMessage, '<serial>');
    });
  });

  describe('sendDisengageMessage', () => {
    it('should send disengage message', async () => {
      const disengageMessage = { action: CoreMessage.BREAKUP, session: 21 };
      await robotClientService.sendDisengageMessage(disengageMessage.session, '<serial>');
      expect(sendRobotMessageSpy).toBeCalledWith(disengageMessage, '<serial>');
    });
  });

  describe('sendChipValidationMessage', () => {
    it('should send chip validation message', async () => {
      const chipValidationMessage = {
        action: CoreMessage.CHIP_VALIDATION,
        rfid: '<rfid>',
        status: 'valid',
      };
      await robotClientService.sendChipValidationMessage(chipValidationMessage.rfid, true, '<serial>');
      expect(sendRobotMessageSpy).toBeCalledWith(chipValidationMessage, '<serial>');
    });
  });

  describe('sendPushMessage', () => {
    it('should send push message', async () => {
      const pushMessage = {
        action: CoreMessage.PUSH,
        dispenser: '<disId>',
      };
      await robotClientService.sendPushMessage('<disId>', '<serial>');
      expect(sendRobotMessageSpy).toBeCalledWith(pushMessage, '<serial>');
    });
  });

  describe('sendStopMessage', () => {
    it('should send stop message', async () => {
      const stopMessage = {
        action: CoreMessage.STOP,
      };
      await robotClientService.sendStopMessage('<serial>');
      expect(sendRobotMessageSpy).toBeCalledWith(stopMessage, '<serial>');
    });
  });

  describe('sendBlockMessage', () => {
    it('should send block message', async () => {
      const blockMessage = {
        action: CoreMessage.BLOCK_DISPENSING,
      };
      await robotClientService.sendBlockMessage('<serial>');
      expect(sendRobotMessageSpy).toBeCalledWith(blockMessage, '<serial>');
    });
  });

  describe('sendAutoplayMessage', () => {
    it('should send autoplay message', async () => {
      const message = {
        action: CoreMessage.AUTO,
        session: 1,
        mode: TiltMode.AUTO,
      };
      await robotClientService.sendAutoplayMessage('<serial>', message.session, message.mode);
      expect(sendRobotMessageSpy).toBeCalledWith(message, '<serial>');
    });
  });

  describe('sendStopAutoplayMessage', () => {
    it('should send stop autoplay message', async () => {
      const message = {
        action: CoreMessage.STOP_AUTO,
        session: 1,
      };
      await robotClientService.sendStopAutoplayMessage('<serial>', message.session);
      expect(sendRobotMessageSpy).toBeCalledWith(message, '<serial>');
    });
  });
});