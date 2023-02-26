import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {
  connectionNames,
  getRepositoryToken,
  InjectRepository,
  PerformanceDimensionEntity,
  PerformanceDimensionRepository,
  PerformanceIndicatorDimension,
  PerformanceIndicatorEntity,
  PerformanceIndicatorMetric,
  PerformanceIndicatorRepository,
  PerformanceIndicatorSegment,
  PerformanceMetricRepository, PerformanceTrackerRepository, In, PerformanceIndicatorMode,
} from 'arcadia-dal';
import { ContextId, ModuleRef } from '@nestjs/core';
import { DimensionsResponse, MetricsResponse, MonitoringsResponse } from './monitorings.interface';
import { CreateMonitoringDto, EditMonitoringDto } from './monitorings.dto';
import {
  DIMENSION_NOT_FOUND,
  INDICATOR_DELETED,
  INDICATOR_NOT_FOUND,
  METRIC_NOT_FOUND,
  MULTIPLE_SUBSEGMENTS,
} from '../../messages/messages';

@Injectable()
export class MonitoringsService {
  constructor(
      @InjectRepository(PerformanceMetricRepository, connectionNames.DATA) private readonly performanceMetricRepository: PerformanceMetricRepository,
      @InjectRepository(PerformanceDimensionRepository, connectionNames.DATA) private readonly performanceDimensionRepository: PerformanceDimensionRepository,
      @InjectRepository(PerformanceTrackerRepository, connectionNames.DATA) private readonly performanceTrackerRepository: PerformanceTrackerRepository,
      private readonly moduleRef: ModuleRef,
  ) {}

  public async getMonitorings(filters: any, contextId: ContextId): Promise<MonitoringsResponse> {
    const performanceIndicatorRepository: PerformanceIndicatorRepository = await this.moduleRef
      .resolve<PerformanceIndicatorRepository>(getRepositoryToken(PerformanceIndicatorRepository, connectionNames.DATA), contextId);
    const indicatorsAndCountRaw = await performanceIndicatorRepository.getAllIndicators(filters);

    const currentValues = await this.performanceTrackerRepository.find({ where: { indicatorId: In(indicatorsAndCountRaw[0].map(i => i.id)) } });

    return {
      monitoring: indicatorsAndCountRaw[0].map(m => ({
        ...m,
        currentValue: currentValues.filter(v => v.indicatorId === m.id)
          .filter(v => (m.mode === PerformanceIndicatorMode.EACH ? v.subsegmentItem !== 'ALL' : v.subsegmentItem === 'ALL'))
          .map(v => ({ value: v.value, subsegmentItem: v.subsegmentItem })),
      })),
      total: indicatorsAndCountRaw[1],
    };
  }

  public async getMetrics(contextId: ContextId): Promise<MetricsResponse> {
    const performanceMetricRepository: PerformanceMetricRepository = await this.moduleRef
      .resolve<PerformanceMetricRepository>(getRepositoryToken(PerformanceMetricRepository, connectionNames.DATA), contextId);
    const metricsAndCount = await performanceMetricRepository.findAndCount({ where: { isDeleted: false } });
    return {
      metric: metricsAndCount[0].map(m => m.name),
      total: metricsAndCount[1],
    };
  }

  public async getDimensions(contextId: ContextId): Promise<DimensionsResponse> {
    const performanceDimensionRepository: PerformanceDimensionRepository = await this.moduleRef
      .resolve<PerformanceDimensionRepository>(getRepositoryToken(PerformanceDimensionRepository, connectionNames.DATA), contextId);
    const dimensionsAndCount = await performanceDimensionRepository.findAndCount({ where: { isDeleted: false } });
    return {
      dimension: dimensionsAndCount[0].map(d => ({ name: d.name, id: d.id })),
      total: dimensionsAndCount[1],
    };
  }

  private static checkOperatorLatencySettings(dimension: PerformanceDimensionEntity, segment: PerformanceIndicatorSegment): void {
    if (dimension.dimensionType === PerformanceIndicatorDimension.ROUND) {
      throw new BadRequestException('Operator latency metric doesn\'t support round dimensions');
    }
    if (segment === PerformanceIndicatorSegment.GROUP || segment === PerformanceIndicatorSegment.MACHINE) {
      throw new BadRequestException('Operator latency metric doesn\'t support group and machine segments');
    }
  }

  public async createMonitoring(data: CreateMonitoringDto, contextId: ContextId): Promise<void> {
    const performanceIndicatorRepository: PerformanceIndicatorRepository = await this.moduleRef
      .resolve<PerformanceIndicatorRepository>(getRepositoryToken(PerformanceIndicatorRepository, connectionNames.DATA), contextId);

    const metric = await this.performanceMetricRepository.findOne({ where: { name: data.metric, isDeleted: false } });
    if (!metric) {
      throw new NotFoundException(METRIC_NOT_FOUND.en);
    }
    const dimension = await this.performanceDimensionRepository.findOne({ where: { name: data.dimension, isDeleted: false } });
    if (!dimension) {
      throw new NotFoundException(DIMENSION_NOT_FOUND.en);
    }

    if (data.metric === PerformanceIndicatorMetric.OPERATOR_LATENCY) {
      MonitoringsService.checkOperatorLatencySettings(dimension, data.segment);
    }

    if (data.segmentSubset) {
      if (Object.keys(data.segmentSubset).length > 1) {
        throw new BadRequestException(MULTIPLE_SUBSEGMENTS.en);
      }
      const subsegmentKey = Object.keys(data.segmentSubset)[0];
      if (subsegmentKey) {
        if (data.segment !== PerformanceIndicatorSegment.ALL && data.segmentSubset !== {} && subsegmentKey !== data.segment) {
          throw new BadRequestException(`Segment ${data.segment} chosen but ${subsegmentKey} subsegment provided`);
        }
      }
    }

    const indicator = new PerformanceIndicatorEntity();
    indicator.status = data.status;
    indicator.segment = data.segment;
    indicator.subSegment = data.segmentSubset || {};
    indicator.dimension = dimension;
    indicator.metric = metric;
    indicator.mode = data.mode;
    indicator.targetValue = data.targetValue;
    indicator.alertLowThreshold = data.alertLowThreshold;
    indicator.alertHighThreshold = data.alertHighThreshold;
    indicator.cutoffLowThreshold = data.cutoffLowThreshold;
    indicator.cutoffHighThreshold = data.cutoffHighThreshold;

    await performanceIndicatorRepository.save(indicator);
  }

  public async editMonitoring(id: string, data: EditMonitoringDto, contextId: ContextId): Promise<void> {
    const performanceIndicatorRepository: PerformanceIndicatorRepository = await this.moduleRef
      .resolve<PerformanceIndicatorRepository>(getRepositoryToken(PerformanceIndicatorRepository, connectionNames.DATA), contextId);

    const indicator = await performanceIndicatorRepository.findOne(id, { relations: ['dimension'] });
    if (!indicator) {
      throw new NotFoundException(INDICATOR_NOT_FOUND.en);
    }

    if (indicator.isDeleted) {
      throw new BadRequestException(INDICATOR_DELETED.en);
    }

    const dimension = data.dimension ? indicator.dimension : await this.performanceDimensionRepository.findOne({ where: { name: data.dimension, isDeleted: false } });
    if (!dimension) {
      throw new NotFoundException(DIMENSION_NOT_FOUND.en);
    }

    if (data.metric === PerformanceIndicatorMetric.OPERATOR_LATENCY) {
      MonitoringsService.checkOperatorLatencySettings(dimension, data.segment);
    }

    if (data.segmentSubset) {
      if (Object.keys(data.segmentSubset).length > 1) {
        throw new BadRequestException(MULTIPLE_SUBSEGMENTS.en);
      }
      const subsegmentKey = Object.keys(data.segmentSubset)[0];
      if (subsegmentKey) {
        const segment = data.segment || indicator.segment;
        if (subsegmentKey !== segment) {
          throw new BadRequestException(`Segment ${segment} chosen but ${subsegmentKey} subsegment provided`);
        }
      }
    }

    let metric;
    if (data.metric) {
      metric = await this.performanceMetricRepository.findOne({ where: { name: data.metric, isDeleted: false } });
      if (!metric) {
        throw new NotFoundException(METRIC_NOT_FOUND.en);
      }
    }

    indicator.status = data.status || indicator.status;
    indicator.segment = data.segment || indicator.segment;
    indicator.subSegment = data.segmentSubset || indicator.subSegment;
    indicator.dimension = dimension || indicator.dimension;
    indicator.metric = metric || indicator.metric;
    indicator.mode = data.mode || indicator.mode;
    indicator.targetValue = data.targetValue || indicator.targetValue;
    indicator.alertLowThreshold = data.alertLowThreshold || indicator.alertLowThreshold;
    indicator.alertHighThreshold = data.alertHighThreshold || indicator.alertHighThreshold;
    indicator.cutoffLowThreshold = data.cutoffLowThreshold || indicator.cutoffLowThreshold;
    indicator.cutoffHighThreshold = data.cutoffHighThreshold || indicator.cutoffHighThreshold;

    await performanceIndicatorRepository.save(indicator);
  }

  public async removeMonitoring(id: string, contextId: ContextId): Promise<void> {
    const performanceIndicatorRepository: PerformanceIndicatorRepository = await this.moduleRef
      .resolve<PerformanceIndicatorRepository>(getRepositoryToken(PerformanceIndicatorRepository, connectionNames.DATA), contextId);

    const indicator = await performanceIndicatorRepository.findOne(id);
    if (!indicator) {
      throw new NotFoundException(INDICATOR_NOT_FOUND.en);
    }
    if (indicator.isDeleted) {
      throw new BadRequestException(INDICATOR_DELETED.en);
    }

    indicator.isDeleted = true;
    await performanceIndicatorRepository.save(indicator);
  }
}
