/* eslint-disable max-lines */
import { Injectable } from '@nestjs/common';
import {
  ActivityReportRepository,
  ActivityReportResponse,
  connectionNames,
  DisputesReportResponse,
  InjectRepository,
  MachineStatusReportRepository,
  MachineStatusReportResponse,
  omitReportParams,
  PlayerStatsReportRepository,
  PlayerStatsReportResponse,
  FunnelReportResponse,
  FunnelReportRepository,
  ProcessedReportRepository,
  ReportStatus,
  ReportTypes,
  RevenueReportRepository,
  RevenueReportResponse,
  VouchersReportResponse,
  VouchersReportRepository,
  PlayerBlocksReportResponse,
  PlayerBlocksReportRepository,
  RetentionReportResponse,
  RetentionReportRepository,
  DisputesReportRepository,
  ReportAvailabilityInterface,
  AbstractReportInterface,
  AbstractReportResponse,
} from 'arcadia-dal';
import * as objectHash from 'object-hash';
import * as moment from 'moment';
import { WorkerClient } from '../worker.client/worker.client';
import { RetentionReportQueryDto } from './dtos/retention.report.query.dto';
import {
  ActivityReportQueryDto,
  PlayerStatsReportQueryDto,
  RevenueReportQueryDto,
  VouchersReportQueryDto,
  MachineStatusReportQueryDto,
  DisputesReportQueryDto,
  FunnelReportQueryDto,
  PlayerBlocksReportQueryDto,
} from './dtos';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(ActivityReportRepository, connectionNames.DATA)
    private readonly activityReportRepository: ActivityReportRepository,
    @InjectRepository(PlayerStatsReportRepository, connectionNames.DATA)
    private readonly playerStatsReportRepository: PlayerStatsReportRepository,
    @InjectRepository(RevenueReportRepository, connectionNames.DATA)
    private readonly revenueReportRepository: RevenueReportRepository,
    @InjectRepository(VouchersReportRepository, connectionNames.DATA)
    private readonly vouchersReportRepository: VouchersReportRepository,
    @InjectRepository(DisputesReportRepository, connectionNames.DATA)
    private readonly disputesReportRepository: DisputesReportRepository,
    @InjectRepository(RetentionReportRepository, connectionNames.DATA)
    private readonly retentionReportRepository: RetentionReportRepository,
    @InjectRepository(FunnelReportRepository, connectionNames.DATA)
    private readonly funnelReportRepository: FunnelReportRepository,
    @InjectRepository(MachineStatusReportRepository, connectionNames.DATA)
    private readonly machineStatusReportRepository: MachineStatusReportRepository,
    @InjectRepository(ProcessedReportRepository, connectionNames.DATA)
    private readonly processedReportRepository: ProcessedReportRepository,
    private readonly workerClient: WorkerClient,
    @InjectRepository(PlayerBlocksReportRepository, connectionNames.DATA)
    private readonly playerBlocksReportRepository: PlayerBlocksReportRepository,
  ) {}

  public async getActivityReport(params: ActivityReportQueryDto): Promise<ActivityReportResponse> {
    const checkingResults = await this.activityReportRepository.checkReportAvailability(params);

    if (!checkingResults.info.toCreate && !checkingResults.info.inProgress) {
      const report = await this.activityReportRepository.getActivityReport(params);

      await this.processedReportRepository.saveReportInfoRecord(ReportTypes.ACTIVITY, params, ReportStatus.READY);

      return this.prepareReadyReportData(report, params, checkingResults.info);
    }

    if (checkingResults.info.toCreate) {
      await this.processedReportRepository.saveReportInfoRecord(ReportTypes.ACTIVITY, params, ReportStatus.PENDING);

      const omittedParams = omitReportParams(params);
      const paramsHash = objectHash(omittedParams);
      const entities = checkingResults.daysToCreate.map(date => this.activityReportRepository.create({
        paramsHash,
        params: omittedParams,
        date: moment(date).format('YYYY-MM-DD'),
        isCompleted: false,
      }));

      await this.activityReportRepository.save(entities);

      this.workerClient.sendMessage('preparereport', {
        params,
        daysToCreate: checkingResults.daysToCreate,
        reportType: ReportTypes.ACTIVITY,
      });
    }

    return this.prepareInProgressReportData(checkingResults.info);
  }

  public async getDisputesReport(params: DisputesReportQueryDto): Promise<DisputesReportResponse> {
    const checkingResults = await this.disputesReportRepository.checkReportAvailability(params);

    if (!checkingResults.info.toCreate && !checkingResults.info.inProgress) {
      const report = await this.disputesReportRepository.getDisputesReport(params);

      return this.prepareReadyReportData(report, params, checkingResults.info);
    }

    if (checkingResults.info.toCreate) {
      const omittedParams = omitReportParams(params);
      const paramsHash = objectHash(omittedParams);
      const entities = checkingResults.daysToCreate.map(date => this.disputesReportRepository.create({
        paramsHash,
        params: omittedParams,
        date: moment(date).format('YYYY-MM-DD'),
        isCompleted: false,
      }));

      await this.disputesReportRepository.save(entities);

      this.workerClient.sendMessage('preparereport', {
        params,
        daysToCreate: checkingResults.daysToCreate,
        reportType: ReportTypes.DISPUTES,
      });
    }

    return this.prepareInProgressReportData(checkingResults.info);
  }

  public async getPlayerStatsReport(params: PlayerStatsReportQueryDto): Promise<PlayerStatsReportResponse> {
    const checkingResults = await this.playerStatsReportRepository.checkReportAvailability(params);

    if (!checkingResults.info.toCreate && !checkingResults.info.inProgress) {
      const report = await this.playerStatsReportRepository.getPlayerStatsReport(params);

      return this.prepareReadyReportData(report, params, checkingResults.info);
    }

    if (checkingResults.info.toCreate) {
      await this.processedReportRepository.saveReportInfoRecord(ReportTypes.PLAYER_STATS, params, ReportStatus.PENDING);

      const omittedParams = omitReportParams(params);
      const paramsHash = objectHash(omittedParams);
      const entities = checkingResults.daysToCreate.map(date => this.playerStatsReportRepository.create({
        paramsHash,
        params: omittedParams,
        date: moment(date).format('YYYY-MM-DD'),
        isCompleted: false,
      }));

      await this.playerStatsReportRepository.save(entities);

      this.workerClient.sendMessage('preparereport', {
        params,
        daysToCreate: checkingResults.daysToCreate,
        reportType: ReportTypes.PLAYER_STATS,
      });
    }

    return this.prepareInProgressReportData(checkingResults.info);
  }

  public async getRevenueReport(params: RevenueReportQueryDto): Promise<RevenueReportResponse> {
    const checkingResults = await this.revenueReportRepository.checkReportAvailability(params);

    if (!checkingResults.info.toCreate && !checkingResults.info.inProgress) {
      const report = await this.revenueReportRepository.getRevenueReport(params);

      return this.prepareReadyReportData(report, params, checkingResults.info);
    }

    if (checkingResults.info.toCreate) {
      await this.processedReportRepository.saveReportInfoRecord(ReportTypes.REVENUE, params, ReportStatus.PENDING);

      const omittedParams = omitReportParams(params);
      const paramsHash = objectHash(omittedParams);
      const entities = checkingResults.daysToCreate.map(date => this.revenueReportRepository.create({
        paramsHash,
        params: omittedParams,
        date: moment(date).format('YYYY-MM-DD'),
        isCompleted: false,
      }));

      await this.revenueReportRepository.save(entities);

      this.workerClient.sendMessage('preparereport', {
        params,
        daysToCreate: checkingResults.daysToCreate,
        reportType: ReportTypes.REVENUE,
      });
    }

    return this.prepareInProgressReportData(checkingResults.info);
  }

  public async getMachineStatusReport(params: MachineStatusReportQueryDto): Promise<MachineStatusReportResponse> {
    const checkingResults = await this.machineStatusReportRepository.checkReportAvailability(params);

    if (!checkingResults.info.toCreate && !checkingResults.info.inProgress) {
      const report = await this.machineStatusReportRepository.getMachineStatusReport(params);

      return this.prepareReadyReportData(report, params, checkingResults.info);
    }

    if (checkingResults.info.toCreate) {
      await this.processedReportRepository.saveReportInfoRecord(ReportTypes.MACHINE_STATUS, params, ReportStatus.PENDING);

      const omittedParams = omitReportParams(params);
      const paramsHash = objectHash(omittedParams);
      const entities = checkingResults.daysToCreate.map(date => this.machineStatusReportRepository.create({
        paramsHash,
        params: omittedParams,
        date: moment(date).format('YYYY-MM-DD'),
        isCompleted: false,
      }));

      await this.machineStatusReportRepository.save(entities);

      this.workerClient.sendMessage('preparereport', {
        params,
        daysToCreate: checkingResults.daysToCreate,
        reportType: ReportTypes.MACHINE_STATUS,
      });
    }

    return this.prepareInProgressReportData(checkingResults.info);
  }

  public async getVouchersReport(params: VouchersReportQueryDto): Promise<VouchersReportResponse> {
    const checkingResults = await this.vouchersReportRepository.checkReportAvailability(params);

    if (!checkingResults.info.toCreate && !checkingResults.info.inProgress) {
      const report = await this.vouchersReportRepository.getVouchersReport(params);

      return this.prepareReadyReportData(report, params, checkingResults.info);
    }

    if (checkingResults.info.toCreate) {
      const omittedParams = omitReportParams(params);
      const paramsHash = objectHash(omittedParams);
      const entities = checkingResults.daysToCreate.map(date => this.vouchersReportRepository.create({
        paramsHash,
        params: omittedParams,
        date: moment(date).format('YYYY-MM-DD'),
        isCompleted: false,
      }));

      await this.vouchersReportRepository.save(entities);

      this.workerClient.sendMessage('preparereport', {
        params,
        daysToCreate: checkingResults.daysToCreate,
        reportType: ReportTypes.VOUCHERS,
      });
    }

    return this.prepareInProgressReportData(checkingResults.info);
  }

  public async getRetentionReport(params: RetentionReportQueryDto): Promise<RetentionReportResponse> {
    const checkingResults = await this.retentionReportRepository.checkReportAvailability(params);

    if (!checkingResults.info.toCreate && !checkingResults.info.inProgress) {
      const report = await this.retentionReportRepository.getRetentionsReport(params);

      return this.prepareReadyReportData(report, params, checkingResults.info);
    }

    if (checkingResults.info.toCreate) {
      const omittedParams = omitReportParams(params);
      const paramsHash = objectHash(omittedParams);
      const entities = checkingResults.daysToCreate.map(date => this.retentionReportRepository.create({
        paramsHash,
        params: omittedParams,
        date: moment(date).format('YYYY-MM-DD'),
        isCompleted: false,
      }));

      await this.retentionReportRepository.save(entities);

      this.workerClient.sendMessage('preparereport', {
        params,
        daysToCreate: checkingResults.daysToCreate,
        reportType: ReportTypes.RETENTION,
      });
    }

    return this.prepareInProgressReportData(checkingResults.info);
  }

  public async getFunnelReport(params: FunnelReportQueryDto): Promise<FunnelReportResponse> {
    const checkingResults = await this.funnelReportRepository.checkReportAvailability(params);

    if (!checkingResults.info.toCreate && !checkingResults.info.inProgress) {
      const report = await this.funnelReportRepository.getFunnelReport(params);

      return this.prepareReadyReportData(report, params, checkingResults.info);
    }

    if (checkingResults.info.toCreate) {
      const omittedParams = omitReportParams(params);
      const paramsHash = objectHash(omittedParams);
      const entities = checkingResults.daysToCreate.map(date => this.funnelReportRepository.create({
        paramsHash,
        params: omittedParams,
        date: moment(date).format('YYYY-MM-DD'),
        isCompleted: false,
      }));

      await this.funnelReportRepository.save(entities);

      this.workerClient.sendMessage('preparereport', {
        params,
        daysToCreate: checkingResults.daysToCreate,
        reportType: ReportTypes.FUNNEL,
      });
    }

    return this.prepareInProgressReportData(checkingResults.info);
  }

  public async getPlayerBlocksReport(params: PlayerBlocksReportQueryDto): Promise<PlayerBlocksReportResponse> {
    const checkingResults = await this.playerBlocksReportRepository.checkReportAvailability(params);
    if (!checkingResults.info.toCreate && !checkingResults.info.inProgress) {
      const report = await this.playerBlocksReportRepository.getPlayerBlocksReport(params);

      return this.prepareReadyReportData(report, params, checkingResults.info);
    }

    if (checkingResults.info.toCreate) {
      const omittedParams = omitReportParams(params);
      const paramsHash = objectHash(omittedParams);
      const entities = checkingResults.daysToCreate.map(date => this.playerBlocksReportRepository.create({
        paramsHash,
        params: omittedParams,
        date: moment(date).format('YYYY-MM-DD'),
        isCompleted: false,
      }));

      await this.playerBlocksReportRepository.save(entities);
      this.workerClient.sendMessage('preparereport', {
        params,
        daysToCreate: checkingResults.daysToCreate,
        reportType: ReportTypes.PLAYER_BLOCKS,
      });
    }

    return this.prepareInProgressReportData(checkingResults.info);
  }

  private prepareReadyReportData(report: AbstractReportInterface, params: any, info: ReportAvailabilityInterface): AbstractReportResponse {
    return {
      data: report.data,
      total: report.total,
      groupingKey: params.groupBy,
      info,
    };
  }

  private prepareInProgressReportData(info: ReportAvailabilityInterface): AbstractReportResponse {
    return {
      data: [],
      total: 0,
      groupingKey: null,
      info,
    };
  }
}
