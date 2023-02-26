import {
  Connection,
  createConnection,
  EntitySubscriberInterface,
  EventSubscriber,
  getConnection,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from 'typeorm';
import { RuntimeException } from '@nestjs/core/errors/exceptions/runtime.exception';
import { ChangeRepository } from '../repositoriesAudit';
import { ActionEntity, ChangeEntity } from '../entitiesAudit';
import { AuditAction } from '../enums';
import { AUDIT } from '../constants';
import { MachineStatusHistoryEntity } from '../entities';

@EventSubscriber()
export class AuditSubscriber implements EntitySubscriberInterface {
  private getConfig() {
    /* eslint-disable-next-line */
    return require('../ormconfig');
  }

  private async getConnection(): Promise<Connection> {
    let connection: Connection;
    try {
      connection = getConnection(AUDIT);

      if (connection && connection.isConnected) {
        return connection;
      }
    } catch (e) {}

    const config = this.getConfig();
    return createConnection(config[0]);
  }

  private async getAction(entity: any): Promise<ActionEntity> {
    const connection: Connection = await this.getConnection();
    const action = new ActionEntity();
    action.id = entity.userLogData.contextId;
    action.userId = entity.userLogData.userId;
    action.userEmail = entity.userLogData.userEmail;
    action.userName = entity.userLogData.userName;
    action.ip = () => `INET6_ATON('${entity.userLogData.ip}')`;
    action.path = entity.userLogData.route;
    await connection
      .createQueryBuilder()
      .insert()
      .into(ActionEntity)
      .values([action])
      .orIgnore(true)
      .execute();
    return action;
  }

  async afterInsert(event: InsertEvent<any>): Promise<void> {
    const { entity } = event;

    if (!entity || event.metadata.targetName === MachineStatusHistoryEntity.name) return;

    const action = await this.getAction(entity);
    const change = new ChangeEntity();
    change.entityName = event.metadata.tableName;
    change.actionType = AuditAction.INSERT;
    change.newEntity = entity;
    change.action = action;

    await this.provideConnection(async (connection: Connection): Promise<void> => {
      const repository = await connection.getCustomRepository(ChangeRepository);
      await repository.save(change, { transaction: false, reload: false });
    });
  }

  async afterRemove(event: RemoveEvent<any>): Promise<void> {
    const { entity } = event;

    if (!entity) return;

    const action = await this.getAction(entity);
    const change = new ChangeEntity();
    change.entityName = event.metadata.tableName;
    change.actionType = AuditAction.DELETE;
    change.newEntity = entity;
    change.action = action;

    await this.provideConnection(async (connection: Connection): Promise<void> => {
      const repository = await connection.getCustomRepository(ChangeRepository);
      await repository.save(change, { transaction: false, reload: false });
    });
  }

  async beforeUpdate(event: UpdateEvent<any>): Promise<void> {
    const { entity, databaseEntity } = event;

    if (!entity || !databaseEntity) {
      throw new RuntimeException('Use only save method for update');
    }
  }

  async afterUpdate(event: UpdateEvent<any>): Promise<void> {
    const { entity, databaseEntity } = event;

    if (!entity) return;

    const action = await this.getAction(entity);
    const change = new ChangeEntity();
    change.entityName = event.metadata.tableName;
    change.actionType = entity.isDeleted ? AuditAction.DELETE : AuditAction.UPDATE;
    change.oldEntity = databaseEntity;
    change.newEntity = entity;
    change.action = action;

    await this.provideConnection(async (connection: Connection): Promise<void> => {
      const repository = await connection.getCustomRepository(ChangeRepository);
      await repository.save(change, { transaction: false, reload: false });
    });
  }

  private async provideConnection(callback: (connection: Connection) => Promise<void>): Promise<void> {
    const connection = await this.getConnection();
    await callback(connection);
  }
}
