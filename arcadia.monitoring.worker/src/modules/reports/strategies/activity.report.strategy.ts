/* eslint-disable max-lines */
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { concatMap, mergeMap, toArray } from 'rxjs/operators';
import * as _ from 'lodash';
import * as objectHash from 'object-hash';
import BigNumber from 'bignumber.js';
import * as moment from 'moment';
import {
  ActivityReportEntity,
  ActivityReportRepository,
  connectionNames,
  DeleteResult,
  getUniqArray,
  InjectRepository,
  omitReportParams,
  RoundStatus,
  RoundType,
  SessionArchiveReportStreamInterface,
  SessionArchiveRepository,
} from 'arcadia-dal';
import { Observable } from 'rxjs';
import { AbstractReportStrategy } from './abstract.report.strategy';

@Injectable()
export class ActivityReportStrategy extends AbstractReportStrategy {
  constructor(
    @InjectRepository(ActivityReportRepository, connectionNames.DATA)
    private readonly activityReportRepository: ActivityReportRepository,
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

      const entities = Object.entries(groupedData).reduce((accumulator: ActivityReportEntity[], [groupingValue, data]) => {
        const roundsMetrics = data.reduce((
          accumulator: {
              totalBets: number,
              totalWins: number,
              totalRefunds: number,
              totalAutoplayBets: number,
              totalAutoplayWins: number,
              totalBehindBets: number,
              totalBehindWins: number,
              totalVoucherBets: number,
              totalVoucherWins: number,
              autoplaySessions: { [id: number]: boolean },
              betBehindSessions: { [id: number]: boolean },
            },
          session,
        ) => {
          session.round_bet && (accumulator.totalBets += +session.round_bet);
          session.round_wins && (accumulator.totalWins += +session.round_wins);

          (session.round_type === RoundType.BET_BEHIND && session.round_bet) && (accumulator.totalBehindBets += +session.round_bet);
          (session.round_type === RoundType.BET_BEHIND && session.round_wins) && (accumulator.totalBehindWins += +session.round_wins);

          (session.round_type === RoundType.VOUCHER && session.round_status === RoundStatus.COMPLETED) && (accumulator.totalVoucherBets += +session.denomination);
          (session.round_type === RoundType.VOUCHER && session.round_wins) && (accumulator.totalVoucherWins += +session.round_wins);

          session.round_bet && session.round_status === RoundStatus.TERMINATED && (accumulator.totalRefunds += +session.round_bet);

          session.round_bet && session.round_is_autoplay && (accumulator.totalAutoplayBets += +session.round_bet);
          session.round_wins && session.round_is_autoplay && (accumulator.totalAutoplayWins += +session.round_wins);

          if (session.round_is_autoplay && !accumulator.autoplaySessions[session.id]) {
            accumulator.autoplaySessions[session.id] = true;
          }

          if (session.round_type === RoundType.BET_BEHIND && !accumulator.betBehindSessions[session.id]) {
            accumulator.betBehindSessions[session.id] = true;
          }

          return accumulator;
        }, {
          totalBets: 0,
          totalWins: 0,
          totalRefunds: 0,
          totalAutoplayBets: 0,
          totalAutoplayWins: 0,
          totalBehindBets: 0,
          totalBehindWins: 0,
          totalVoucherBets: 0,
          totalVoucherWins: 0,
          autoplaySessions: {},
          betBehindSessions: {},
        });

        const uniqSessions = Object.values(_.groupBy(data, item => item.id)).map(((value: any[]) => value.pop()));
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
              newPlayers: { [cid: number]: boolean },
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

          const inPlayTime = session.duration - session.viewer_duration - session.queue_duration;

          accumulator.totalInPlayTime += inPlayTime;

          (inPlayTime > accumulator.maxInPlayTime) && (accumulator.maxInPlayTime = inPlayTime);
          (+session.queue_duration > accumulator.maxQueueTime) && (accumulator.maxQueueTime = +session.queue_duration);
          (+session.viewer_duration > accumulator.maxWatchTime) && (accumulator.maxWatchTime = +session.viewer_duration);

          if (session.player_create_date
              && session.start_date
              && moment(session.player_create_date).isSame(session.start_date, 'day')
              && !accumulator.newPlayers[session.id]) {
            accumulator.newPlayers[session.player_cid] = true;
          }

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
          newPlayers: {},
        });

        const readyReportItem: ActivityReportEntity = {
          date: moment(data[0].day).format('YYYY-MM-DD'),
          groupingKey: payload.params.groupBy,
          groupingValue,
          params,
          paramsHash,
          totalNewPlayers: Object.keys(sessionsMetrics.newPlayers).length,
          totalUniqueSessions: uniqSessions.length,
          totalSessionTime: sessionsMetrics.totalSessionTime,
          totalRoundsPlayed: totalRounds,
          totalBets: roundsMetrics.totalBets,
          totalWins: roundsMetrics.totalWins,
          totalBehindBets: roundsMetrics.totalBehindBets,
          totalBehindWins: roundsMetrics.totalBehindWins,
          totalVoucherBets: roundsMetrics.totalVoucherBets,
          totalVoucherWins: roundsMetrics.totalVoucherWins,
          totalRefunds: roundsMetrics.totalRefunds,
          totalGrossGaming: new BigNumber(roundsMetrics.totalBets)
            .minus(roundsMetrics.totalWins)
            .minus(roundsMetrics.totalRefunds)
            .toNumber(),
          totalNetGaming: new BigNumber(roundsMetrics.totalBets)
            .minus(roundsMetrics.totalWins)
            .minus(roundsMetrics.totalRefunds)
            .toNumber(),
          totalWatchTime: sessionsMetrics.totalWatchTime,
          maxWatchTime: sessionsMetrics.maxWatchTime,
          totalQueueTime: sessionsMetrics.totalQueueTime,
          maxQueueTime: sessionsMetrics.maxQueueTime,
          totalInPlayTime: sessionsMetrics.totalInPlayTime,
          maxInPlayTime: sessionsMetrics.maxInPlayTime,
          totalAutoplaySessions: Object.keys(roundsMetrics.autoplaySessions).length,
          totalAutoplayBets: roundsMetrics.totalAutoplayBets,
          totalAutoplayWins: roundsMetrics.totalAutoplayWins,
          totalSessionsWatch: sessionsMetrics.totalSessionsWatch,
          totalSessionsQueue: sessionsMetrics.totalSessionsQueue,
          totalSessionsBehind: Object.keys(roundsMetrics.betBehindSessions).length,
          totalSessionsInPlay: sessionsMetrics.totalSessionsInPlay,
          isCompleted: !moment(data[0].day).isSameOrAfter(moment().startOf('day')),
        } as ActivityReportEntity;

        accumulator.push(readyReportItem);

        return accumulator;
      }, []);

      try {
        await this.activityReportRepository.save(entities, { transaction: true });
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
        totalNewPlayers: 0,
        totalUniqueSessions: 0,
        totalSessionTime: 0,
        totalRoundsPlayed: 0,
        totalBets: 0,
        totalWins: 0,
        totalBehindBets: 0,
        totalBehindWins: 0,
        totalVoucherBets: 0,
        totalVoucherWins: 0,
        totalRefunds: 0,
        totalGrossGaming: 0,
        totalNetGaming: 0,
        totalWatchTime: 0,
        maxWatchTime: 0,
        totalQueueTime: 0,
        maxQueueTime: 0,
        totalInPlayTime: 0,
        maxInPlayTime: 0,
        totalAutoplaySessions: 0,
        totalAutoplayBets: 0,
        totalAutoplayWins: 0,
        totalSessionsWatch: 0,
        totalSessionsQueue: 0,
        totalSessionsBehind: 0,
        totalSessionsInPlay: 0,
        isCompleted: !moment(date).isSameOrAfter(moment().startOf('day')),
      }));

      await this.activityReportRepository.save(entities);
    },
    ))
      .toPromise();
  }

  public removeEmptyRecords(paramsHash: string): Promise<DeleteResult> {
    return this.activityReportRepository.delete({ paramsHash, groupingKey: null });
  }

  protected getDataStream(payload: any): Promise<Observable<SessionArchiveReportStreamInterface[]>> {
    return this.sessionArchiveRepository.getSessionArchiveReportStream(payload);
  }
}
