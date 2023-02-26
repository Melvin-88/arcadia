import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserLogData } from '../interfaces';

@Entity('bo_module')
export class BoModulesEntity {
  public userLogData: UserLogData;

  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  public id: number;

  @Column({ type: 'varchar', length: 64, nullable: false })
  public name: string;

  @Column({ type: 'varchar', length: 128, nullable: true })
  public description: string;

  @Column({ type: 'varchar', length: 64, nullable: false })
  public tag: string;

  @CreateDateColumn({ type: 'datetime' })
  public createDate: Date;
}
