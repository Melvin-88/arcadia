/* eslint-disable max-lines */
import * as moment from 'moment';
import { from } from 'rxjs';
import {
  groupBy, map, mergeMap, take, toArray,
} from 'rxjs/operators';
import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';
import { FindConditions } from 'typeorm/find-options/FindConditions';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { UpdateResult } from 'typeorm/query-builder/result/UpdateResult';
import { MachineEntity, MachineStatusHistoryEntity, OperatorEntity } from '../entities';
import {
  GroupStatus, MachineStatus, OperatorStatus, QueueStatus, SessionStatus,
} from '../enums';
import { MachineInterface, Sort } from '../interfaces';
import { LastMachinesStatusesInterface } from '../reports/interfaces';
import { Configuration, LobbyChangeBetGroupInterface } from '../types';
import { setSorting } from '../utils';

@EntityRepository(MachineEntity)
export class MachineRepository extends Repository<MachineEntity> {
  private buildWhereString(filters: any, queryBuilder: SelectQueryBuilder<MachineEntity>): void {
    if (filters.id || filters.machineId) {
      queryBuilder.andWhere('machine.id = :id', { id: filters.id || filters.machineId });
    }
    if (filters.status) {
      queryBuilder.andWhere('machine.status IN (:status)', { status: filters.status });
    }
    if (filters.name) {
      queryBuilder.andWhere('machine.name IN (:name)', { name: filters.name });
    }
    if (filters.groupName) {
      queryBuilder.andWhere('group.name IN (:groupName)', { groupName: filters.groupName });
    }
    if (filters.siteName) {
      queryBuilder.andWhere('site.name IN (:siteName)', { siteName: filters.siteName });
    }
    if (filters.viewers) {
      queryBuilder.andHaving('viewers = :viewers', { viewers: filters.viewers });
    }
    if (filters.inQueue) {
      queryBuilder.andHaving('inQueue = :inQueue', { inQueue: filters.inQueue });
    }
    if (filters.uptimeFrom) {
      queryBuilder.andHaving('uptime >= :uptimeFrom', { uptimeFrom: filters.uptimeFrom });
    }
    if (filters.uptimeTo) {
      queryBuilder.andHaving('uptime <= :uptimeTo', { uptimeTo: filters.uptimeTo });
    }
    if (filters.operatorId) {
      queryBuilder.andWhere('operators.id IN (:operatorId)', { operatorId: filters.operatorId });
    }
    if (filters.siteId) {
      queryBuilder.andWhere('site_id IN (:siteId)', { siteId: filters.siteId });
    }
    if (filters.denomination) {
      queryBuilder.andWhere('group.denominator IN (:denomination)', { denomination: filters.denomination });
    }

    queryBuilder.andWhere('machine.is_deleted = false');
    // TODO: Uptime filter
  }

  private buildQuery(): SelectQueryBuilder<MachineEntity> {
    return this.createQueryBuilder('machine')
      .leftJoin('machine.group', 'group')
      .leftJoin('group.operators', 'operators')
      .leftJoin('machine.site', 'site')
      .leftJoin('machine.queue', 'queue')
      .leftJoin('queue.sessions', 'queueSessions')
      .select('machine.id', 'id')
      .addSelect('queue.status', 'queueStatus')
      .addSelect('machine.status', 'status')
      .addSelect('machine.name', 'name')
      .addSelect('group.name', 'groupName')
      .addSelect('site.name', 'siteName')
      .addSelect('machine.status_update_date', 'statusUpdateDate')
      .addSelect('machine.serial', 'serial')
      .addSelect('machine.camera_id', 'cameraID')
      .addSelect('INET6_NTOA(machine.controller_ip)', 'controllerIP')
      .addSelect('machine.location', 'location')
      .addSelect('machine.configuration', 'configuration')
      .addSelect('machine.last_diagnostic_date', 'lastDiagnosticDate')
      .addSelect(`SUM(IF((queueSessions.status IN ('${SessionStatus.QUEUE}',
       '${SessionStatus.QUEUE_BET_BEHIND}', '${SessionStatus.PLAYING}', '${SessionStatus.AUTOPLAY}',
        '${SessionStatus.FORCED_AUTOPLAY}', '${SessionStatus.RE_BUY}')), 1, 0))`, 'inQueue')
      .addSelect(`SUM(IF((queueSessions.status IN ('${SessionStatus.VIEWER}', '${SessionStatus.VIEWER_BET_BEHIND}')), 1, 0))`, 'viewers')
      .addSelect('IF(machine.status <> \'offline\', TIMESTAMPDIFF(SECOND, machine.last_login_date, NOW()), NULL)', 'uptime')
      .addSelect('machine.power_line', 'powerLine')
      .where('')
      .groupBy('queue.id');
  }

  public async getAllMachines(filters: any): Promise<[MachineInterface[], number]> {
    const sortByStatusOrder = `CASE machine.status WHEN 'ready' THEN 1
         WHEN 'in-play' THEN 2
         WHEN 'onHold' THEN 3
         WHEN 'seeding' THEN 4
         WHEN 'preparing' THEN 5
         WHEN 'shutting-down' THEN 6
         WHEN 'stopped' THEN 7
         WHEN 'offline' THEN 8
         WHEN 'error' THEN 9
          END`;
    let sortParam: Sort = { sort: 'machine.create_date', order: 'DESC' };
    if (filters.sortBy) {
      if (filters.sortBy === 'status') {
        filters.sortBy = sortByStatusOrder;
      }
      sortParam = setSorting(this, ['groupName', 'siteName', 'inQueue', 'viewers', 'uptime', 'queueStatus', sortByStatusOrder], filters.sortBy, filters.sortOrder);
    }
    const machinesQuery = this.buildQuery();

    this.buildWhereString(filters, machinesQuery);

    const machines = await machinesQuery
      .addOrderBy(sortParam.sort, sortParam.order)
      .limit(filters.take || 20)
      .offset(filters.offset || 0)
      .groupBy('machine.id')
      .getRawMany();

    machines.forEach(m => {
      m.configuration = JSON.parse(m.configuration) as Configuration;
      m.viewers = parseInt(m.viewers, 10);
      m.inQueue = parseInt(m.inQueue, 10);
      m.uptime = parseInt(m.uptime, 10);
    });

    const countQuery = this.createQueryBuilder('machine')
      .select('COUNT(*)', 'count')
      .leftJoin('machine.group', 'group')
      .leftJoin('machine.site', 'site')
      .leftJoin('machine.queue', 'queue')
      .leftJoin('queue.sessions', 'queueSessions')
      .addSelect(`SUM(IF((queueSessions.status IN ('${SessionStatus.QUEUE}',
       '${SessionStatus.QUEUE_BET_BEHIND}', '${SessionStatus.PLAYING}', '${SessionStatus.AUTOPLAY}',
        '${SessionStatus.FORCED_AUTOPLAY}', '${SessionStatus.RE_BUY}')), 1, 0))`, 'inQueue')
      .addSelect(`SUM(IF((queueSessions.status IN ('${SessionStatus.VIEWER}', '${SessionStatus.VIEWER_BET_BEHIND}')), 1, 0))`, 'viewers')
      .addSelect('TIMESTAMPDIFF(SECOND, machine.started_date, NOW())', 'uptime')
      .groupBy('machine.id');

    this.buildWhereString(filters, countQuery);

    const countRaw = await countQuery.getRawMany();

    return [machines, countRaw.length];
  }

  public getMachineById(id: number): Promise<MachineInterface> {
    const machineQuery = this.buildQuery();
    machineQuery.where('machine.id = :id', { id });
    return machineQuery.getRawOne();
  }

  public async getMachineForNewSession(groupId: number): Promise<MachineEntity | undefined> {
    const result = await this.createQueryBuilder('m')
      .leftJoin('m.queue', 'q')
      .leftJoin('q.sessions', 's')
      .select('q.machine_id', 'machineId')
      .addSelect(`SUM(IF(s.status IN ('${SessionStatus.PLAYING}', '${SessionStatus.AUTOPLAY}',
      '${SessionStatus.QUEUE}', '${SessionStatus.FORCED_AUTOPLAY}', '${SessionStatus.QUEUE_BET_BEHIND}',
      '${SessionStatus.RE_BUY}'), 1, 0))`, 'sessionsCount')
      .where('m.group_id = :groupId', { groupId })
      .andWhere('m.status IN (:...machineStatuses)',
        { machineStatuses: [MachineStatus.SEEDING, MachineStatus.READY, MachineStatus.IN_PLAY] })
      .andWhere('q.status IN (:...queueStatuses)',
        { queueStatuses: [QueueStatus.READY, QueueStatus.IN_PLAY] })
      .groupBy('q.id')
      .orderBy('sessionsCount', 'ASC')
      .getRawOne();
    return result
      ? this.findOne(result.machineId, { relations: ['queue', 'site'] })
      : undefined;
  }

  public getByGroupAndIds(groupId: number, machineIds?: number[]): Promise<MachineEntity[]> {
    const builder = this.createQueryBuilder('m')
      .leftJoinAndSelect('m.queue', 'q')
      .leftJoinAndSelect('q.sessions', 's')
      .leftJoinAndSelect('s.rounds', 'r')
      .where('m.group_id = :groupId', { groupId });
    if (machineIds?.length) {
      builder.andWhere('m.id IN (:...ids)', { ids: machineIds });
    }
    return builder.getMany();
  }

  public getMachinesToPing(lastPing: Date): Promise<MachineEntity[]> {
    return this.createQueryBuilder('m')
      .where('(m.ping_date IS NULL OR m.ping_date <= :lastPing)', { lastPing })
      .andWhere('m.status NOT IN (:...statuses)',
        { statuses: [MachineStatus.OFFLINE] })
      .getMany();
  }

  public async getMachinesStatusBreakdown(groupIds?: string[]): Promise<any> {
    const query = await this.createQueryBuilder('m')
      .select('m.id', 'id')
      .addSelect('m.status', 'status')
      .addSelect('q.status', 'queueStatus')
      .addSelect('SUM(IF(s.status NOT IN (\'viewer\', \'viewerBetBehind\'), 1, 0))', 'countActive')
      .leftJoin('session', 's', 'm.id = s.machine_id')
      .leftJoin('queue', 'q', 'm.id = q.machine_id')
      .where('m.is_deleted = 0')
      .groupBy('m.id');

    if (groupIds) {
      query.andWhere('m.group_id IN (:groupIds)', { groupIds });
    }

    const result = await query.getRawMany();

    return result.reduce((acc, m) => {
      if (m.queueStatus === QueueStatus.DRYING) {
        acc.countDrying += 1;
        return acc;
      }

      switch (m.status) {
        case MachineStatus.ERROR:
          acc.countError += 1;
          break;
        case MachineStatus.OFFLINE:
          acc.countOffline += 1;
          break;
        case MachineStatus.SHUTTING_DOWN:
          acc.countShuttingDown += 1;
          break;
        case MachineStatus.PREPARING:
          acc.countPreparing += 1;
          break;
        case MachineStatus.SEEDING:
          acc.countSeeding += 1;
          break;
        case MachineStatus.READY:
          if (parseInt(m.countActive, 10) > 0) {
            acc.countInPlay += 1;
          } else {
            acc.countReady += 1;
          }
          break;
        default:
          break;
      }
      return acc;
    }, {
      countError: 0,
      countOffline: 0,
      countShuttingDown: 0,
      countDrying: 0,
      countInPlay: 0,
      countPreparing: 0,
      countSeeding: 0,
      countReady: 0,
    });
  }

  public async getMachinesAvailabilityData(groupIds?: string[]): Promise<any> {
    const query = await this.createQueryBuilder('m')
      .leftJoin('m.sessions', 's')
      .select('SUM(IF(s.status IN (\'playing\', \'autoplay\', \'forcedAutoplay\', \'reBuy\'), 1, 0))', 'inPlay')
      .where('m.is_deleted = 0')
      .andWhere('m.status IN (:...machineStatuses)',
        { machineStatuses: [MachineStatus.READY, MachineStatus.IN_PLAY] })
      .groupBy('m.id');

    if (groupIds) {
      query.andWhere('m.group_id IN (:groupIds)', { groupIds });
    }

    const readyInPlayCounts = await query.getRawMany();

    return readyInPlayCounts.reduce((acc, count) => {
      const isInPlay = parseInt(count.inPlay, 10);
      isInPlay ? acc.countInPlay += 1 : acc.countReady += 1;
      return acc;
    }, { countInPlay: 0, countReady: 0 });
  }

  public async getLobbyAndChangeBetGroupData(operatorId: number): Promise<LobbyChangeBetGroupInterface[]> {
    const data = await this.createQueryBuilder('m')
      .leftJoin('m.queue', 'q')
      .leftJoin('q.sessions', 's')
      .leftJoin('m.group', 'g')
      .leftJoin('g.operators', 'o')
      .select('g.id', 'groupId')
      .addSelect('m.configuration', 'machineConfig')
      .addSelect('g.configuration', 'groupConfig')
      .addSelect('g.denominator', 'denominator')
      .addSelect('g.name', 'groupName')
      .addSelect('g.blue_ribbon_game_id', 'jackpotGameId')
      .addSelect('g.color', 'color')
      .addSelect('g.prizeGroup', 'prizeGroup')
      .addSelect(`SUM(IF((s.status != '${SessionStatus.VIEWER}' AND s.status != '${SessionStatus.VIEWER_BET_BEHIND}'), 1, 0))`,
        'queueLength')
      .distinct(true)
      .where('o.id = :operatorId', { operatorId })
      .andWhere('g.status IN (:...groupStatuses)',
        { groupStatuses: [GroupStatus.IN_PLAY, GroupStatus.IDLE] })
      .andWhere('m.status IN (:...machineStatuses)',
        { machineStatuses: [MachineStatus.SEEDING, MachineStatus.READY, MachineStatus.IN_PLAY] })
      .andWhere('q.status IN (:...queueStatuses)',
        { queueStatuses: [QueueStatus.READY, QueueStatus.IN_PLAY] })
      .groupBy('m.id')
      .orderBy('queueLength', 'ASC')
      .getRawMany();
    return from(data)
      .pipe(
        groupBy(value => value.groupId),
        mergeMap(group => group.pipe(take(1))),
        map(value => {
          const {
            groupConfig, machineConfig, denominator, queueLength, ...rest
          } = value;
          return {
            ...rest,
            denominator: Number(denominator),
            queueLength: Number(queueLength),
            config: {
              ...(typeof machineConfig === 'string'
                ? JSON.parse(machineConfig) : machineConfig),
              ...(typeof groupConfig === 'string'
                ? JSON.parse(groupConfig) : groupConfig),
            },
          } as LobbyChangeBetGroupInterface;
        }),
        toArray())
      .toPromise();
  }

  public async update(
    condition: number | number[] | FindConditions<MachineEntity>,
    partialEntity: QueryDeepPartialEntity<MachineEntity>,
  ): Promise<UpdateResult> {
    if (partialEntity.status) {
      try {
        let machineIds;

        if (condition && !Array.isArray(condition) && typeof condition === 'object' && condition.serial) {
          const { serial } = condition;
          const machine = await this.findOneOrFail({ serial })
            .catch(e => {
              throw new Error(`Failed to get machine with serial: ${serial}`);
            });

          machineIds = [machine.id];
        } else if (Array.isArray(condition)) {
          machineIds = condition;
        } else {
          machineIds = [condition];
        }

        const existingRecords = await this.manager.connection
          .getRepository(MachineStatusHistoryEntity)
          .createQueryBuilder()
          .select()
          .where(`id IN (WITH ranked AS (SELECT h.*, ROW_NUMBER()
           OVER (PARTITION BY machine_id ORDER BY timestamp DESC) AS rn FROM machine_status_history AS h)
           SELECT id FROM ranked WHERE rn = 1 AND ranked.machine_id IN (:id))`, { id: machineIds })
          .getMany();

        machineIds = machineIds.filter(id => {
          const existingRecord = existingRecords.find(r => Number(r.machineId) === id);
          return !existingRecord || existingRecord.status !== partialEntity.status;
        });

        await this.createQueryBuilder()
          .insert()
          .into(MachineStatusHistoryEntity)
          .values(machineIds.map(machineId => ({ machineId, status: partialEntity.status })))
          .execute();
      } catch (e) {
        console.log('Failed to log machine status history');
      }
    }

    return super.update(condition, partialEntity);
  }

  public async getShortestQueueMachine(
    operatorId: number, denominator: number, ignoreMachines: number[], ignoreGroups?: number[],
  ): Promise<MachineEntity | undefined> {
    const queryBuilder = await this.createQueryBuilder()
      .from(OperatorEntity, 'o')
      .leftJoin('o.groups', 'g')
      .leftJoin('g.machines', 'm')
      .leftJoin('m.queue', 'q')
      .leftJoin('q.sessions', 's')
      .select('q.machine_id', 'machineId')
      .addSelect(`SUM(IF(s.status IN ('${SessionStatus.PLAYING}', '${SessionStatus.AUTOPLAY}',
      '${SessionStatus.QUEUE}', '${SessionStatus.FORCED_AUTOPLAY}', '${SessionStatus.QUEUE_BET_BEHIND}',
      '${SessionStatus.RE_BUY}'), 1, 0))`, 'queueLength')
      .where('o.id = :operatorId', { operatorId })
      .andWhere('o.status = :operatorStatus', { operatorStatus: OperatorStatus.ENABLED })
      .andWhere('g.status IN (:...groupStatuses)',
        { groupStatuses: [GroupStatus.IN_PLAY, GroupStatus.IDLE] })
      .andWhere('g.denominator = :denominator', { denominator })
      .andWhere('m.status IN (:...machineStatuses)',
        { machineStatuses: [MachineStatus.SEEDING, MachineStatus.READY, MachineStatus.IN_PLAY] })
      .andWhere('q.status IN (:...queueStatuses)',
        { queueStatuses: [QueueStatus.READY, QueueStatus.IN_PLAY] });
    if (ignoreGroups?.length) {
      queryBuilder.andWhere('g.id NOT IN (:...ignoreGroups)', { ignoreGroups });
    }
    if (ignoreMachines?.length) {
      queryBuilder.andWhere('m.id NOT IN (:...ignoreMachines)', { ignoreMachines });
    }
    const result = await queryBuilder.groupBy('q.id')
      .orderBy('queueLength', 'ASC')
      .getRawOne();
    if (!result) {
      return undefined;
    }
    return this.findOne(result.machineId, { relations: ['group', 'queue'] });
  }

  public async getExistingMachinesWithStatuses(filters: any): Promise<Record<number, LastMachinesStatusesInterface>> {
    const query = this.createQueryBuilder('machine')
      .select('machine.id', 'id')
      .addSelect('machine.status', 'status')
      .leftJoin('group', 'group', 'machine.group_id=group.id')
      .leftJoin('site', 'site', 'machine.site_id=site.id')
      .leftJoin('group.operators', 'operators')
      .addSelect('operators.id', 'operator')
      .addSelect('group.name', 'group')
      .addSelect('group.denominator', 'denomination')
      .addSelect('machine.site_id', 'site')
      .where('machine.create_date <= CAST(:endDate AS DATE)', { endDate: filters.endDate })
      .andWhere('operators.id IS NOT NULL');

    this.buildWhereString(filters, query);

    const data = await query.getRawMany();

    return data.reduce((accumulator, machine) => {
      accumulator[machine.id] = {
        status: machine.status,
        timestamp: moment(filters.startDate).startOf('day').toISOString(),
        info: {
          machine: machine.id,
          status: machine.status,
          operator: machine.operator,
          group: machine.group,
          denomination: machine.denomination,
          site: machine.site,
        },
      };

      return accumulator;
    }, {});
  }

  public getMachineToEngage(machineId: number): Promise<MachineEntity | undefined> {
    const qr = this.manager.connection.createQueryRunner('master');
    return this.createQueryBuilder('m', qr)
      .leftJoinAndSelect('m.queue', 'q')
      .leftJoinAndSelect('m.group', 'g')
      .where('m.id = :machineId', { machineId })
      .getOne();
  }
}
