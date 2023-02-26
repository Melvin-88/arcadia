import * as moment from 'moment';
import { Observable } from 'rxjs';
import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';
import { VoucherEntity } from '../entities';
import { VoucherStatus } from '../enums';
import { Sort, VoucherInterface, VoucherPortalStatisticsInterface } from '../interfaces';
import { VouchersReportStreamInterface } from '../reports/interfaces';
import { setSorting } from '../utils';

@EntityRepository(VoucherEntity)
export class VoucherRepository extends Repository<VoucherEntity> {
  private buildWhereString(filters: any, queryBuilder: SelectQueryBuilder<VoucherEntity>): void {
    queryBuilder.where('');
    if (filters.id || filters.voucherId) {
      queryBuilder.andWhere('voucher.id = :id', { id: filters.id || filters.voucherId });
    }
    if (filters.status) {
      queryBuilder.andWhere('voucher.status IN (:status)', { status: filters.status });
    }
    if (filters.groupName) {
      queryBuilder.andWhere('group.name IN (:groupName)', { groupName: filters.groupName });
    }
    if (filters.operatorName) {
      queryBuilder.andWhere('operator.name IN (:operatorName)', { operatorName: filters.operatorName });
    }
    if (filters.playerCid) {
      queryBuilder.andWhere('voucher.player_cid = :playerCid', { playerCid: filters.playerCid });
    }
    if (filters.grantedDateFrom) {
      queryBuilder.andWhere('voucher.create_date >= :grantedDateFrom', { grantedDateFrom: filters.grantedDateFrom });
    }
    if (filters.grantedDateTo) {
      queryBuilder.andWhere('voucher.create_date <= :grantedDateTo', { grantedDateTo: filters.grantedDateTo });
    }
    if (filters.expirationDateFrom) {
      queryBuilder.andWhere('voucher.expiration_date >= :expirationDateFrom', { expirationDateFrom: filters.expirationDateFrom });
    }
    if (filters.expirationDateTo) {
      queryBuilder.andWhere('voucher.expiration_date <= :expirationDateTo', { expirationDateTo: filters.expirationDateTo });
    }
    if (filters.denomination) {
      queryBuilder.andWhere('session_archive.denominator IN (:denomination)', { denomination: filters.denomination });
    }
    if (filters.operatorId) {
      queryBuilder.andWhere('voucher.operator_id IN (:operatorId)', { operatorId: filters.operatorId });
    }
  }

  private buildQuery(): SelectQueryBuilder<VoucherEntity> {
    return this.createQueryBuilder('voucher')
      .select('voucher.id', 'id')
      .leftJoin('voucher.operator', 'operator')
      .leftJoin('voucher.player', 'player')
      .leftJoin('voucher.group', 'group')
      .leftJoin('voucher.session', 'session')
      .addSelect('voucher.status', 'status')
      .addSelect('voucher.create_date', 'grantedDate')
      .addSelect('voucher.expiration_date', 'expirationDate')
      .addSelect('voucher.revocation_reason', 'revocationReason')
      .addSelect('operator.name', 'operatorName')
      .addSelect('player.cid', 'playerCid')
      .addSelect('session.id', 'sessionId')
      .addSelect('group.name', 'groupName');
  }

  public async getAllVouchers(filters: any): Promise<[VoucherInterface[], number]> {
    let sortParam: Sort = { sort: 'voucher.id', order: 'DESC' };
    if (filters.sortBy) {
      const computedParams = ['operatorName', 'groupName', 'playerCid', 'grantedDate'];
      sortParam = setSorting(this, computedParams, filters.sortBy, filters.sortOrder);
    }
    const vouchersQuery = this.buildQuery();
    this.buildWhereString(filters, vouchersQuery);
    const vouchers = await vouchersQuery
      .addOrderBy(sortParam.sort, sortParam.order)
      .limit(filters.take || 20)
      .offset(filters.offset || 0)
      .getRawMany();

    const countQuery = this.createQueryBuilder('voucher')
      .select('voucher.id', 'id')
      .leftJoin('voucher.operator', 'operator')
      .leftJoin('voucher.player', 'player')
      .leftJoin('voucher.group', 'group')
      .leftJoin('voucher.session', 'session')
      .select('COUNT(*)', 'count');
    this.buildWhereString(filters, countQuery);
    const count = await countQuery.getRawOne();

    vouchers.forEach(v => {
      v.sessionId = parseInt(v.sessionId, 10);
    });

    return [vouchers, parseInt(count.count, 10)];
  }

  public async getVoucherById(id: number): Promise<VoucherInterface> {
    const voucherQuery = this.buildQuery();
    voucherQuery.where('voucher.id = :id', { id });
    return voucherQuery.getRawOne();
  }

  public async getVouchersById(ids: number[]): Promise<VoucherInterface[]> {
    const voucherQuery = this.buildQuery();
    voucherQuery.where('voucher.id IN (:ids)', { ids });
    return voucherQuery.getRawMany();
  }

  public async getVoucherPortalStats(operatorId: number): Promise<VoucherPortalStatisticsInterface> {
    return this.createQueryBuilder('voucher')
      .select('SUM(IF(voucher.status = \'pending\',1,0))', 'inPending')
      .addSelect('SUM(IF(voucher.status = \'used\' AND voucher.update_date > DATE_SUB(NOW(), INTERVAL 24 HOUR),1,0))', 'usedInLast24Hours')
      .addSelect('SUM(IF(voucher.status = \'used\' AND voucher.update_date > DATE_SUB(NOW(), INTERVAL 7 DAY),1,0))', 'usedInLast7Days')
      .addSelect('SUM(IF(voucher.status = \'used\' AND voucher.update_date > DATE_SUB(NOW(), INTERVAL 30 DAY),1,0))', 'usedInLast30Days')
      .where('voucher.operator_id = :operatorId', { operatorId })
      .getRawOne();
  }

  public async getVoucherForSession(operatorId: number, groupId: number, playerCid: string,
  ): Promise<{ voucherId: number; expirationDate: Date } | undefined> {
    const result = await this.createQueryBuilder('v')
      .select('v.id', 'voucherId')
      .addSelect('IF(v.expiration_date IS NULL, (DATE_ADD(CURRENT_DATE(), INTERVAL 50 YEAR)), v.expiration_date)',
        'expirationDate')
      .where('v.operator_id = :operatorId', { operatorId })
      .andWhere('v.group_id = :groupId', { groupId })
      .andWhere('v.player_cid = :playerCid', { playerCid })
      .andWhere('v.status = :status', { status: VoucherStatus.PENDING })
      .andWhere('(v.expiration_date > NOW() OR v.expiration_date IS NULL)')
      .orderBy('expirationDate', 'ASC')
      .getRawOne();
    return result
      ? {
        voucherId: Number(result.voucherId),
        expirationDate: moment(result.expirationDate).toDate(),
      }
      : undefined;
  }

  public async getVouchersReportStream(data: any): Promise<Observable<VouchersReportStreamInterface>> {
    const query = this.createQueryBuilder('voucher')
      .select('voucher.id', 'id')
      .addSelect('voucher.status', 'status')
      .addSelect('voucher.player_cid', 'player')
      .addSelect('CAST(voucher.create_date AS DATE)', 'create_date')
      .addSelect('CAST(voucher.update_date AS DATE)', 'update_date')
      .addSelect('CAST(voucher.expiration_date AS DATE)', 'expiration_date')
      .leftJoin('round_archive', 'round', 'voucher.id=round.voucher_id')
      .addSelect('SUM(round.wins)', 'round_win')
      .leftJoin('round_archive', 'round_archive', 'round_archive.voucher_id=voucher.id')
      .leftJoin('session_archive', 'session_archive', 'round_archive.session_id=session_archive.id')
      .addSelect('session_archive.denominator', 'denomination')
      .leftJoin('voucher.operator', 'operator')
      .addSelect('operator.id', 'operator')
      .groupBy('voucher.id')
      .addGroupBy('session_archive.denominator');

    this.buildWhereString(data.params, query);

    query.andWhere(`(CAST(voucher.create_date AS DATE) IN(${data.daysToCreate.map(day => `CAST('${day}' AS DATE)`).join(',')}) `
      + `OR CAST(voucher.update_date AS DATE) IN(${data.daysToCreate.map(day => `CAST('${day}' AS DATE)`).join(',')}))`)
      .andWhere('operator.id IS NOT NULL');

    const stream = await query.stream();

    return new Observable(subscriber => {
      stream.on('data', (data: VouchersReportStreamInterface) => subscriber.next(data));

      stream.on('end', () => subscriber.complete());

      stream.on('error', error => subscriber.error(error));
    });
  }
}
