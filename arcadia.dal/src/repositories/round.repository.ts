import * as moment from 'moment';
import { EntityRepository, Repository, UpdateResult } from 'typeorm';
import {
  PerformanceDimensionEntity,
  PerformanceIndicatorEntity,
  RoundArchiveEntity,
  RoundEntity,
} from '../entities';
import { PerformanceIndicatorDimension, PerformanceIndicatorSegment } from '../enums';
import { RoundArchiveRepository } from './round.archive.repository';

@EntityRepository(RoundEntity)
export class RoundRepository extends Repository<RoundEntity> {
  public countWin(roundId: number, winInValue: number, winInCash: number): Promise<UpdateResult> {
    return this.createQueryBuilder()
      .update()
      .set({
        wins: () => `${this.metadata
          .findColumnWithPropertyName('wins').databaseName} + ${winInValue}`,
        winInCash: () => `${this.metadata
          .findColumnWithPropertyName('winInCash').databaseName} + ${winInCash}`,
      })
      .where({ id: roundId })
      .execute();
  }

  public async getRoundsBySegmentAndDimension(
    indicator: PerformanceIndicatorEntity,
    dimension: PerformanceDimensionEntity,
  ): Promise<RoundEntity[]> {
    const roundQuery = this.createQueryBuilder('round');
    if (dimension.dimensionType === PerformanceIndicatorDimension.MINUTE) {
      roundQuery.where('round.create_date > :date', { date: moment().subtract(dimension.value, 'minute').toDate() });
    } else {
      roundQuery.orderBy('round.create_date', 'DESC').limit(dimension.value);
    }

    switch (indicator.segment) {
      case PerformanceIndicatorSegment.GROUP:
        if (indicator.subSegment.group) {
          roundQuery.andWhere('group.id = :id', { id: indicator.subSegment.group });
        }
        break;
      case PerformanceIndicatorSegment.MACHINE:
        if (indicator.subSegment.machine) {
          roundQuery.andWhere('machine.id = :id', { id: indicator.subSegment.machine });
        }
        break;
      case PerformanceIndicatorSegment.OPERATOR:
        if (indicator.subSegment.operator) {
          roundQuery.andWhere('operator.id = :id', { id: indicator.subSegment.operator });
        }
        break;
      default:
        break;
    }

    return roundQuery
      .select()
      .leftJoinAndSelect('round.session', 'session')
      .leftJoin('session.group', 'group')
      .leftJoinAndSelect('session.machine', 'machine')
      .leftJoin('session.operator', 'operator')
      .getMany();
  }

  public async getRoundsBySegment(indicator: PerformanceIndicatorEntity, lastRounds: number, fromArchive = false): Promise<RoundEntity[] | RoundArchiveEntity[]> {
    const roundQuery = fromArchive ? this.manager.getCustomRepository(RoundArchiveRepository)
      .createQueryBuilder('round') : this.createQueryBuilder('round');

    switch (indicator.segment) {
      case PerformanceIndicatorSegment.GROUP:
        if (indicator.subSegment.group) {
          roundQuery.where(`session.${fromArchive ? 'group_id' : 'group.id'} = :id`, { id: indicator.subSegment.group });
        }
        break;
      case PerformanceIndicatorSegment.MACHINE:
        if (indicator.subSegment.machine) {
          roundQuery.andWhere(`session.${fromArchive ? 'machine_id' : 'machine.id'} = :id`, { id: indicator.subSegment.machine });
        }
        break;
      case PerformanceIndicatorSegment.OPERATOR:
        if (indicator.subSegment.operator) {
          roundQuery.andWhere(`${fromArchive ? 'session.operator_id' : 'operator.id'} = :id`, { id: indicator.subSegment.operator });
        }
        break;
      default:
        break;
    }

    return fromArchive ? roundQuery.select()
      .leftJoin('session_archive', 'session', 'round.session_id=session.id')
      .addOrderBy('round.start_date', 'DESC')
      .limit(lastRounds)
      .getMany()
      : roundQuery.select().leftJoinAndSelect('round.session', 'session')
        .leftJoinAndSelect('session.queue', 'queue')
        .leftJoin('session.group', 'group')
        .leftJoinAndSelect('session.machine', 'machine')
        .leftJoin('group.operators', 'operator')
        .addOrderBy('round.create_date', 'DESC')
        .limit(lastRounds)
        .getMany();
  }
}
