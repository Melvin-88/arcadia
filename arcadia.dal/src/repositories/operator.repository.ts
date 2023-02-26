import {
  EntityRepository, getConnection, Repository, SelectQueryBuilder,
} from 'typeorm';
import { DATA } from '../constants';
import { OperatorEntity, VoucherEntity } from '../entities';
import { OperatorInterface, Sort } from '../interfaces';
import { setSorting } from '../utils';

@EntityRepository(OperatorEntity)
export class OperatorRepository extends Repository<OperatorEntity> {
  private buildWhereString(filters: any, queryBuilder: SelectQueryBuilder<OperatorEntity>): void {
    queryBuilder.where('');
    if (filters.id) {
      queryBuilder.andWhere('operator.id = :id', { id: filters.id });
    }
    if (filters.status) {
      queryBuilder.andWhere('operator.status IN (:status)', { status: filters.status });
    }
    if (filters.operatorName) {
      queryBuilder.andWhere('operator.name IN (:name)', { name: filters.operatorName });
    }
    queryBuilder.andWhere('operator.is_deleted = false');
  }

  private buildQuery(): SelectQueryBuilder<OperatorEntity> {
    return this.createQueryBuilder('operator')
      .leftJoin('operator.players', 'players')
      .leftJoin('players.sessions', 'sessions')
      .select('operator.id', 'id')
      .addSelect('operator.name', 'name')
      .addSelect('operator.status', 'status')
      .addSelect('operator.api_connector_id', 'apiConnectorId')
      .addSelect('operator.api_access_token', 'apiAccessToken')
      .addSelect('operator.api_token_expiration_date', 'apiTokenExpirationDate')
      .addSelect('operator.regulation', 'regulation')
      .addSelect('operator.configuration', 'configuration')
      .addSelect('operator.logo_url', 'logoUrl')
      .addSelect('operator.blue_ribbon_id', 'blueRibbonOperatorId')
      .addSelect('operator.voucher_portal_username', 'voucherPortalUsername')
      .addSelect('COUNT(sessions.id)', 'activeSessionsCount')
      .groupBy('operator.id');
  }

  private async getOperatorsGroupsIds(operatorId: number): Promise<number[]> {
    const result = await this.createQueryBuilder('o')
      .innerJoin('o.groups', 'g')
      .select('g.id', 'groupId')
      .where('o.id = :operatorId', { operatorId })
      .getRawMany();
    return result?.length ? result.map(value => Number(value.groupId)) : [];
  }

  private async getOperatorsVoucherIds(operatorId: number): Promise<number[]> {
    const vouchers = await getConnection(DATA).getRepository(VoucherEntity).createQueryBuilder('voucher')
      .select('voucher.id', 'id')
      .where('voucher.operator_id = :id', { id: operatorId })
      .getRawMany();

    return vouchers.map(g => parseInt(g.id, 10));
  }

  public async getAllOperators(filters: any): Promise<[OperatorInterface[], number]> {
    let sortParam: Sort = { sort: 'operator.create_date', order: 'DESC' };
    if (filters.sortBy) {
      sortParam = setSorting(this, [], filters.sortBy, filters.sortOrder);
    }
    const operatorsQuery = this.buildQuery();
    this.buildWhereString(filters, operatorsQuery);
    const operators = await operatorsQuery
      .addOrderBy(sortParam.sort, sortParam.order)
      .limit(filters.take || 20)
      .offset(filters.offset || 0)
      .getRawMany();

    await Promise.all(operators.map(async operator => {
      operator.regulation = JSON.parse(operator.regulation);
      operator.configuration = JSON.parse(operator.configuration);
      operator.id = parseInt(operator.id, 10);
      operator.linkToGroups = await this.getOperatorsGroupsIds(operator.id);
      operator.linkToVouchers = await this.getOperatorsVoucherIds(operator.id);
      operator.activeSessionsCount = parseInt(operator.activeSessionsCount, 10);
    }));

    const countQuery = this.createQueryBuilder('operator')
      .select('operator.id', 'id')
      .select('COUNT(*)', 'count');
    this.buildWhereString(filters, countQuery);
    const count = await countQuery.getRawOne();

    return [operators, parseInt(count.count, 10)];
  }

  public async getOperatorById(id: number): Promise<OperatorInterface> {
    const operatorQuery = this.buildQuery();
    operatorQuery.where('operator.id = :id', { id });
    const operator = await operatorQuery.getRawOne();
    operator.regulation = JSON.parse(operator.regulation);
    operator.configuration = JSON.parse(operator.configuration);
    operator.id = parseInt(operator.id, 10);
    operator.linkToGroups = await this.getOperatorsGroupsIds(operator.id);
    operator.linkToVouchers = await this.getOperatorsVoucherIds(operator.id);

    return operator;
  }
}
