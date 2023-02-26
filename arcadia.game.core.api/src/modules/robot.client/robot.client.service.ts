/* eslint-disable max-lines */
import { Injectable, OnModuleInit } from '@nestjs/common';
import { TiltMode } from 'arcadia-dal';
import {
  PLAYER_TO_CORE_QUEUE,
  ROBOT_TO_CORE_QUEUE,
  TO_QUEUE,
} from '../../constants/rabbit.constants';
import { AppLogger } from '../logger/logger.service';
import { CoreMessage } from '../messaging/robot.handling/enum/core.message';
import { ServerRMQ } from '../rmq.server/rmq.server';
import { CoreToRobotMessage } from './robot.interface';

@Injectable()
export class RobotClientService implements OnModuleInit {
  private server: ServerRMQ;

  constructor(private readonly logger: AppLogger) {
  }

  public async onModuleInit(): Promise<void> {
    this.server = ServerRMQ.getInstance();
    await this.server.setupChannel(new Set([PLAYER_TO_CORE_QUEUE, ROBOT_TO_CORE_QUEUE]));
  }

  public sendRobotMessage(message: CoreToRobotMessage, robotSerial: string): void {
    this.logger.log(`Core-to-Robot message: serial: ${robotSerial}, payload: ${JSON.stringify(message)}`);
    const queueName = ServerRMQ.getQueueName(TO_QUEUE, robotSerial);
    this.server.sendMessage(message, queueName);
  }

  public async sendAllowCoinsMessage(coins: number, robotSerial: string, sessionId: number): Promise<void> {
    const message: CoreToRobotMessage = {
      action: CoreMessage.ALLOW_DISPENSING,
      coins,
      session: sessionId,
    };
    await this.sendRobotMessage(message, robotSerial);
  }

  public async sendEngageMessage(sessionId: number, robotSerial: string): Promise<void> {
    const message: CoreToRobotMessage = { action: CoreMessage.ENGAGE, session: sessionId };
    await this.sendRobotMessage(message, robotSerial);
  }

  public sendDisengageMessage(sessionId: number, robotSerial: string): void {
    const message: CoreToRobotMessage = { action: CoreMessage.BREAKUP, session: sessionId };
    this.sendRobotMessage(message, robotSerial);
  }

  public async sendChipValidationMessage(rfid: string, valid: boolean, robotSerial: string): Promise<void> {
    const message: CoreToRobotMessage = {
      action: CoreMessage.CHIP_VALIDATION,
      rfid,
      status: valid ? 'valid' : 'invalid',
    };
    await this.sendRobotMessage(message, robotSerial);
  }

  public sendPushMessage(dispenserId: string, robotSerial: string): void {
    const message: CoreToRobotMessage = {
      action: CoreMessage.PUSH,
      dispenser: dispenserId,
    };
    this.sendRobotMessage(message, robotSerial);
  }

  public async sendSeedMessage(robotSerial: string, toPush: string[], reshuffleCoins: number): Promise<void> {
    const message: CoreToRobotMessage = {
      action: CoreMessage.SEED,
      dispensers: toPush,
      reshuffleCoins,
    };
    await this.sendRobotMessage(message, robotSerial);
  }

  public async sendStopMessage(serial: string): Promise<void> {
    const message: CoreToRobotMessage = {
      action: CoreMessage.STOP,
    };
    await this.sendRobotMessage(message, serial);
  }

  public async sendBlockMessage(serial: string): Promise<void> {
    const message: CoreToRobotMessage = {
      action: CoreMessage.BLOCK_DISPENSING,
    };
    await this.sendRobotMessage(message, serial);
  }

  public async sendAutoplayMessage(serial: string, sessionId: number, mode?: TiltMode): Promise<void> {
    await this.sendRobotMessage({
      action: CoreMessage.AUTO,
      session: sessionId,
      mode,
    }, serial);
  }

  public async sendStopAutoplayMessage(serial: string, sessionId: number): Promise<void> {
    await this.sendRobotMessage({
      action: CoreMessage.STOP_AUTO,
      session: sessionId,
    }, serial);
  }

  public async sendReshuffle(serial: string): Promise<void> {
    await this.sendRobotMessage({ action: CoreMessage.RESHUFFLE }, serial);
  }
}
