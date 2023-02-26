import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';
import * as moment from 'moment';
import * as objectHash from 'object-hash';
import * as _ from 'lodash';
import { NotAcceptableException } from '@nestjs/common';
import { MachineStatusReportEntity } from '../entities';
import {
  CheckingReportAvailabilityInterface,
  MachineStatusReportInterface,
  MachineStatusReportsInterface,
} from '../reports/interfaces';
import { getDaysBetweenDates, getUniqArray, omitReportParams } from '../utils';
import { MachineStatusReportGroupingKeys } from '../enums';

@EntityRepository(MachineStatusReportEntity)
export class MachineStatusReportRepository extends Repository<MachineStatusReportEntity> {
  private buildMachineStatusReportQuery(filters: any): SelectQueryBuilder<MachineStatusReportEntity> {
    const totalSecondsInDateRange = moment(filters.endDate).endOf('day').diff(moment(filters.startDate).startOf('day'), 'seconds');

    return this.createQueryBuilder('machine_status_report')
      .select(filters.groupBy === MachineStatusReportGroupingKeys.DAY
      || filters.groupBy === MachineStatusReportGroupingKeys.MONTH
      || filters.groupBy === MachineStatusReportGroupingKeys.STATUS
      || filters.groupBy === MachineStatusReportGroupingKeys.GROUP
        ? 'machine_status_report.grouping_value'
        : 'CAST(machine_status_report.grouping_value AS DOUBLE)', 'grouping_value')
      .addSelect(`(${this.getTotalUniqueMachinesSubQuery(filters)})`, 'total_machines')
      .addSelect('SUM(machine_status_report.total_available_time)', 'total_available_time')
      .addSelect('SUM(machine_status_report.total_in_play_time)', 'total_in_play_time')
      .addSelect('SUM(machine_status_report.total_error_time)', 'total_error_time')
      .addSelect('SUM(machine_status_report.total_offline_time)', 'total_offline_time')
      .addSelect('SUM(machine_status_report.total_stopped_time)', 'total_stopped_time')
      .addSelect('SUM(machine_status_report.total_shutting_down_time)', 'total_shutting_down_time')
      .addSelect('SUM(machine_status_report.total_preparing_time)', 'total_preparing_time')
      .addSelect('SUM(machine_status_report.total_ready_time)', 'total_ready_time')
      .addSelect('SUM(machine_status_report.total_seeding_time)', 'total_seeding_time')
      .addSelect('SUM(machine_status_report.total_on_hold_time)', 'total_on_hold_time')
      .addSelect(`ROUND(((SUM(machine_status_report.total_on_hold_time) / (${totalSecondsInDateRange} * (${this.getTotalUniqueMachinesSubQuery(filters)}))) * 100), 2)`, 'percent_on_hold_time')
      .addSelect(`ROUND(((SUM(machine_status_report.total_available_time) / (${totalSecondsInDateRange} * (${this.getTotalUniqueMachinesSubQuery(filters)}))) * 100), 2)`, 'percent_available_time')
      .addSelect(`ROUND(((SUM(machine_status_report.total_in_play_time) / (${totalSecondsInDateRange} * (${this.getTotalUniqueMachinesSubQuery(filters)}))) * 100), 2)`, 'percent_in_play_time')
      .addSelect(`ROUND(((SUM(machine_status_report.total_error_time) / (${totalSecondsInDateRange} * (${this.getTotalUniqueMachinesSubQuery(filters)}))) * 100), 2)`, 'percent_error_time')
      .addSelect(`ROUND(((SUM(machine_status_report.total_offline_time) / (${totalSecondsInDateRange} * (${this.getTotalUniqueMachinesSubQuery(filters)}))) * 100), 2)`, 'percent_offline_time')
      .addSelect(`ROUND(((SUM(machine_status_report.total_stopped_time) / (${totalSecondsInDateRange} * (${this.getTotalUniqueMachinesSubQuery(filters)}))) * 100), 2)`, 'percent_stopped_time')
      .addSelect(`ROUND(((SUM(machine_status_report.total_shutting_down_time) / (${totalSecondsInDateRange} * (${this.getTotalUniqueMachinesSubQuery(filters)}))) * 100), 2)`, 'percent_shutting_down_time')
      .addSelect(`ROUND(((SUM(machine_status_report.total_preparing_time) / (${totalSecondsInDateRange} * (${this.getTotalUniqueMachinesSubQuery(filters)}))) * 100), 2)`, 'percent_preparing_time')
      .addSelect(`ROUND(((SUM(machine_status_report.total_ready_time) / (${totalSecondsInDateRange} * (${this.getTotalUniqueMachinesSubQuery(filters)}))) * 100), 2)`, 'percent_ready_time')
      .addSelect(`ROUND(((SUM(machine_status_report.total_seeding_time) / (${totalSecondsInDateRange} * (${this.getTotalUniqueMachinesSubQuery(filters)}))) * 100), 2)`, 'percent_seeding_time');
  }

  public async getMachineStatusReport(filters: any): Promise<MachineStatusReportsInterface> {
    const paramsHash = objectHash(omitReportParams(filters));

    const dataQuery = this.buildMachineStatusReportQuery(filters)
      .where('date BETWEEN CAST(:startDate AS DATE) AND CAST(:endDate AS DATE)',
        { startDate: filters.startDate, endDate: filters.endDate })
      .andWhere('machine_status_report.params_hash = :paramsHash', { paramsHash })
      .andWhere('machine_status_report.grouping_value IS NOT NULL')
      .groupBy('machine_status_report.grouping_value')
      .orderBy(filters.sortBy || MachineStatusReportGroupingKeys.DAY, filters.sortOrder || 'ASC')
      .limit(filters.take || 20)
      .offset(filters.offset || 0);

    const totalQuery = this.createQueryBuilder('machine_status_report')
      .select('COUNT(DISTINCT machine_status_report.grouping_value)', 'total')
      .where('date BETWEEN CAST(:startDate AS DATE) AND CAST(:endDate AS DATE)',
        { startDate: filters.startDate, endDate: filters.endDate })
      .andWhere('machine_status_report.params_hash = :paramsHash', { paramsHash })
      .andWhere('machine_status_report.grouping_value IS NOT NULL');

    const [data, { total }] = await Promise.all([
      dataQuery.getRawMany(),
      totalQuery.getRawOne(),
    ]);

    return {
      total: Number(total),
      data: data.map((item): MachineStatusReportInterface => ({
        grouping_value: item.grouping_value,
        total_machines: Number(item.total_machines),
        total_available_time: Number(item.total_available_time),
        percent_available_time: Number(item.percent_available_time),
        total_in_play_time: Number(item.total_in_play_time),
        percent_in_play_time: Number(item.percent_in_play_time),
        total_error_time: Number(item.total_error_time),
        percent_error_time: Number(item.percent_error_time),
        total_offline_time: Number(item.total_offline_time),
        percent_offline_time: Number(item.percent_offline_time),
        total_stopped_time: Number(item.total_stopped_time),
        percent_stopped_time: Number(item.percent_stopped_time),
        total_shutting_down_time: Number(item.total_shutting_down_time),
        percent_shutting_down_time: Number(item.percent_shutting_down_time),
        total_preparing_time: Number(item.total_preparing_time),
        percent_preparing_time: Number(item.percent_preparing_time),
        total_ready_time: Number(item.total_ready_time),
        percent_ready_time: Number(item.percent_ready_time),
        total_seeding_time: Number(item.total_seeding_time),
        percent_seeding_time: Number(item.percent_seeding_time),
        total_on_hold_time: Number(item.total_on_hold_time),
        percent_on_hold_time: Number(item.percent_on_hold_time),
      })),
    };
  }

  public async checkReportAvailability(params: any): Promise<CheckingReportAvailabilityInterface> {
    const data = await this.createQueryBuilder('machine_status_report')
      .select('machine_status_report.date', 'date')
      .addSelect('machine_status_report.is_completed', 'isCompleted')
      .addSelect('machine_status_report.grouping_key', 'groupingKey')
      .addSelect('machine_status_report.grouping_value', 'groupingValue')
      .where(`date BETWEEN CAST('${params.startDate}' AS DATE) AND CAST('${params.endDate}' AS DATE)`)
      .andWhere('machine_status_report.paramsHash = :paramsHash', { paramsHash: objectHash(omitReportParams(params)) })
      .getRawMany();

    const daysToCreate = _.difference(
      getDaysBetweenDates(params.startDate, params.endDate),
      data.map(item => moment(item.date).format('YYYY-MM-DD')),
    );

    const inProgressCount = data.filter(item => !item.groupingValue && !item.groupingKey).length;

    return {
      info: {
        available: getUniqArray(data.filter(item => item.isCompleted).map(item => item.date)).length,
        inProgress: inProgressCount,
        toCreate: daysToCreate.length,
      },
      daysToCreate,
    };
  }

  private getTotalUniqueMachinesSubQuery(filters: any): string {
    let subQuery: string;
    switch (filters.groupBy) {
      case MachineStatusReportGroupingKeys.DAY:
        subQuery = `SELECT COUNT(DISTINCT machine.id) from machine LEFT JOIN \`group\` ON \`group\`.\`id\`=\`machine\`.\`group_id\` WHERE machine.create_date <= '${filters.endDate}'`;
        break;
      case MachineStatusReportGroupingKeys.DENOMINATION:
        subQuery = `SELECT COUNT(DISTINCT machine.id) from machine LEFT JOIN \`group\` ON \`group\`.\`id\`=\`machine\`.\`group_id\` WHERE \`machine\`.\`create_date\` <= '${filters.endDate}' AND group.denominator=machine_status_report.grouping_value`;
        break;
      case MachineStatusReportGroupingKeys.GROUP:
        subQuery = `SELECT COUNT(DISTINCT machine.id) from machine LEFT JOIN \`group\` ON \`group\`.\`id\`=\`machine\`.\`group_id\` WHERE \`machine\`.\`create_date\` <= '${filters.endDate}' AND group.name=machine_status_report.grouping_value`;
        break;
      case MachineStatusReportGroupingKeys.MACHINE:
        subQuery = `SELECT COUNT(DISTINCT machine.id) from machine LEFT JOIN \`group\` ON \`group\`.\`id\`=\`machine\`.\`group_id\` WHERE machine.create_date <= '${filters.endDate}' AND machine.id=machine_status_report.grouping_value`;
        break;
      case MachineStatusReportGroupingKeys.MONTH:
        subQuery = `SELECT COUNT(DISTINCT machine.id) from machine LEFT JOIN \`group\` ON \`group\`.\`id\`=\`machine\`.\`group_id\` WHERE machine.create_date <= '${filters.endDate}'`;
        break;
      case MachineStatusReportGroupingKeys.OPERATOR:
        subQuery = 'SELECT COUNT(DISTINCT machine.id) from machine'
          + ' LEFT JOIN `group` ON `group`.`id`=`machine`.`group_id`'
          + ' LEFT JOIN `group_operators_operator` `group_operators` ON `group_operators`.`group_id`=`group`.`id` LEFT JOIN `operator` `operators` ON `operators`.`id`=`group_operators`.`operator_id`'
          + ` WHERE \`machine\`.\`create_date\` <= '${filters.endDate}'`
          + ' AND machine_status_report.grouping_value IN(operators.id)';
        break;
      case MachineStatusReportGroupingKeys.SITE:
        subQuery = 'SELECT COUNT(DISTINCT machine.id) from machine'
          + ` WHERE machine.create_date <= '${filters.endDate}'`
          + ' AND machine.site_id=machine_status_report.grouping_value';
        break;
      case MachineStatusReportGroupingKeys.STATUS:
        subQuery = `SELECT COUNT(DISTINCT machine.id) from machine LEFT JOIN \`group\` ON \`group\`.\`id\`=\`machine\`.\`group_id\` WHERE machine.create_date <= '${filters.endDate}' AND machine.status=machine_status_report.grouping_value`;
        break;
      default:
        throw new NotAcceptableException('Wrong grouping key passed');
    }

    if (filters.operatorId) {
      subQuery += ` AND operators.id IN(${filters.operatorId.join(',')})`;
    }
    if (filters.siteId) {
      subQuery += ` AND machine.site_id IN(${filters.siteId.join(',')})`;
    }
    if (filters.groupName) {
      subQuery += ` AND group.name IN(${filters.groupName.map(name => `'${name}'`).join(',')})`;
    }
    if (filters.machineId) {
      subQuery += ` AND machine.id = ${filters.machineId}`;
    }
    if (filters.denomination) {
      subQuery += ` AND group.denominator IN(${filters.denomination.join(',')})`;
    }
    if (filters.status) {
      subQuery += ` AND machine.status = '${filters.status}'`;
    }

    subQuery += ' AND machine.is_deleted = 0';

    return subQuery;
  }
}
