import { Column, Entity, PrimaryColumn } from 'typeorm';
import { UserLogData } from '../interfaces';

@Entity('alert_type')
export class AlertTypeEntity {
  public userLogData: UserLogData;

  @PrimaryColumn({
    type: 'smallint', unsigned: true, generated: 'increment',
  })
  public id: number;

  @Column({ type: 'boolean', default: false })
  public isDeleted: boolean;

  @Column('varchar', { length: 128 })
  public name: string;

  @Column({ type: 'varchar', length: 128, nullable: true })
  public description: string;

  @Column({ type: 'varchar', length: 128 })
  public level: string;
}
