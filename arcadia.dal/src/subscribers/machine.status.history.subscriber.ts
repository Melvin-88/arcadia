import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { MachineEntity, MachineStatusHistoryEntity } from '../entities';

@EventSubscriber()
export class MachineStatusHistorySubscriber implements EntitySubscriberInterface<MachineEntity> {
  listenTo(): typeof MachineEntity {
    return MachineEntity;
  }

  async afterInsert(event: InsertEvent<MachineEntity>): Promise<void> {
    if (!event.entity) return;

    await this.makeHistoricalRecord(event);
  }

  async afterUpdate(event: UpdateEvent<MachineEntity>): Promise<void> {
    if (!event.entity) return;

    await this.makeHistoricalRecord(event);
  }

  private async makeHistoricalRecord(event: InsertEvent<MachineEntity> | UpdateEvent<MachineEntity>): Promise<void> {
    const existingRecord = await event.connection.getRepository(MachineStatusHistoryEntity).createQueryBuilder().select()
      .where('machine_id = :id', { id: event.entity.id })
      .orderBy('timestamp', 'DESC')
      .getOne();
    if (!existingRecord || existingRecord.status !== event.entity.status) {
      await event.connection.createQueryBuilder()
        .insert()
        .into(MachineStatusHistoryEntity)
        .values([{ machineId: event.entity.id, status: event.entity.status }])
        .execute();
    }
  }
}
