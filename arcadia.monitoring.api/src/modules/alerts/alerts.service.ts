import { Injectable } from '@nestjs/common';
import {
  AlertEntity,
  AlertRepository,
  AlertStatus,
  connectionNames,
  InjectRepository,
} from 'arcadia-dal';
import { AlertCreateDto } from './dto';

@Injectable()
export class AlertsService {
  constructor(
    @InjectRepository(AlertRepository, connectionNames.DATA) private readonly alertRepository: AlertRepository,
  ) {}

  public async createAlert(data: AlertCreateDto): Promise<void> {
    const existingAlert = await this.alertRepository.findOne({
      status: AlertStatus.ACTIVE,
      description: data.description,
    });
    if (existingAlert) {
      return;
    }
    const alert = new AlertEntity();
    alert.severity = data.severity;
    alert.source = data.source;
    alert.type = data.type;
    alert.description = data.description;
    alert.additionalInformation = data.additionalInformation;
    await this.alertRepository.save(alert);
  }
}