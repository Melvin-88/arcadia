import {
  BadRequestException,
  Inject,
  Injectable,
  Query,
} from '@nestjs/common';
import { ContextId, ModuleRef } from '@nestjs/core';
import {
  AlertStatus, connectionNames, getRepositoryToken, MachineDispenserRepository, MaintenanceType,
} from 'arcadia-dal';
import { AlertsService } from '../alerts/alerts.service';
import { MaintenanceAlertResponse, MaintenanceAlertsResponse } from './maintenance.interface';
import {
  ALERT_FILL_DISPENSER_REQUIRED,
  ALERT_NOT_ACTIVE,
  ALERT_WAIST_EMPTIED_REQUIRED,
  DISPENSER_NOT_FOUND,
} from '../../messages/messages';

@Injectable()
export class MaintenanceService {
  constructor(
        @Inject(AlertsService) private readonly alertsService: AlertsService,
        private readonly moduleRef: ModuleRef,
  ) {}

  public async getAlerts(@Query() query: any, contextId: ContextId): Promise<MaintenanceAlertsResponse> {
    query.maintenanceRequired = true;
    query.status = AlertStatus.ACTIVE;
    return this.alertsService.getAlerts(query, contextId);
  }

  public async dismissAlert(id: number, contextId: ContextId): Promise<MaintenanceAlertResponse> {
    return this.alertsService.dismissAlert(id, contextId);
  }

  public async dispenserFilled(id: number, contextId: ContextId): Promise<void> {
    const machineDispenserRepo: MachineDispenserRepository = await this.moduleRef
      .resolve<MachineDispenserRepository>(getRepositoryToken(MachineDispenserRepository, connectionNames.DATA), contextId);
    const alert = await this.alertsService.getAlert(id, contextId);
    if (alert.status === AlertStatus.DISMISSED) {
      throw new BadRequestException(ALERT_NOT_ACTIVE.en);
    }
    if (!alert.additionalInfo.maintenanceRequired && alert.additionalInfo.maintenanceType !== MaintenanceType.FILL_DISPENSER) {
      throw new BadRequestException(ALERT_FILL_DISPENSER_REQUIRED.en);
    }
    alert.status = AlertStatus.DISMISSED;
    const dispenser = await machineDispenserRepo.findOne({ where: { name: alert.additionalInfo.dispenserName, isDeleted: false } });
    if (!dispenser) {
      throw new BadRequestException(DISPENSER_NOT_FOUND.en);
    }
    dispenser.level = dispenser.capacity;
    await this.alertsService.dismissAlert(alert.id, contextId);
    await machineDispenserRepo.save(dispenser);
  }

  public async waistEmptied(id: number, contextId: ContextId): Promise<void> {
    const alert = await this.alertsService.getAlert(id, contextId);
    if (alert.status === AlertStatus.DISMISSED) {
      throw new BadRequestException(ALERT_NOT_ACTIVE.en);
    }
    if (!alert.additionalInfo.maintenanceRequired && alert.additionalInfo.maintenanceType !== 'waistEmptied') {
      throw new BadRequestException(ALERT_WAIST_EMPTIED_REQUIRED.en);
    }
    await this.dismissAlert(id, contextId);
  }
}