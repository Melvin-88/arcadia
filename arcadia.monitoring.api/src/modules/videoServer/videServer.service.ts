import { Injectable, Logger } from '@nestjs/common';
import {
  AlertEntity,
  AlertRepository,
  AlertSeverity,
  AlertStatus,
  AlertType,
  connectionNames,
  InjectRepository,
} from 'arcadia-dal';
import { LogDto } from './dto/log.dto';

@Injectable()
export class VideoServerService {
  private readonly logger: Logger = new Logger(VideoServerService.name);

  constructor(
    @InjectRepository(AlertRepository, connectionNames.DATA) private readonly alertRepository: AlertRepository,
  ) {}

  public async pushLog(data: LogDto): Promise<void> {
    this.logger.log(data);
    const existingAlert = await this.alertRepository.findOne({ status: AlertStatus.ACTIVE, description: data.message });
    if (existingAlert) {
      return;
    }
    const alert = new AlertEntity();
    alert.severity = AlertSeverity.MEDIUM; // TODO: Probably remake this api route, because it accepts less data then it's required for alert
    alert.source = data.source;
    alert.type = data.severity as AlertType;
    alert.description = data.message;
    alert.additionalInformation = {};
    await this.alertRepository.save(alert);
  }
}
