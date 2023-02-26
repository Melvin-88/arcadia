import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { numberTransform } from '../../util';

export class EventParams {
  @Transform(numberTransform)
  @IsInt()
  @IsOptional()
  public sessionId?: number;

  @IsString()
  @IsOptional()
  public machineSerial?: string;

  @Transform(numberTransform)
  @IsInt()
  @IsOptional()
  public machineId?: number;

  @Transform(numberTransform)
  @IsInt()
  @IsOptional()
  public operatorId?: number;

  @IsString()
  @IsOptional()
  public operatorApiConnectorId?: string;

  @IsString()
  @IsOptional()
  public playerCid?: string;

  @IsString()
  @IsOptional()
  public status?: string;

  @IsString()
  @IsOptional()
  public direction?: string;

  @IsObject()
  @IsOptional()
  public settings?: Record<string, any>;

  @IsString()
  @IsOptional()
  public dir?: string;

  @Transform(numberTransform)
  @IsNumber()
  @IsOptional()
  public angle?: number;

  @Transform(numberTransform)
  @IsInt()
  @IsOptional()
  public remainingCoins?: number;

  @Transform(numberTransform)
  @IsInt()
  @IsOptional()
  public coins?: number;

  @IsString()
  @IsOptional()
  public rfid?: string;

  @IsString()
  @IsOptional()
  public type?: string;

  @Transform(numberTransform)
  @IsNumber()
  @IsOptional()
  public value?: number;

  @IsNumber()
  @IsOptional()
  public groupId?: number;

  @IsString()
  @IsOptional()
  public videoUrl?: string;

  @Transform(numberTransform)
  @IsNumber()
  @IsOptional()
  public round?: number;

  @Transform(numberTransform)
  @IsNumber()
  @IsOptional()
  public sum?: number;

  @Transform(numberTransform)
  @IsNumber()
  @IsOptional()
  public transactionId?: number;

  @Transform(numberTransform)
  @IsNumber()
  @IsOptional()
  public position?: number;

  @Transform(numberTransform)
  @IsNumber()
  @IsOptional()
  public balance?: number;

  @Transform(numberTransform)
  @IsNumber()
  @IsOptional()
  public stacks?: number;

  @IsString()
  @IsOptional()
  public reason?: string;

  @IsString()
  @IsOptional()
  public purpose?: string;

  @IsString()
  @IsOptional()
  public response?: string;

  @IsString()
  @IsOptional()
  public orientation?: string;

  @IsString()
  @IsOptional()
  decision?: string;

  @Transform(numberTransform)
  @IsNumber()
  @IsOptional()
  public latency?: number;

  @IsString()
  @IsOptional()
  public route?: string;
}