import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { MachineStatusHistoryEntity } from '../entities';
import { LastMachinesStatusesInterface, MachineStatusHistoryReportStreamInterface } from '../reports/interfaces';

@EntityRepository(MachineStatusHistoryEntity)
export class MachineStatusHistoryRepository extends Repository<MachineStatusHistoryEntity> {
  private buildWhereString(filters: any, queryBuilder: SelectQueryBuilder<MachineStatusHistoryEntity>): void {
    if (filters.operatorId) {
      queryBuilder.andWhere('operators.id IN (:operatorId)', { operatorId: filters.operatorId });
    }
    if (filters.siteId) {
      queryBuilder.andWhere('machine.site_id IN (:siteId)', { siteId: filters.siteId });
    }
    if (filters.groupName) {
      queryBuilder.andWhere('group.name IN (:groupName)', { groupName: filters.groupName });
    }
    if (filters.machineId) {
      queryBuilder.andWhere('machine_status_history.machine_id = :machineId', { machineId: filters.machineId });
    }
    if (filters.denomination) {
      queryBuilder.andWhere('group.denominator IN (:denomination)', { denomination: filters.denomination });
    }
    if (filters.playerId) {
      queryBuilder.andWhere('machine_status_history.player_cid = :playerId', { playerId: filters.playerId });
    }
    if (filters.sessionId) {
      queryBuilder.andWhere('machine_status_history.id = :sessionId', { sessionId: filters.sessionId });
    }
    if (filters.status) {
      queryBuilder.andWhere('machine.status = :status', { status: filters.status });
    }
  }

  public async getMachineStatusHistoryReportStream(data: any): Promise<Observable<{day: string, dailyData: MachineStatusHistoryReportStreamInterface[]}>> {
    const dataBuffer = {};

    for (const day of data.daysToCreate) {
      const query = this.createQueryBuilder('machine_status_history')
        .select('machine_status_history.id', 'id')
        .addSelect('machine_status_history.machine_id', 'machine')
        .addSelect('machine_status_history.status', 'status')
        .addSelect('machine_status_history.timestamp', 'timestamp')
        .leftJoin('machine', 'machine', 'machine_status_history.machine_id=machine.id')
        .leftJoin('group', 'group', 'machine.group_id=group.id')
        .leftJoin('group.operators', 'operators')
        .addSelect('operators.id', 'operator')
        .addSelect('group.name', 'group')
        .addSelect('group.denominator', 'denomination')
        .addSelect('machine.site_id', 'site')
        .where(`CAST(machine_status_history.timestamp AS DATE) = CAST('${day}' AS DATE)`)
        .andWhere('operators.id IS NOT NULL')
        .andWhere('machine.is_deleted = 0')
        .orderBy('machine_status_history.timestamp', 'ASC');

      this.buildWhereString(data.params, query);

      // eslint-disable-next-line no-await-in-loop
      dataBuffer[day] = await query.getRawMany();
    }

    return new Observable(subscriber => {
      Object.keys(dataBuffer).forEach(key => subscriber.next({
        day: key,
        dailyData: dataBuffer[key].map(item => {
          item.day = moment(item.timestamp).format('YYYY-MM-DD');
          item.month = moment(item.timestamp).format('MM/YYYY');
          return item;
        }),
      }));

      subscriber.complete();
    });
  }

  public async getLastMachinesStatuses(startDate: string): Promise<Record<number, LastMachinesStatusesInterface>> {
    const rawStatusData = await this.query(
      `SELECT t1.machine_id, t1.status, t1.timestamp
             FROM machine_status_history t1
             INNER JOIN (SELECT h.machine_id, MAX(h.timestamp) timestamp
             FROM machine_status_history h
             WHERE h.timestamp < '${startDate}'
             AND h.timestamp > DATE_SUB(CAST('${startDate}' AS DATETIME), INTERVAL 1 MONTH)
             GROUP BY h.machine_id) t2 ON t1.machine_id = t2.machine_id
             WHERE (t1.machine_id = t2.machine_id AND t1.timestamp = t2.timestamp)`);

    return rawStatusData.reduce((accumulator: Record<number, LastMachinesStatusesInterface>, record) => {
      accumulator[record.machine_id] = {
        status: record.status,
        timestamp: record.timestamp,
      };

      return accumulator;
    },
    {},
    );
  }
}
