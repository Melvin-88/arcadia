import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserStatus } from '../enums';
import { UserLogData } from '../interfaces';
import { BoModulesEntity } from './bo.modules.entity';

@Entity('user')
export class UserEntity {
  public userLogData: UserLogData;

  @PrimaryColumn('int', { unsigned: true, generated: 'increment' })
  public id: number;

  @Column({ type: 'varchar', length: 100 })
  public firstName: string;

  @Column({ type: 'varchar', length: 100 })
  public lastName: string;

  @Column({ type: 'varchar', length: 100 })
  public email: string;

  @Column({ type: 'varchar', length: 250 })
  public password: string;

  @Column({ type: 'varchar', length: 250 })
  public phone: string;

  @Column({ type: 'varchar', length: 250, nullable: true })
  public phone2: string;

  @Column({ type: 'varchar', length: 250, nullable: true })
  public recoverPasswordToken: string = null;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ENABLED })
  public status: UserStatus;

  @Column({ type: 'boolean', default: false })
  public isDeleted: boolean;

  @Column({ type: 'boolean', default: false })
  public isAdmin: boolean;

  @Column({ type: 'datetime', nullable: true })
  public lastAccessDate: Date;

  @Column({ type: 'varbinary', length: 16, nullable: true })
  public lastAccessIP: string | ((data: any) => string);

  @ManyToMany(() => BoModulesEntity)
  @JoinTable()
  public permittedModules: BoModulesEntity[];

  @CreateDateColumn({ type: 'datetime' })
  public createDate: Date;

  @UpdateDateColumn({ type: 'datetime' })
  public updateDate: Date | ((data: any) => string);
}
