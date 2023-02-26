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
  RevenueReportRepository,
  RevenueReportEntity,
  DeleteResult,
  omitReportParams,
  InjectRepository,
  SessionArchiveRepository,
  RoundType,
} from 'arcadia-dal';
import { Observable } from 'rxjs';
import { AbstractReportStrategy } from './abstract.report.strategy';

@Injectable()
export class RevenueReportStrategy extends AbstractReportStrategy {
  constructor(
    @InjectRepository(RevenueReportRepository, connectionNames.DATA)
    private readonly revenueReportRepository: RevenueReportRepository,
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
      const totalPlayersCount = getUniqArray(dailySessions.map(session => session.player_cid)).length;

      const entities = Object.entries(groupedData).reduce((accumulator: RevenueReportEntity[], [groupingValue, data]) => {
        const roundsMetrics = data.reduce((
          accumulator: {
              totalBets: number,
              totalWins: number,
              totalRefunds: number,
              totalAutoplayBets: number,
              totalAutoplayWins: number,
              totalVoucherBets: number;
              totalVoucherWins: number;
              newPlayers: { [cid: number]: boolean },
            },
          session,
        ) => {
          session.round_bet && (accumulator.totalBets += +session.round_bet);
          session.round_wins && (accumulator.totalWins += +session.round_wins);
          (session.round_status === RoundStatus.TERMINATED) && (accumulator.totalRefunds += +session.round_bet);

          session.round_bet && session.round_is_autoplay && (accumulator.totalAutoplayBets += +session.round_bet);
          session.round_wins && session.round_is_autoplay && (accumulator.totalAutoplayWins += +session.round_wins);

          (session.round_type === RoundType.VOUCHER && session.round_status === RoundStatus.COMPLETED) && (accumulator.totalVoucherBets += +session.denomination);
          (session.round_type === RoundType.VOUCHER && session.round_wins) && (accumulator.totalVoucherWins += +session.round_wins);

          if (session.player_create_date
              && session.start_date
              && moment(session.player_create_date).isSame(session.start_date, 'day')
              && !accumulator.newPlayers[session.id]) {
            accumulator.newPlayers[session.player_cid] = true;
          }

          return accumulator;
        }, {
          totalBets: 0,
          totalWins: 0,
          totalRefunds: 0,
          totalAutoplayBets: 0,
          totalAutoplayWins: 0,
          totalVoucherBets: 0,
          totalVoucherWins: 0,
          newPlayers: {},
        });

        const readyReportItem: RevenueReportEntity = {
          date: moment(data[0].day).format('YYYY-MM-DD'),
          groupingKey: payload.params.groupBy,
          groupingValue,
          params,
          paramsHash,
          totalNewPlayers: Object.keys(roundsMetrics.newPlayers).length,
          totalBets: roundsMetrics.totalBets,
          totalWins: roundsMetrics.totalWins,
          totalVoucherBets: roundsMetrics.totalVoucherBets,
          totalVoucherWins: roundsMetrics.totalVoucherWins,
          totalRefunds: roundsMetrics.totalRefunds,
          totalGrossGaming: new BigNumber(roundsMetrics.totalBets).minus(roundsMetrics.totalWins).minus(roundsMetrics.totalRefunds).toNumber(),
          totalNetGaming: new BigNumber(roundsMetrics.totalBets)
            .minus(roundsMetrics.totalWins)
            .minus(roundsMetrics.totalRefunds)
            .toNumber(),
          isCompleted: !moment(data[0].day).isSameOrAfter(moment().startOf('day')),
        } as RevenueReportEntity;

        accumulator.push(readyReportItem);

        return accumulator;
      }, []);

      try {
        await this.revenueReportRepository.save(entities, { transaction: true });
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
        totalBets: 0,
        totalWins: 0,
        totalVoucherBets: 0,
        totalVoucherWins: 0,
        totalRefunds: 0,
        totalGrossGaming: 0,
        totalNetGaming: 0,
        isCompleted: !moment(date).isSameOrAfter(moment().startOf('day')),
      }));

      await this.revenueReportRepository.save(entities);
    }),
    )
      .toPromise();
  }

  public removeEmptyRecords(paramsHash: string): Promise<DeleteResult> {
    return this.revenueReportRepository.delete({ paramsHash, groupingKey: null });
  }

  protected getDataStream(payload: any): Promise<Observable<SessionArchiveReportStreamInterface[]>> {
    return this.sessionArchiveRepository.getSessionArchiveReportStream(payload);
  }
}
