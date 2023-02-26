import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index, CreateDateColumn,
} from 'typeorm';
import { ActionEntity } from './action.entity';
import { AuditAction } from '../enums';

@Entity('change')
export class ChangeEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @ManyToOne(() => ActionEntity, ActionEntity => ActionEntity.id)
  public action: ActionEntity;

  @Column({ type: 'varchar', length: 200, nullable: false })
  @Index()
  public entityName: string;

  @Column({ type: 'json', nullable: true })
  public oldEntity: Record<string, any>;

  @Column({ type: 'json', nullable: true })
  public newEntity: Record<string, any>;

  @Column({ type: 'enum', enum: AuditAction })
  public actionType: AuditAction;

  @CreateDateColumn({ type: 'datetime', name: 'created_at_date' })
  public createDate: Date;
}
