import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Observable } from 'rxjs';
import {
  connectionNames,
  SessionArchiveReportStreamInterface,
  InjectRepository,
  FunnelReportRepository,
  omitReportParams,
  getUniqArray,
  FunnelReportEntity,
  SessionArchiveRepository,
  DeleteResult,
  RoundType,
} from 'arcadia-dal';
import { concatMap, mergeMap, toArray } from 'rxjs/operators';
import * as _ from 'lodash';
import * as moment from 'moment';
import * as objectHash from 'object-hash';
import { AbstractReportStrategy } from './abstract.report.strategy';

@Injectable()
export class FunnelReportStrategy extends AbstractReportStrategy {
  constructor(
    @InjectRepository(FunnelReportRepository, connectionNames.DATA)
    private readonly funnelReportRepository: FunnelReportRepository,
    @InjectRepository(SessionArchiveRepository, connectionNames.DATA)
    private readonly sessionArchiveRepository: SessionArchiveRepository,
  ) {
    super();
  }

  public async processData(payload: any): Promise<void> {
    const stream = await this.getDataStream(payload);
    const params = omitReportParams(payload.params);
    const paramsHash = objectHash(params);

    return stream.pipe(mergeMap(async (dailySessions: SessionArchiveReportStreamInterface[]) => {
      const groupedData: Record<string, SessionArchiveReportStreamInterface[]> = _.groupBy(dailySessions, item => item[payload.params.groupBy]);

      const entities = Object.entries(groupedData).reduce((accumulator: FunnelReportEntity[], [groupingValue, data]) => {
        const roundsMetrics = data.reduce((accumulator: { betBehindSessions: { [id: number]: boolean } }, session) => {
          if (session.round_type === RoundType.BET_BEHIND && !accumulator.betBehindSessions[session.id]) {
            accumulator.betBehindSessions[session.id] = true;
          }

          return accumulator;
        }, {
          betBehindSessions: {},
        });

        const uniqSessions = Object.values(_.groupBy(data, item => item.id)).map(((value: any[]) => value.pop()));
        const totalUniqueSessions = uniqSessions.length;
        const totalRounds = getUniqArray(data.map(item => item.round_id).filter(id => id)).length;

        const sessionsMetrics = uniqSessions.reduce((
          accumulator: {
              totalSessionTime: number,
              totalWatchTime: number,
              totalQueueTime: number,
              totalInPlayTime: number,
              maxInPlayTime: number,
              maxQueueTime: number,
              maxWatchTime: number,
              totalSessionsQueue: number,
              totalSessionsInPlay: number,
              totalSessionsWatch: number,
              totalSessionsChangeDenomination: number,
            },
          session: SessionArchiveReportStreamInterface,
        ) => {
          accumulator.totalSessionTime += +session.duration;
          accumulator.totalWatchTime += +session.viewer_duration;

          if (session.queue_duration) {
            accumulator.totalQueueTime += +session.queue_duration;
            accumulator.totalSessionsQueue += 1;
          }

          if (!Number.isNaN(+session.viewer_duration) && +session.viewer_duration > 0) accumulator.totalSessionsWatch += 1;

          if (session.round_id) accumulator.totalSessionsInPlay += 1;

          if (session.is_denomination_changed) accumulator.totalSessionsChangeDenomination += 1;

          const inPlayTime = session.duration - session.viewer_duration - session.queue_duration;

          accumulator.totalInPlayTime += inPlayTime;

          (inPlayTime > accumulator.maxInPlayTime) && (accumulator.maxInPlayTime = inPlayTime);
          (+session.queue_duration > accumulator.maxQueueTime) && (accumulator.maxQueueTime = +session.queue_duration);
          (+session.viewer_duration > accumulator.maxWatchTime) && (accumulator.maxWatchTime = +session.viewer_duration);

          return accumulator;
        }, {
          totalSessionTime: 0,
          totalWatchTime: 0,
          totalQueueTime: 0,
          totalInPlayTime: 0,
          maxInPlayTime: 0,
          maxQueueTime: 0,
          maxWatchTime: 0,
          totalSessionsQueue: 0,
          totalSessionsInPlay: 0,
          totalSessionsWatch: 0,
          totalSessionsChangeDenomination: 0,
        });

        const readyReportItem: FunnelReportEntity = {
          date: moment(data[0].day).format('YYYY-MM-DD'),
          groupingKey: payload.params.groupBy,
          groupingValue,
          params,
          paramsHash,
          totalUniqueSessions,
          totalSessionTime: sessionsMetrics.totalSessionTime,
          totalRoundsPlayed: totalRounds,
          totalWatchTime: sessionsMetrics.totalWatchTime,
          maxWatchTime: sessionsMetrics.maxWatchTime,
          totalQueueTime: sessionsMetrics.totalQueueTime,
          maxQueueTime: sessionsMetrics.maxQueueTime,
          totalInPlayTime: sessionsMetrics.totalInPlayTime,
          maxInPlayTime: sessionsMetrics.maxInPlayTime,
          totalSessionsWatch: sessionsMetrics.totalSessionsWatch,
          totalSessionsQueue: sessionsMetrics.totalSessionsQueue,
          totalSessionsBehind: Object.keys(roundsMetrics.betBehindSessions).length,
          totalSessionsInPlay: sessionsMetrics.totalSessionsInPlay,
          totalSessionsChangeDenomination: sessionsMetrics.totalSessionsChangeDenomination,
          isCompleted: !moment(data[0].day).isSameOrAfter(moment().startOf('day')),
        } as FunnelReportEntity;

        accumulator.push(readyReportItem);

        return accumulator;
      }, []);

      try {
        await this.funnelReportRepository.save(entities, { transaction: true });
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
        totalUniqueSessions: 0,
        totalSessionTime: 0,
        totalRoundsPlayed: 0,
        totalWatchTime: 0,
        maxWatchTime: 0,
        totalQueueTime: 0,
        maxQueueTime: 0,
        totalInPlayTime: 0,
        maxInPlayTime: 0,
        totalSessionsWatch: 0,
        totalSessionsQueue: 0,
        totalSessionsBehind: 0,
        totalSessionsInPlay: 0,
        totalSessionsChangeDenomination: 0,
        isCompleted: !moment(date).isSameOrAfter(moment().startOf('day')),
      }));

      await this.funnelReportRepository.save(entities);
    },
    ))
      .toPromise();
  }

  public removeEmptyRecords(paramsHash: string): Promise<DeleteResult> {
    return this.funnelReportRepository.delete({ paramsHash, groupingKey: null });
  }

  protected getDataStream(payload: any): Promise<Observable<SessionArchiveReportStreamInterface[]>> {
    return this.sessionArchiveRepository.getSessionArchiveReportStream(payload);
  }
}
