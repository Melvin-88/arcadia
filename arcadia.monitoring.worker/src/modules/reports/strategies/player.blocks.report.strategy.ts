import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { concatMap, mergeMap, toArray } from 'rxjs/operators';
import * as _ from 'lodash';
import * as objectHash from 'object-hash';
import * as moment from 'moment';
import {
  connectionNames,
  DeleteResult,
  omitReportParams,
  InjectRepository,
  PlayerBlocksReportRepository,
  ChangeRepository,
  ChangeReportStreamInterface,
  PlayerBlocksReportEntity,
  PlayerStatus,
} from 'arcadia-dal';
import { Observable } from 'rxjs';
import { AbstractReportStrategy } from './abstract.report.strategy';

@Injectable()
export class PlayerBlocksReportStrategy extends AbstractReportStrategy {
  constructor(
    @InjectRepository(PlayerBlocksReportRepository, connectionNames.DATA)
    private readonly playerBlocksReportRepository: PlayerBlocksReportRepository,
    @InjectRepository(ChangeRepository, connectionNames.AUDIT)
    private readonly changeRepository: ChangeRepository,
  ) {
    super();
  }

  public async processData(payload: any): Promise<void> {
    const stream = await this.getDataStream(payload);
    const params = omitReportParams(payload.params);
    const paramsHash = objectHash(params);

    return stream.pipe(mergeMap(async (dailyRecords: ChangeReportStreamInterface[]) => {
      const groupedData: Record<string, ChangeReportStreamInterface[]> = _.groupBy(dailyRecords, item => item[payload.params.groupBy]);

      const entities = Object.entries(groupedData).reduce((accumulator: PlayerBlocksReportEntity[], [groupingValue, data]) => {
        const metrics = data.reduce((accumulator: {
            totalBlocked: number,
            totalUnblocked: number,
          }, record) => {
          if (record.old_entity.status === PlayerStatus.ACTIVE && record.new_entity.status === PlayerStatus.BLOCKED) {
            accumulator.totalBlocked += 1;
          } else if (record.old_entity.status === PlayerStatus.BLOCKED && record.new_entity.status === PlayerStatus.ACTIVE) {
            accumulator.totalUnblocked += 1;
          }

          return accumulator;
        }, {
          totalBlocked: 0,
          totalUnblocked: 0,
        });

        const readyReportItem: PlayerBlocksReportEntity = {
          date: moment(data[0].day).format('YYYY-MM-DD'),
          groupingKey: payload.params.groupBy,
          groupingValue,
          params,
          paramsHash,
          totalBlocked: metrics.totalBlocked,
          totalUnblocked: metrics.totalUnblocked,
          isCompleted: !moment(data[0].day).isSameOrAfter(moment().startOf('day')),
        } as PlayerBlocksReportEntity;

        accumulator.push(readyReportItem);

        return accumulator;
      }, []);

      try {
        await this.playerBlocksReportRepository.save(entities, { transaction: true });
      } catch (e) {
        throw new InternalServerErrorException('Failed to save day');
      }

      return dailyRecords[0]?.day;
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
        totalBlocked: 0,
        totalUnblocked: 0,
        isCompleted: !moment(date).isSameOrAfter(moment().startOf('day')),
      }));

      await this.playerBlocksReportRepository.save(entities);
    },
    ))
      .toPromise();
  }

  public removeEmptyRecords(paramsHash: string): Promise<DeleteResult> {
    return this.playerBlocksReportRepository.delete({ paramsHash, groupingKey: null });
  }

  protected getDataStream(payload: any): Promise<Observable<ChangeReportStreamInterface[]>> {
    return this.changeRepository.getPlayerBlocksReportStream(payload);
  }
}
