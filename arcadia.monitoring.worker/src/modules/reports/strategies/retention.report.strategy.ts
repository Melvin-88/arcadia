import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  connectionNames,
  InjectRepository,
  RetentionReportRepository,
  DeleteResult,
  omitReportParams,
  PlayerRepository,
  RetentionReportEntity,
  RetentionReportStreamInterface,
  SessionArchiveRepository,
} from 'arcadia-dal';
import * as objectHash from 'object-hash';
import { concatMap, mergeMap, toArray } from 'rxjs/operators';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { AbstractReportStrategy } from './abstract.report.strategy';

@Injectable()
export class RetentionReportStrategy extends AbstractReportStrategy {
  constructor(
    @InjectRepository(RetentionReportRepository, connectionNames.DATA)
    private readonly retentionReportRepository: RetentionReportRepository,
    @InjectRepository(PlayerRepository, connectionNames.DATA)
    private readonly playerRepository: PlayerRepository,
    @InjectRepository(SessionArchiveRepository, connectionNames.DATA)
    private readonly sessionArchiveRepository: SessionArchiveRepository,
  ) {
    super();
  }

  public async processData(payload: any): Promise<void> {
    const stream = await this.getDataStream(payload);
    const params = omitReportParams(payload.params);
    const paramsHash = objectHash(params);
    let playersPlayedDaysData = {};

    return stream.pipe(mergeMap(async (dailySessions: RetentionReportStreamInterface[]) => {
      playersPlayedDaysData = dailySessions.reduce((accumulator: {
          [playerCid: string]: {
            taken: {
              r1: boolean,
              r2: boolean,
              r7: boolean,
              r14: boolean,
              r30: boolean,
            },
          },
        }, session: RetentionReportStreamInterface) => {
        if (!accumulator[session.player_cid]) {
          accumulator[session.player_cid] = {
            taken: {
              r1: false,
              r2: false,
              r7: false,
              r14: false,
              r30: false,
            },
          };
        }

        return accumulator;
      }, playersPlayedDaysData);

      const groupedData: Record<string, RetentionReportStreamInterface[]> = _.groupBy(dailySessions, item => item[payload.params.groupBy]);

      const entities = Object.entries(groupedData).reduce((accumulator: RetentionReportEntity[], [groupingValue, data]) => {
        const retentionMetrics = {
          r1: 0,
          r2: 0,
          r7: 0,
          r14: 0,
          r30: 0,
        };

        data.forEach(session => {
          for (const n of [1, 2, 7, 14, 30]) {
            if (((n !== 1 && playersPlayedDaysData[session.player_cid].taken.r1 && !playersPlayedDaysData[session.player_cid].taken[`r${n}`])
              || (n === 1 && !playersPlayedDaysData[session.player_cid].taken[`r${n}`]))
              && moment(session.player_create_date).add(n - 1, 'days').isSame(session.day, 'day')) {
              retentionMetrics[`r${n}`] += 1;
              playersPlayedDaysData[session.player_cid].taken.r1 = true;
            }
          }
        });

        const readyReportItem: RetentionReportEntity = {
          date: data[0].day,
          groupingKey: payload.params.groupBy,
          groupingValue,
          params,
          paramsHash,
          r1: retentionMetrics.r1,
          r2: retentionMetrics.r2,
          r7: retentionMetrics.r7,
          r14: retentionMetrics.r14,
          r30: retentionMetrics.r30,
          isCompleted: !moment(data[0].day).isSameOrAfter(moment().startOf('day')),
        } as RetentionReportEntity;

        accumulator.push(readyReportItem);

        return accumulator;
      }, []);

      try {
        await this.retentionReportRepository.save(entities, { transaction: true });
      } catch (e) {
        throw new InternalServerErrorException('Failed to save day');
      }

      return dailySessions[0]?.day;
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
        r1: 0,
        r2: 0,
        r7: 0,
        r14: 0,
        r30: 0,
        isCompleted: !moment(date).isSameOrAfter(moment().startOf('day')),
      }));

      await this.retentionReportRepository.save(entities);
    },
    ))
      .toPromise();
  }

  public removeEmptyRecords(paramsHash: string): Promise<DeleteResult> {
    return this.retentionReportRepository.delete({ paramsHash, groupingKey: null });
  }

  protected getDataStream(payload: any): Promise<Observable<RetentionReportStreamInterface[]>> {
    return this.sessionArchiveRepository.getSessionArchiveStreamForRetentionReport(payload);
  }
}
