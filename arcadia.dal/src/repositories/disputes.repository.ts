import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DisputeEntity } from '../entities';
import { DisputeInterface, Sort } from '../interfaces';
import { setSorting } from '../utils';
import { DisputesReportStreamInterface } from '../reports/interfaces';
import { DisputesReportFilterBy } from '../enums';

@EntityRepository(DisputeEntity)
export class DisputeRepository extends Repository<DisputeEntity> {
  private buildWhereString(filters: any, queryBuilder: SelectQueryBuilder<DisputeEntity>): void {
    if (filters.id) {
      queryBuilder.andWhere('dispute.id = :id', { id: filters.id });
    }
    if (filters.status) {
      queryBuilder.andWhere('dispute.status IN (:status)', { status: filters.status });
    }
    if (filters.operatorName) {
      queryBuilder.andWhere('operator.name IN (:operatorName)', { operatorName: filters.operatorName });
    }
    if (filters.operatorId) {
      queryBuilder.andWhere('dispute.operator_id IN (:operatorId)', { operatorId: filters.operatorId });
    }
    if (filters.playerCid) {
      queryBuilder.andWhere('dispute.player_cid = :playerCid', { playerCid: filters.playerCid });
    }
    if (filters.openedAtDateFrom) {
      queryBuilder.andWhere('dispute.create_date >= :openedAtDateFrom', { openedAtDateFrom: filters.openedAtDateFrom });
    }
    if (filters.openedAtDateTo) {
      queryBuilder.andWhere('dispute.create_date <= :openedAtDateTo', { openedAtDateTo: filters.openedAtDateTo });
    }
    if (filters.closedAtDateFrom) {
      queryBuilder.andWhere('dispute.closed_date >= :closedAtDateFrom', { closedAtDateFrom: filters.closedAtDateFrom });
    }
    if (filters.closedAtDateTo) {
      queryBuilder.andWhere('dispute.closed_date <= :closedAtDateTo', { closedAtDateTo: filters.closedAtDateTo });
    }
    if (filters.rebateFrom) {
      queryBuilder.andWhere('dispute.rebate_sum >= :rebateFrom', { rebateFrom: filters.rebateFrom });
    }
    if (filters.rebateTo) {
      queryBuilder.andWhere('dispute.rebate_sum <= :rebateTo', { rebateTo: filters.rebateTo });
    }
    queryBuilder.andWhere('dispute.is_deleted = false');
  }

  public async getAllDisputes(filters: any): Promise<[DisputeInterface[], number]> {
    let sortParam: Sort = { sort: 'dispute.create_date', order: 'DESC' };
    if (filters.sortBy) {
      sortParam = setSorting(this, ['operatorName', 'playerCid', 'sessionId', 'openedAtDate'], filters.sortBy, filters.sortOrder);
    }
    const disputesQuery = this.createQueryBuilder('dispute')
      .select('dispute.id', 'id')
      .leftJoin('dispute.operator', 'operator')
      .leftJoin('dispute.player', 'player')
      .leftJoin('dispute.session', 'session')
      .addSelect('dispute.status', 'status')
      .addSelect('operator.name', 'operatorName')
      .addSelect('operator.id', 'operatorId')
      .addSelect('dispute.player_cid', 'playerCid')
      .addSelect('session.id', 'sessionId')
      .addSelect('dispute.rebate_sum', 'rebateSum')
      .addSelect('dispute.rebate_currency', 'rebateCurrency')
      .addSelect('dispute.create_date', 'openedAtDate')
      .addSelect('dispute.closed_date', 'closedDate')
      .addSelect('dispute.complaint', 'complaint')
      .addSelect('dispute.discussion', 'discussion')
      .where('')
      .addGroupBy('dispute.id');

    this.buildWhereString(filters, disputesQuery);
    const disputes = await disputesQuery
      .addOrderBy(sortParam.sort, sortParam.order)
      .limit(filters.take || 20)
      .offset(filters.offset || 0)
      .getRawMany();

    disputes.forEach(d => {
      d.id = parseInt(d.id, 10);
      d.sessionId = parseInt(d.sessionId, 10);
      d.rebateSum = parseFloat(d.rebateSum);
      d.operatorId = parseInt(d.operatorId, 10);
    });

    const countQuery = this.createQueryBuilder('dispute')
      .leftJoin('dispute.operator', 'operator')
      .leftJoin('dispute.player', 'player')
      .leftJoin('dispute.session', 'session')
      .select('COUNT(*)', 'count')
      .where('');

    this.buildWhereString(filters, countQuery);
    const count = await countQuery.getRawOne();

    return [disputes, parseInt(count.count, 10)];
  }

  public async getDisputeById(id: number): Promise<DisputeInterface> {
    const disputeQuery = this.buildQuery();
    disputeQuery.where('dispute.id = :id', { id });
    return disputeQuery.getRawOne();
  }

  private buildQuery(): SelectQueryBuilder<DisputeEntity> {
    return this.createQueryBuilder('dispute')
      .select('dispute.id', 'id')
      .leftJoin('dispute.operator', 'operator')
      .leftJoin('dispute.player', 'player')
      .leftJoin('dispute.session', 'session')
      .addSelect('operator.id', 'operatorId')
      .addSelect('operator.name', 'operatorName')
      .addSelect('session.id', 'sessionId')
      .addSelect('dispute.player_cid', 'playerCid')
      .addSelect('dispute.status', 'status')
      .addSelect('dispute.create_date', 'openedAtDate')
      .addSelect('dispute.update_date', 'updatedAtDate')
      .addSelect('dispute.closed_date', 'closedAtDate')
      .addSelect('dispute.complaint', 'complaint')
      .addSelect('dispute.discussion', 'discussion')
      .addSelect('dispute.rebate_sum', 'rebateSum')
      .addSelect('dispute.rebate_currency', 'rebateCurrency');
  }

  public async getDisputesReportStream(data: any): Promise<Observable<DisputesReportStreamInterface[]>> {
    const filterByDate = data.params.filterByDate === DisputesReportFilterBy.OPEN ? 'create_date' : 'closed_date';
    const query = this.createQueryBuilder('dispute')
      .select('dispute.id', 'id')
      .addSelect(`CAST(dispute.${filterByDate} AS DATE)`, 'day')
      .addSelect(`CONCAT(MONTH(dispute.${filterByDate}), "/", YEAR(dispute.${filterByDate}))`, 'month')
      .addSelect('dispute.operator_id', 'operator')
      .addSelect('dispute.player_cid', 'player')
      .addSelect('dispute.status', 'status')
      .where(`CAST(dispute.${filterByDate} AS DATE) IN(${data.daysToCreate.map(day => `CAST('${day}' AS DATE)`).join(',')})`)
      .orderBy(`dispute.${filterByDate}`, 'ASC');

    this.buildWhereString(data.params, query);

    const stream = await query.stream();

    return new Observable(subscriber => {
      let dayBuffer: DisputesReportStreamInterface[] = [];

      stream.on('data', (data: DisputesReportStreamInterface) => {
        data.day = moment(data.day).format('YYYY-MM-DD');

        if (dayBuffer.length === 0 || moment(dayBuffer[0].day).format('YYYY-MM-DD') === data.day) {
          dayBuffer.push(data);
        } else {
          subscriber.next(dayBuffer);
          dayBuffer = [data];
        }
      });

      stream.on('end', () => {
        subscriber.next(dayBuffer);
        subscriber.complete();
      });

      stream.on('error', error => {
        subscriber.error(error);
      });
    });
  }
}
