/* eslint-disable max-lines */
import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { concatMap, mergeMap, toArray } from 'rxjs/operators';
import * as _ from 'lodash';
import * as objectHash from 'object-hash';
import BigNumber from 'bignumber.js';
import * as moment from 'moment';
import {
  connectionNames,
  getUniqArray,
  RoundStatus,
  SessionArchiveReportStreamInterface,
  PlayerStatsReportEntity,
  PlayerStatsReportGroupingKeys,
  PlayerStatsReportRepository,
  DeleteResult,
  omitReportParams,
  InjectRepository,
  SessionArchiveRepository,
  RoundType,
} from 'arcadia-dal';
import { Observable } from 'rxjs';
import { AbstractReportStrategy } from './abstract.report.strategy';

@Injectable()
export class PlayerStatsReportStrategy extends AbstractReportStrategy {
  constructor(
    @InjectRepository(PlayerStatsReportRepository, connectionNames.DATA)
    private readonly playerStatsReportRepository: PlayerStatsReportRepository,
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
      const groupedData: Record<string, SessionArchiveReportStreamInterface[]> = _.groupBy(dailySessions, item => item.player_cid);

      const entities = Object.entries(groupedData).reduce((accumulator: PlayerStatsReportEntity[], [groupingValue, data]) => {
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
          (session.round_status === RoundStatus.TERMINATED) && (accumulator.totalRefunds += +session.round_bet);

          session.round_bet && session.round_is_autoplay && (accumulator.totalAutoplayBets += +session.round_bet);
          session.round_wins && session.round_is_autoplay && (accumulator.totalAutoplayWins += +session.round_wins);

          (session.round_type === RoundType.BET_BEHIND && session.round_bet) && (accumulator.totalBehindBets += +session.round_bet);
          (session.round_type === RoundType.BET_BEHIND && session.round_wins) && (accumulator.totalBehindWins += +session.round_wins);

          (session.round_type === RoundType.VOUCHER && session.round_status === RoundStatus.COMPLETED) && (accumulator.totalVoucherBets += +session.denomination);
          (session.round_type === RoundType.VOUCHER && session.round_wins) && (accumulator.totalVoucherWins += +session.round_wins);

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

          const inPlayTime = new BigNumber(session.duration - session.viewer_duration - session.queue_duration).abs().toNumber();

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
        });

        const readyReportItem: PlayerStatsReportEntity = {
          date: moment(data[0].day).format('YYYY-MM-DD'),
          groupingKey: PlayerStatsReportGroupingKeys.PLAYER,
          groupingValue,
          params,
          paramsHash,
          totalUniqueSessions,
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
          totalAutoplayBets: roundsMetrics.totalAutoplayBets,
          totalAutoplayWins: roundsMetrics.totalAutoplayWins,
          totalSessionsWatch: sessionsMetrics.totalSessionsWatch,
          totalSessionsQueue: sessionsMetrics.totalSessionsQueue,
          totalAutoplaySessions: Object.keys(roundsMetrics.autoplaySessions).length,
          totalSessionsBehind: Object.keys(roundsMetrics.betBehindSessions).length,
          totalSessionsInPlay: sessionsMetrics.totalSessionsInPlay,
          isCompleted: !moment(data[0].day).isSameOrAfter(moment().startOf('day')),
        } as PlayerStatsReportEntity;

        accumulator.push(readyReportItem);

        return accumulator;
      }, []);

      try {
        await this.playerStatsReportRepository.save(entities, { transaction: true });
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
        groupingKey: PlayerStatsReportGroupingKeys.PLAYER,
        groupingValue: null,
        params,
        paramsHash,
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
        totalAutoplayBets: 0,
        totalAutoplayWins: 0,
        totalSessionsWatch: 0,
        totalSessionsQueue: 0,
        totalAutoplaySessions: 0,
        totalSessionsBehind: 0,
        totalSessionsInPlay: 0,
        isCompleted: !moment(date).isSameOrAfter(moment().startOf('day')),
      }));

      await this.playerStatsReportRepository.save(entities);
    }),
    )
      .toPromise();
  }

  public removeEmptyRecords(paramsHash: string): Promise<DeleteResult> {
    return this.playerStatsReportRepository.delete({ paramsHash, groupingKey: null });
  }

  protected getDataStream(payload: any): Promise<Observable<SessionArchiveReportStreamInterface[]>> {
    return this.sessionArchiveRepository.getSessionArchiveReportStream(payload);
  }
}
