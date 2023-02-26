import { IsIn, IsOptional, IsString } from 'class-validator';
import { SessionAwareDto } from '../../../dto/session.aware.dto';

export class QueueBalanceDto extends SessionAwareDto {
  machineId?: number;
  machineName?: string;
  queuePosition?: number;
  @IsOptional()
  @IsString()
  @IsIn(['accept', 'reject'])
  decision?: 'accept' | 'reject';
}