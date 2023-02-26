import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  InjectRepository,
  connectionNames,
  DisputesReportRepository,
  omitReportParams,
  DeleteResult,
  DisputeRepository,
  DisputesReportStreamInterface,
  DisputesReportEntity,
} from 'arcadia-dal';
import { concatMap, mergeMap, toArray } from 'rxjs/operators';
import * as _ from 'lodash';
import * as moment from 'moment';
import * as objectHash from 'object-hash';
import { Observable } from 'rxjs';
import { AbstractReportStrategy } from './abstract.report.strategy';

@Injectable()
export class DisputesReportStrategy extends AbstractReportStrategy {
  constructor(
    @InjectRepository(DisputesReportRepository, connectionNames.DATA)
    private readonly disputesReportRepository: DisputesReportRepository,
    @InjectRepository(DisputeRepository, connectionNames.DATA) private readonly disputesRepository: DisputeRepository,
  ) {
    super();
  }

  public async processData(payload: any): Promise<void> {
    const stream = await this.getDataStream(payload);
    const params = omitReportParams(payload.params);
    const paramsHash = objectHash(params);

    return stream.pipe(mergeMap(async (dailyDisputes: DisputesReportStreamInterface[]) => {
      const groupedData: Record<string, DisputesReportStreamInterface[]> = _.groupBy(dailyDisputes, item => item[payload.params.groupBy]);
      const entities = Object.entries(groupedData).reduce((accumulator: DisputesReportEntity[], [groupingValue, data]) => {
        const readyReportItem: DisputesReportEntity = {
          date: moment(data[0].day).format('YYYY-MM-DD'),
          groupingKey: payload.params.groupBy,
          groupingValue,
          params,
          paramsHash,
          totalDisputeCount: data.length,
          isCompleted: !moment(data[0].day).isSameOrAfter(moment().startOf('day')),
        } as DisputesReportEntity;

        accumulator.push(readyReportItem);

        return accumulator;
      }, []);

      try {
        await this.disputesReportRepository.save(entities, { transaction: true });
      } catch (e) {
        throw new InternalServerErrorException('Failed to save day');
      }

      return dailyDisputes[0]?.day;
    }, 3),
    toArray(),
    concatMap(async createdDays => {
      const leftDays = _.difference(payload.daysToCreate, createdDays);

      const entities = leftDays.map(date => ({
        date,
        groupingKey: payload.params.groupBy,
        groupingValue: null,
        params,
        paramsHash,
        totalDisputeCount: 0,
        isCompleted: !moment(date).isSameOrAfter(moment().startOf('day')),
      }));

      await this.disputesReportRepository.save(entities);
    },
    ))
      .toPromise();
  }

  public removeEmptyRecords(paramsHash: string): Promise<DeleteResult> {
    return this.disputesReportRepository.delete({ paramsHash, groupingKey: null });
  }

  protected getDataStream(payload: any): Promise<Observable<DisputesReportStreamInterface[]>> {
    return this.disputesRepository.getDisputesReportStream(payload);
  }
}
