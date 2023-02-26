import {
  Brackets,
  EntityRepository,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import * as _ from 'lodash';
import { ChangeEntity } from '../entitiesAudit';
import { Sort } from '../interfaces';
import { setSorting } from '../utils';
import { AuditAction } from '../enums';
import { ChangeReportStreamInterface } from '../reports/interfaces';

@EntityRepository(ChangeEntity)
export class ChangeRepository extends Repository<ChangeEntity> {
  private buildWhereString(filters: any, queryBuilder: SelectQueryBuilder<ChangeEntity>): void {
    if (filters.entity) {
      queryBuilder.andWhere('change.entityName = :entity', { entity: filters.entity });
    }

    if (filters.startDate) {
      queryBuilder.andWhere('change.created_at_date >= :startDate', { startDate: filters.startDate });
    }

    if (filters.endDate) {
      queryBuilder.andWhere('change.created_at_date <= :endDate', { endDate: filters.endDate });
    }

    if (filters.id) {
      queryBuilder.andWhere(new Brackets(subQuery => {
        subQuery.orWhere('change.oldEntity -> \'$.id\' = :id', { id: filters.id });
        subQuery.orWhere('change.newEntity -> \'$.id\' = :id');
        subQuery.orWhere('change.oldEntity -> \'$.id\' = \':id\'');
        subQuery.orWhere('change.newEntity -> \'$.id\' = \':id\'');
      }));
    }

    if (filters.cid || filters.playerId) {
      queryBuilder.andWhere(new Brackets(subQuery => {
        subQuery.orWhere('change.oldEntity -> \'$.cid\' = :cid', { cid: filters.cid || filters.playerId });
        subQuery.orWhere('change.newEntity -> \'$.cid\' = :cid');
      }));
    }

    if (filters.blockReason) {
      queryBuilder.andWhere(new Brackets(subQuery => {
        subQuery.orWhere(`change.oldEntity -> '$.blockReason' IN(${filters.blockReason.map(r => `'${r}'`).join(', ')})`);
        subQuery.orWhere(`change.newEntity -> '$.blockReason' IN(${filters.blockReason.map(r => `'${r}'`).join(', ')})`);
      }));
    }

    if (filters.operatorId) {
      queryBuilder.andWhere(new Brackets(subQuery => {
        subQuery.orWhere(`change.oldEntity -> '$.operator.id' IN(${filters.operatorId.map(o => `'${o}'`).join(', ')})`);
        subQuery.orWhere(`change.newEntity -> '$.operator.id' IN(${filters.operatorId.map(o => `'${o}'`).join(', ')})`);
      }));
    }
  }

  public async getAllChanges(filters: any): Promise<[ChangeEntity[], number]> {
    let sortParam: Sort = { sort: 'change.created_at_date', order: 'DESC' };
    if (filters.sortBy) {
      if (filters.sortBy === 'date') {
        filters.sortBy = 'createDate';
      }
      if (filters.sortBy === 'name') {
        filters.sortBy = 'user_name';
      }
      if (filters.sortBy === 'id') {
        filters.sortBy = 'user_id';
      }
      if (filters.sortBy === 'email') {
        filters.sortBy = 'user_email';
      }
      sortParam = setSorting(this, ['user_name', 'user_id', 'user_email'], filters.sortBy, filters.sortOrder, true);
    }
    const changesQuery = this.createQueryBuilder('change')
      .leftJoinAndSelect('change.action', 'action')
      .select();

    this.buildWhereString(filters, changesQuery);

    const changes = await changesQuery
      .addOrderBy(sortParam.sort, sortParam.order)
      .limit(filters.take ? filters.take : 20)
      .offset(filters.offset ? filters.offset : 0)
      .getMany();

    const countQuery = this.createQueryBuilder('change')
      .select('COUNT(*)', 'count')
      .leftJoin('change.action', 'action');
    this.buildWhereString(filters, countQuery);
    const count = await countQuery.getRawOne();

    return [changes, parseInt(count.count, 10)];
  }

  public async getPlayerBlocksReportStream(data: any): Promise<any> {
    const query = this.createQueryBuilder('change')
      .select('CAST(change.created_at_date AS DATE)', 'date')
      .addSelect('change.old_entity', 'old_entity')
      .addSelect('change.new_entity', 'new_entity')
      .where(`CAST(change.created_at_date AS DATE) IN(${data.daysToCreate.map(day => `CAST('${day}' AS DATE)`).join(',')})`)
      .andWhere('change.action_type = :type', { type: AuditAction.UPDATE })
      .andWhere('change.entityName = :entity', { entity: 'player' })
      .orderBy('change.created_at_date', 'ASC');

    this.buildWhereString(_.omit(data.params, ['startDate', 'endDate']), query);

    const stream = await query.stream();

    return new Observable(subscriber => {
      let dayBuffer: ChangeReportStreamInterface[] = [];

      stream.on('data', (data: ChangeReportStreamInterface) => {
        data.new_entity = JSON.parse(data.new_entity);
        data.old_entity = JSON.parse(data.old_entity);

        data.player = data.old_entity?.cid;
        data.reason = data.new_entity?.blockReason;
        data.operator = data.new_entity?.operator?.id;
        data.day = moment(data.date).format('YYYY-MM-DD');
        data.month = moment(data.date).format('MM/YYYY');

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
