import {
  Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn,
} from 'typeorm';
import { ChangeEntity } from './change.entity';

@Entity('action')
export class ActionEntity {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  public id: string;

  @Column({ type: 'int', unsigned: true })
  public userId: number;

  @Column({ type: 'varchar', length: 256 })
  public userName: string;

  @Column({ type: 'varchar', length: 256 })
  public userEmail: string;

  @Column({ type: 'varchar', length: 256 })
  public path: string;

  @OneToMany(() => ChangeEntity, change => change.action)
  public changes: ChangeEntity[];

  @Column({ type: 'varbinary', length: 16 })
  public ip: string | ((data: any) => string);

  @CreateDateColumn({ type: 'datetime', name: 'created_at_date' })
  public createDate: Date;
}
