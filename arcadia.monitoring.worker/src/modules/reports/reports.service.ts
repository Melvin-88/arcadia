import {
  ReportMessageDataInterface,
  omitReportParams,
  ReportStatus,
  ProcessedReportRepository,
  connectionNames,
  InjectRepository,
} from 'arcadia-dal';
import * as CacheManager from 'cache-manager';
import { CACHE_MANAGER, HttpService, Inject } from '@nestjs/common';
import * as objectHash from 'object-hash';
import { ReportStrategyFactory } from './strategies/report.strategy.factory';

export class ReportsService {
  constructor(
    @Inject(ReportStrategyFactory) private readonly reportStrategyFactory: ReportStrategyFactory,
    @Inject(HttpService) private readonly monitoringApi: HttpService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: CacheManager.Cache,
    @InjectRepository(ProcessedReportRepository, connectionNames.DATA)
    private readonly processedReportRepository: ProcessedReportRepository,
  ) {}

  public async prepareReport(payload: ReportMessageDataInterface): Promise<void> {
    const params = omitReportParams(payload.params);
    const paramsHash = objectHash(params);

    const redisRetryKey = this.getRedisRetryKey(payload);

    const reportStrategy = this.reportStrategyFactory.getStrategy(payload.reportType);

    try {
      await this.processedReportRepository.saveReportInfoRecord(payload.reportType, payload.params, ReportStatus.IN_PROGRESS);
      await reportStrategy.processData(payload);
      await this.deleteRetryCount(redisRetryKey);
      await this.processedReportRepository.saveReportInfoRecord(payload.reportType, payload.params, ReportStatus.READY);
    } catch (e) {
      await this.processedReportRepository.saveReportInfoRecord(payload.reportType, payload.params, ReportStatus.ERROR);

      await reportStrategy.removeEmptyRecords(paramsHash);

      const retries = await this.getRetryCount(redisRetryKey);

      if (retries < 3) {
        await this.setRetryCount(redisRetryKey, retries + 1);
        await this.retry(payload);
      } else {
        // TODO: arise alert
        await this.deleteRetryCount(redisRetryKey);

        throw e;
      }

      return;
    }

    await reportStrategy.removeEmptyRecords(paramsHash);
  }

  private async getRetryCount(redisRetryKey: string): Promise<number> {
    return (await this.cacheManager.get<number>(redisRetryKey).then(res => Number(res))) || 0;
  }

  private async setRetryCount(redisRetryKey: string, value: number): Promise<number> {
    return this.cacheManager.set(redisRetryKey, value, { ttl: 1800 });
  }

  private deleteRetryCount(redisRetryKey: string): Promise<void> {
    return this.cacheManager.del(redisRetryKey);
  }

  private getRedisRetryKey(payload: ReportMessageDataInterface): string {
    return `${payload.reportType}-report-retry-key-${objectHash({ ...payload.params, days: payload.daysToCreate })}`;
  }

  private retry(payload: ReportMessageDataInterface): Promise<any> {
    return this.monitoringApi.get(`/api/report/${payload.reportType}`, {
      params: payload.params,
    }).toPromise();
  }
}
