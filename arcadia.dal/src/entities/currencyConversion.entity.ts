import { IsNotEmpty } from 'class-validator';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { UserLogData } from '../interfaces';
import { NumberTransformer } from '../utils';

@Entity('currency_conversion')
export class CurrencyConversionEntity {
  public userLogData: UserLogData;

  @PrimaryColumn('int', { unsigned: true, generated: 'increment' })
  public id: number;

  @Column({ type: 'varchar', length: 3 })
  public currency: string;

  @Column({ type: 'boolean', default: false })
  @IsNotEmpty()
  public isDeleted: boolean;

  @Column({ type: 'datetime' })
  public effectiveFrom: Date;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    unsigned: true,
    default: '0.00',
    transformer: new NumberTransformer(),
  })
  public rate: number;
}