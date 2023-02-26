import { Column, Entity, PrimaryColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { UserLogData } from '../interfaces';

@Entity('logo')
export class LogoEntity {
  public userLogData: UserLogData;

  @PrimaryColumn('int', { unsigned: true, generated: 'increment' })
  public id: number;

  @Column({ type: 'boolean', default: false })
  @IsNotEmpty()
  public isDeleted: boolean;

  @Column({ type: 'mediumblob' })
  public logoBinary: Buffer;
}
