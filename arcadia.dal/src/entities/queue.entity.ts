import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { QueueStatus } from '../enums';
import { MachineEntity } from './machine.entity';
import { SessionEntity } from './session.entity';

@Entity('queue')
export class QueueEntity {
  @PrimaryColumn('int', {
    unsigned: true,
    generated: 'increment',
  })
  public id: number;

  @Column({ type: 'boolean', default: false })
  public isDeleted: boolean;

  @OneToOne(() => MachineEntity, machine => machine.queue, { onDelete: 'SET NULL' })
  @JoinColumn()
  public machine: MachineEntity;

  @Column({ type: 'enum', enum: QueueStatus, default: QueueStatus.STOPPED })
  public status: QueueStatus = QueueStatus.STOPPED;

  @Column({ type: 'datetime', nullable: true })
  public statusUpdateDate: Date;

  @OneToMany(() => SessionEntity, session => session.queue)
  public sessions: SessionEntity[];

  @CreateDateColumn({ type: 'datetime' })
  public createDate: Date;

  @UpdateDateColumn({ type: 'datetime' })
  public updateDate: Date;
}
