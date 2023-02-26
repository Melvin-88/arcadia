import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  connectionNames,
  DeleteResult,
  InjectRepository,
  omitReportParams,
  VoucherRepository,
  VouchersReportEntity,
  VouchersReportGroupingKeys,
  VouchersReportRepository,
  VouchersReportStreamInterface,
  VoucherStatus,
} from 'arcadia-dal';
import { concatMap, mergeMap, toArray } from 'rxjs/operators';
import * as _ from 'lodash';
import * as moment from 'moment';
import * as objectHash from 'object-hash';
import { Observable } from 'rxjs';
import { AbstractReportStrategy } from './abstract.report.strategy';

@Injectable()
export class VouchersReportStrategy extends AbstractReportStrategy {
  constructor(
    @InjectRepository(VouchersReportRepository, connectionNames.DATA)
    private readonly vouchersReportRepository: VouchersReportRepository,
    @InjectRepository(VoucherRepository, connectionNames.DATA)
    private readonly voucherRepository: VoucherRepository,
  ) {
    super();
  }

  public async processData(payload: any): Promise<void> {
    const params = omitReportParams(payload.params);
    const paramsHash = objectHash(params);

    const stream = await this.getDataStream(payload);

    const aggregatedData = {};

    return stream.pipe(mergeMap(async (voucher: VouchersReportStreamInterface) => {
      const createdMoment = moment(voucher.create_date);
      const updatedDay = moment(voucher.update_date);

      voucher.day = createdMoment.format('YYYY-MM-DD');
      voucher.month = createdMoment.format('MM/YYYY');

      this.initGroupingKey(aggregatedData, voucher, payload.params.groupBy);

      aggregatedData[voucher.day][voucher[payload.params.groupBy]].totalVouchersIssued += 1;

      voucher.day = updatedDay.format('YYYY-MM-DD');
      voucher.month = updatedDay.format('MM/YYYY');

      this.initGroupingKey(aggregatedData, voucher, payload.params.groupBy);

      if (voucher.status === VoucherStatus.USED) {
        aggregatedData[voucher.day][voucher[payload.params.groupBy]].totalVouchersUsed += 1;
        aggregatedData[voucher.day][voucher[payload.params.groupBy]].totalRoundsPlayed += 1;
        aggregatedData[voucher.day][voucher[payload.params.groupBy]].totalVouchersBets += +voucher.denomination;
        aggregatedData[voucher.day][voucher[payload.params.groupBy]].totalVouchersWins += +voucher.round_win;
      } else if (voucher.status === VoucherStatus.EXPIRED) {
        aggregatedData[voucher.day][voucher[payload.params.groupBy]].totalVouchersExpired += 1;
      } else if (voucher.status === VoucherStatus.REVOKED) {
        aggregatedData[voucher.day][voucher[payload.params.groupBy]].totalVouchersCanceled += 1;
      }
    }),
    toArray(),
    concatMap(async () => {
      const entities = [];

      for (const [date, data] of Object.entries(aggregatedData)) {
        for (const [groupingValue, values] of Object.entries(data)) {
          const readyReportItem: VouchersReportEntity = {
            date,
            groupingKey: payload.params.groupBy,
            groupingValue,
            params,
            paramsHash,
            totalVouchersIssued: values.totalVouchersIssued,
            totalVouchersUsed: values.totalVouchersUsed,
            totalVouchersBets: values.totalVouchersBets,
            totalVouchersWins: values.totalVouchersWins,
            totalVouchersExpired: values.totalVouchersExpired,
            totalVouchersCanceled: values.totalVouchersCanceled,
            totalRoundsPlayed: values.totalRoundsPlayed,
            isCompleted: !moment(date).isSameOrAfter(moment().startOf('day')),
          } as VouchersReportEntity;

          entities.push(readyReportItem);
        }
      }

      try {
        await this.vouchersReportRepository.save(entities, { transaction: true });
      } catch (e) {
        console.log(e);
        throw new InternalServerErrorException('Failed to save day');
      }

      const leftDays = _.difference(payload.daysToCreate, Object.keys(aggregatedData));

      const leftEntities = leftDays.map(date => ({
        date,
        groupingKey: payload.params.groupBy,
        groupingValue: null,
        params,
        paramsHash,
        totalVouchersIssued: 0,
        totalVouchersUsed: 0,
        totalVouchersBets: 0,
        totalVouchersWins: 0,
        totalVouchersExpired: 0,
        totalVouchersCanceled: 0,
        totalRoundsPlayed: 0,
        isCompleted: !moment(date).isSameOrAfter(moment().startOf('day')),
      }));

      await this.vouchersReportRepository.save(leftEntities);
    },
    ))
      .toPromise();
  }

  public removeEmptyRecords(paramsHash: string): Promise<DeleteResult> {
    return this.vouchersReportRepository.delete({ paramsHash, groupingKey: null });
  }

  private initGroupingKey(aggregatedData: any, voucher: VouchersReportStreamInterface, groupBy: VouchersReportGroupingKeys): void {
    if (!aggregatedData[voucher.day]) {
      aggregatedData[voucher.day] = {};
    }

    if (!aggregatedData[voucher.day][voucher[groupBy]]) {
      aggregatedData[voucher.day][voucher[groupBy]] = {
        totalVouchersIssued: 0,
        totalVouchersUsed: 0,
        totalVouchersBets: 0,
        totalVouchersWins: 0,
        totalVouchersExpired: 0,
        totalVouchersCanceled: 0,
        totalRoundsPlayed: 0,
      };
    }
  }

  protected getDataStream(payload: any): Promise<Observable<VouchersReportStreamInterface>> {
    return this.voucherRepository.getVouchersReportStream(payload);
  }
}
