import { NotFoundException } from '@nestjs/common';
import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';
import { GroupEntity, MachineEntity } from '../entities';
import { MachinePowerLine } from '../enums';
import { GroupInterface, Sort } from '../interfaces';
import { setSorting } from '../utils';

@EntityRepository(GroupEntity)
export class GroupRepository extends Repository<GroupEntity> {
  private buildWhereString(filters: any, queryBuilder: SelectQueryBuilder<GroupEntity>): void {
    queryBuilder.where('');
    if (filters.id) {
      queryBuilder.andWhere('group.id IN (:id)', { id: filters.id });
    }
    if (filters.status) {
      queryBuilder.andWhere('group.status IN (:status)', { status: filters.status });
    }
    if (filters.name) {
      queryBuilder.andWhere('group.name LIKE :name', { name: `%${filters.name}%` });
    }
    if (filters.machinesTotal) {
      queryBuilder.andHaving('machinesTotal = :machinesTotal', { machinesTotal: filters.machinesTotal });
    }
    if (filters.machinesIdle) {
      queryBuilder.andHaving('machinesIdle = :machinesIdle', { machinesIdle: filters.machinesIdle });
    }
    if (filters.denominator) {
      queryBuilder.andWhere('group.denominator = :denominator', { denominator: filters.denominator });
    }
    if (filters.operators) {
      queryBuilder.andWhere('operator.id IN (:...ops)', { ops: filters.operators });
    }
    if (filters.hasJackpot) {
      queryBuilder.andWhere('group.has_jackpot = :hasJackpot', { hasJackpot: filters.hasJackpot });
    }
    queryBuilder.andWhere('group.is_deleted = false');
  }

  private buildQuery(): SelectQueryBuilder<GroupEntity> {
    return this.createQueryBuilder('group')
      .leftJoin('group.machines', 'machines')
      .leftJoin('group.operators', 'operator')
      .select('group.id', 'id')
      .addSelect('group.status', 'status')
      .addSelect('group.name', 'name')
      .addSelect('group.blue_ribbon_game_id', 'blueRibbonGameId')
      .addSelect('group.color', 'color')
      .addSelect('IF(group.blue_ribbon_game_id > \'\', 1, 0)', 'hasJackpot')
      .addSelect('SUM(IF(machines.status = \'stopped\', 1, 0))', 'machinesIdle')
      .addSelect('COUNT(machines.id)', 'machinesTotal')
      .addSelect(`SUM(IF(machines.power_line = '${MachinePowerLine.LINE_A}', 1, 0))`, 'totalPowerLineA')
      .addSelect(`SUM(IF(machines.power_line = '${MachinePowerLine.LINE_B}', 1, 0))`, 'totalPowerLineB')
      .addSelect('COUNT(operator.id)', 'operators')
      .addSelect('group.denominator', 'denominator')
      .addSelect('group.stack_size', 'stackCoinsSize')
      .addSelect('group.stack_buy_limit', 'stackBuyLimit')
      .addSelect('group.idle_timeout', 'idleTimeout')
      .addSelect('group.grace_timeout', 'graceTimeout')
      .addSelect('group.is_private', 'isPrivate')
      .addSelect('group.regulation', 'regulation')
      .addSelect('group.prizeGroup', 'prizeGroup')
      .addSelect('group.configuration', 'configuration');
  }

  public async getAllGroups(filters: any): Promise<{ groups: GroupInterface[], total: number }> {
    let sortParam: Sort = { sort: 'group.create_date', order: 'DESC' };
    if (filters.sortBy) {
      sortParam = setSorting(this, ['machinesTotal', 'machinesIdle', 'operators'],
        filters.sortBy, filters.sortOrder);
    }
    const groupsQuery = this.buildQuery();
    this.buildWhereString(filters, groupsQuery);
    const groups = await groupsQuery
      .addOrderBy(sortParam.sort, sortParam.order)
      .addGroupBy('group.id')
      .limit(filters.take || 20)
      .offset(filters.offset || 0)
      .getRawMany();

    const countQuery = this.createQueryBuilder('group')
      .leftJoin('group.machines', 'machines')
      .leftJoin('group.operators', 'operator')
      .select('group.id', 'id')
      .addSelect('COUNT(machines.id)', 'machinesTotal')
      .addSelect('SUM(IF(machines.status = \'stopped\', 1, 0))', 'machinesIdle')
      .addSelect('COUNT(DISTINCT group.id)', 'count')
      .addGroupBy('group.id');

    this.buildWhereString(filters, countQuery);

    const countRaw = await countQuery.getRawMany();

    return {
      total: countRaw.length,
      groups: groups.map(group => ({
        ...group,
        regulation: JSON.parse(group.regulation),
        configuration: JSON.parse(group.configuration),
        id: parseInt(group.id, 10),
        denominator: parseFloat(group.denominator),
        machinesIdle: group.machinesIdle ? parseInt(group.machinesIdle, 10) : 0,
        machinesTotal: parseInt(group.machinesTotal, 10),
        totalPowerLineA: parseInt(group.totalPowerLineA, 10),
        totalPowerLineB: parseInt(group.totalPowerLineB, 10),
        isPrivate: !!group.isPrivate,
        operators: !!parseInt(group.operators, 10),
        hasJackpot: !!group.hasJackpot,
      })),
    };
  }

  public async getGroupById(id: number): Promise<GroupInterface> {
    const group = await this.buildQuery()
      .where('group.id = :id', { id })
      .groupBy('group.id')
      .getRawOne();
    group.regulation = JSON.parse(group.regulation);
    group.configuration = JSON.parse(group.configuration);
    group.id = parseInt(group.id, 10);
    group.denominator = parseFloat(group.denominator);
    group.machinesIdle = group.machinesIdle ? parseInt(group.machinesIdle, 10) : 0;
    group.machinesTotal = parseInt(group.machinesTotal, 10);
    group.totalPowerLineA = parseInt(group.totalPowerLineA, 10);
    group.totalPowerLineB = parseInt(group.totalPowerLineB, 10);
    group.isPrivate = !!group.isPrivate;
    group.operators = !!parseInt(group.operators, 10);
    group.hasJackpot = !!parseInt(group.hasJackpot, 10);

    return group;
  }

  public async getUniqueDenominators(): Promise<number[]> {
    const queryBuilder = this.createQueryBuilder('group')
      .select('group.denominator', 'denominator')
      .distinct(true);

    const rawDenominators = await queryBuilder.getRawMany();
    return rawDenominators.map(denominator => denominator.denominator);
  }

  public async getGroupHardStopData(groupId: number, machineIds?: number[]): Promise<MachineEntity[]> {
    const builder = this.createQueryBuilder('g')
      .leftJoinAndSelect('g.machines', 'm')
      .leftJoinAndSelect('m.queue', 'q')
      .leftJoinAndSelect('q.sessions', 's')
      .where('g.id = :groupId', { groupId });
    if (machineIds?.length) {
      builder.andWhere('m.id IN (:...machineIds)', { machineIds });
    }
    const group = await builder.getOne();
    if (!group) {
      throw new NotFoundException('Group not found');
    }
    return group.machines;
  }
}
