import { EntityRepository, Repository } from 'typeorm';
import { QueueEntity } from '../entities';
import {
  GroupStatus, MachineStatus, OperatorStatus, QueueStatus, SessionStatus,
} from '../enums';

@EntityRepository(QueueEntity)
export class QueueRepository extends Repository<QueueEntity> {
  public async getFreeQueue(): Promise<QueueEntity> {
    let queue = await this.createQueryBuilder('queue')
      .where('queue.status = :status', { status: QueueStatus.STOPPED })
      .andWhere('queue.machine_id IS NULL')
      .andWhere('queue.is_deleted = false')
      .getOne();
    if (!queue) {
      queue = this.create({ status: QueueStatus.STOPPED });
      queue = await this.save(queue, { transaction: false });
    }
    return queue;
  }

  public async getQueueLengthsKpi(queueIds: number[]): Promise<{ length: number, id: number }[]> {
    if (queueIds.length === 0) {
      return [];
    }
    const lengths = await this.createQueryBuilder('queue')
      .leftJoin('session', 's', 's.queue_id = queue.id')
      .select('COUNT(s.id)', 'length')
      .addSelect('queue.id', 'id')
      .where('queue.id IN (:...queueIds)', { queueIds })
      .getRawMany();

    return lengths.map(l => ({
      length: parseInt(l.length, 10),
      id: parseInt(l.id, 10),
    }));
  }

  public async getQueueLengthData(): Promise<{ operatorIds: string[]; queueId: number; queueLength: number; denominator: string }[]> {
    const result = await this.createQueryBuilder('q')
      .leftJoin('q.sessions', 's')
      .leftJoin('q.machine', 'm')
      .leftJoin('m.group', 'g')
      .leftJoin('g.operators', 'o')
      .select('q.id', 'queueId')
      .addSelect('GROUP_CONCAT(o.id)', 'operatorIds')
      .addSelect(`SUM(IF(s.status IN ('${SessionStatus.PLAYING}', '${SessionStatus.AUTOPLAY}',
      '${SessionStatus.QUEUE}', '${SessionStatus.FORCED_AUTOPLAY}', '${SessionStatus.QUEUE_BET_BEHIND}',
      '${SessionStatus.RE_BUY}'), 1, 0))`, 'queueLength')
      .addSelect('g.denominator', 'denominator')
      .where('q.status IN (:...queueStatus)',
        { queueStatus: [QueueStatus.READY, QueueStatus.IN_PLAY] })
      .andWhere('m.status IN (:...machineStatuses)',
        { machineStatuses: [MachineStatus.SEEDING, MachineStatus.READY, MachineStatus.IN_PLAY] })
      .andWhere('o.status = :operatorStatus',
        { operatorStatus: OperatorStatus.ENABLED })
      .andWhere('g.status IN (:...groupStatus)',
        { groupStatus: [GroupStatus.IN_PLAY, GroupStatus.IDLE] })
      .groupBy('q.id')
      .getRawMany();
    return result.map(value => ({
      queueId: Number(value.queueId),
      operatorIds: (value.operatorIds as string).split(','),
      queueLength: Number(value.queueLength),
      denominator: value.denominator,
    }));
  }
}
