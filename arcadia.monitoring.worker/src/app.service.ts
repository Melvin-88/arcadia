import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  AlertRepository,
  connectionNames,
  InjectRepository, OperatorRepository,
} from 'arcadia-dal';
import { Model } from 'mongoose';
import { EventDto, RobotEventDto } from './modules/dto';
import { EventLog } from './modules/schemas';
import { RobotEventLog } from './modules/schemas/robotEventLog.schema';
import { AlertDto } from './modules/dto/alert.dto';
import { AppLogger } from './modules/logger/logger.service';
import { EventSource } from './modules/enum';
import { EventType, RobotEventType } from './modules/coreClient/enum';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(AlertRepository, connectionNames.DATA)
    private readonly alertRepository: AlertRepository,
    @InjectRepository(OperatorRepository, connectionNames.DATA)
    private readonly operatorRepository: OperatorRepository,
    @InjectModel(EventLog.name) private readonly eventLogModel: Model<EventLog>,
    @InjectModel(RobotEventLog.name) private readonly robotEventLogModel: Model<RobotEventLog>,
    private readonly logger: AppLogger,
  ) {
  }

  private async getOperatorIdByConnector(apiConnectorId: string): Promise<number> {
    const operator = await this.operatorRepository.findOneOrFail({ apiConnectorId });
    return operator.id;
  }

  public async handleEventLog(data: EventDto): Promise<void> {
    // eslint-disable-next-line new-cap
    const eventLog = new this.eventLogModel();
    eventLog.source = data.source;
    eventLog.type = data.eventType;
    eventLog.parameters = data.params;
    if (data.params.operatorApiConnectorId) {
      data.params.operatorId = await this.getOperatorIdByConnector(data.params.operatorApiConnectorId);
    }
    eventLog.createdDate = Date.now();
    await eventLog.save();
  }

  public async handleRobotEventLog(data: RobotEventDto): Promise<void> {
    this.logger.log(`robotEvent: ${JSON.stringify(data)}`);
    // eslint-disable-next-line new-cap
    const eventLog = new this.robotEventLogModel();
    eventLog.machineSerial = data.machineSerial;
    eventLog.sessionId = data.sessionId;
    eventLog.type = data.eventType;
    eventLog.data = data.data;
    eventLog.createdDate = Date.now();
    await eventLog.save();
    if (eventLog.type === RobotEventType.ROBOT_ERROR) {
      await this.handleEventLog({ source: EventSource.ROBOT, eventType: EventType.HARDWARE_ISSUE, params: { machineSerial: data.machineSerial } });
    }
  }

  public async createAlert(data: AlertDto): Promise<void> {
    const alert = this.alertRepository.create({
      ...data,
      type: data.alertType,
    });

    await this.alertRepository.save(alert);
  }
}
