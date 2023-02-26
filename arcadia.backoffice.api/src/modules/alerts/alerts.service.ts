import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {
  AlertRepository,
  connectionNames,
  AlertStatus,
  getRepositoryToken,
} from 'arcadia-dal';
import { ContextId, ModuleRef } from '@nestjs/core';
import { AlertResponse, AlertsResponse } from './alerts.interface';
import { ALERT_NOT_ACTIVE, ALERT_NOT_FOUND } from '../../messages/messages';

@Injectable()
export class AlertsService {
  constructor(
      private readonly moduleRef: ModuleRef,
  ) {}

  public async getAlerts(filters: any, contextId: ContextId): Promise<AlertsResponse> {
    const alertRepository: AlertRepository = await this.moduleRef
      .resolve<AlertRepository>(getRepositoryToken(AlertRepository, connectionNames.DATA), contextId);
    const alertsAndCount = await alertRepository.getAllAlerts(filters);
    const alerts = alertsAndCount[0].map(a => ({
      id: parseInt(a.id, 10),
      status: a.status,
      type: a.type,
      severity: a.severity,
      source: a.source,
      date: a.createDate,
      description: a.description,
      additionalInfo: a.additionalInformation,
      isFlagged: a.isFlagged,
    }));
    return {
      total: alertsAndCount[1],
      alerts,
    };
  }

  public async getAlert(id: number, contextId: ContextId): Promise<AlertResponse> {
    const alertRepository: AlertRepository = await this.moduleRef
      .resolve<AlertRepository>(getRepositoryToken(AlertRepository, connectionNames.DATA), contextId);
    const alert = await alertRepository.findOne({ where: { id, isDeleted: false } });
    if (!alert) {
      throw new NotFoundException(ALERT_NOT_FOUND);
    }
    return {
      id: parseInt(alert.id, 10),
      status: alert.status,
      type: alert.type,
      severity: alert.severity,
      source: alert.source,
      date: alert.createDate,
      description: alert.description,
      additionalInfo: alert.additionalInformation,
      isFlagged: alert.isFlagged,
    };
  }

  public async dismissAlert(id: number, contextId: ContextId): Promise<AlertResponse> {
    const alertRepository: AlertRepository = await this.moduleRef
      .resolve<AlertRepository>(getRepositoryToken(AlertRepository, connectionNames.DATA), contextId);

    const alert = await alertRepository.findOne({ where: { id, isDeleted: false } });
    if (!alert) {
      throw new NotFoundException(ALERT_NOT_FOUND.en);
    }
    if (alert.status !== AlertStatus.ACTIVE) {
      throw new BadRequestException(ALERT_NOT_ACTIVE.en);
    }
    alert.status = AlertStatus.DISMISSED;
    const updatedAlert = await alertRepository.save(alert);
    return {
      status: updatedAlert.status,
      id: parseInt(updatedAlert.id, 10),
      type: updatedAlert.type,
      severity: updatedAlert.severity,
      source: updatedAlert.source,
      date: updatedAlert.createDate,
      description: updatedAlert.description,
      additionalInfo: updatedAlert.additionalInformation,
      isFlagged: updatedAlert.isFlagged,
    };
  }

  public async flagAlert(id: number, contextId: ContextId): Promise<AlertResponse> {
    const alertRepository: AlertRepository = await this.moduleRef
      .resolve<AlertRepository>(getRepositoryToken(AlertRepository, connectionNames.DATA), contextId);

    const alert = await alertRepository.findOne({ where: { id, isDeleted: false } });
    if (!alert) {
      throw new NotFoundException(ALERT_NOT_FOUND.en);
    }
    alert.isFlagged = !alert.isFlagged;
    const updatedAlert = await alertRepository.save(alert);
    return {
      status: updatedAlert.status,
      id: parseInt(updatedAlert.id, 10),
      type: updatedAlert.type,
      severity: updatedAlert.severity,
      source: updatedAlert.source,
      date: updatedAlert.createDate,
      description: updatedAlert.description,
      additionalInfo: updatedAlert.additionalInformation,
      isFlagged: updatedAlert.isFlagged,
    };
  }

  public async editJson(id: number, additionalInfo: object, contextId: ContextId): Promise<AlertResponse> {
    const alertRepository: AlertRepository = await this.moduleRef
      .resolve<AlertRepository>(getRepositoryToken(AlertRepository, connectionNames.DATA), contextId);

    const alert = await alertRepository.findOne({ where: { id, isDeleted: false } });
    if (!alert) {
      throw new NotFoundException(ALERT_NOT_FOUND.en);
    }
    alert.additionalInformation = additionalInfo;
    const updatedAlert = await alertRepository.save(alert);
    return {
      status: updatedAlert.status,
      id: parseInt(updatedAlert.id, 10),
      type: updatedAlert.type,
      severity: updatedAlert.severity,
      source: updatedAlert.source,
      date: updatedAlert.createDate,
      description: updatedAlert.description,
      additionalInfo: updatedAlert.additionalInformation,
      isFlagged: updatedAlert.isFlagged,
    };
  }
}
