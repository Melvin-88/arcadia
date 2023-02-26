import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserLogData } from '../interfaces';
import { ChipEntity } from './chip.entity';
import { MachineEntity } from './machine.entity';

@Entity('site')
export class SiteEntity {
  public userLogData: UserLogData;

  @PrimaryColumn('int', { unsigned: true, generated: 'increment' })
  public id: number;

  @Column({ type: 'varchar', length: 200, unique: true })
  public name: string;

  @Column({ type: 'varchar', length: 64 })
  public cameraApiUser: string;

  @Column({ type: 'varchar', length: 200 })
  public cameraApiBaseUrl: string;

  @Column({ type: 'varchar', length: 64 })
  public cameraApiPasswordConfigKey: string;

  @Column({ type: 'boolean', default: false })
  public isDeleted: boolean;

  @OneToMany(() => MachineEntity, MachineEntity => MachineEntity.site)
  public machines: MachineEntity[];

  @OneToMany(() => ChipEntity, ChipEntity => ChipEntity.site)
  public chips: ChipEntity[];

  @CreateDateColumn({ type: 'datetime' })
  public createDate: Date;

  @UpdateDateColumn({ type: 'datetime' })
  public updateDate: Date;
}
