import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MachinePowerLine, MachineStatus, ShutdownReason } from '../enums';
import { UserLogData } from '../interfaces';
import { Configuration } from '../types';
import { ChipEntity } from './chip.entity';
import { GroupEntity } from './group.entity';
import { MachineDispenserEntity } from './machine.dispenser.entity';
import { QueueEntity } from './queue.entity';
import { SessionEntity } from './session.entity';
import { SiteEntity } from './site.entity';

@Entity('machine')
export class MachineEntity {
  public userLogData: UserLogData;

  @PrimaryColumn('int', {
    unsigned: true,
    generated: 'increment',
  })
  public id: number;

  @Column({ type: 'varchar', length: 32, nullable: true })
  public cameraID: string;

  @Column({
    type: 'varbinary', length: 16, nullable: true, unique: true,
  })
  public controllerIP: string | ((data: any) => string);

  @Column({ type: 'varchar', length: 200, unique: true })
  public name: string;

  @Column({ type: 'varchar', length: 32, unique: true })
  public serial: string;

  @Column({ type: 'varchar', length: 32, nullable: true })
  public location: string;

  @Index()
  @Column({ type: 'enum', enum: MachineStatus, default: MachineStatus.OFFLINE })
  public status: MachineStatus = MachineStatus.STOPPED;

  @Column({ type: 'enum', enum: ShutdownReason, nullable: true })
  public shutdownReason: ShutdownReason;

  @ManyToOne(() => GroupEntity, GroupEntity => GroupEntity.machines, {
    onDelete: 'SET NULL',
  })
  public group: GroupEntity;

  @ManyToOne(() => SiteEntity, SiteEntity => SiteEntity.machines, {
    onDelete: 'SET NULL',
  })
  public site: SiteEntity;

  @OneToMany(() => SessionEntity, session => session.machine)
  public sessions: SessionEntity[];

  @OneToMany(() => ChipEntity, ChipEntity => ChipEntity.machine)
  public chips: ChipEntity[];

  @OneToMany(() => MachineDispenserEntity, machineDispenser => machineDispenser.machine)
  public dispensers: MachineDispenserEntity[];

  @OneToOne(() => QueueEntity, queue => queue.machine)
  public queue: QueueEntity;

  @Column({ type: 'json' })
  public configuration: Configuration = {};

  @Column({ type: 'bigint', unsigned: true, nullable: true })
  public reassignTo: number;

  @Column({ type: 'boolean', default: false })
  public isDeleted: boolean;

  @CreateDateColumn({ type: 'datetime' })
  public createDate: Date;

  @UpdateDateColumn({ type: 'datetime' })
  public updateDate: Date;

  @Column({ type: 'datetime', nullable: true })
  public startedDate: Date;

  @Column({ type: 'datetime', nullable: true })
  public statusUpdateDate: Date;

  @Column({ type: 'datetime', nullable: true })
  public lastDiagnosticDate: Date;

  @Column({ type: 'datetime', nullable: true })
  public lastLoginDate: Date;

  @Column({ type: 'datetime', nullable: true })
  public pingDate: Date;

  @Column({
    type: 'enum', enum: MachinePowerLine, nullable: false, default: MachinePowerLine.LINE_A,
  })
  public powerLine: MachinePowerLine;
}
