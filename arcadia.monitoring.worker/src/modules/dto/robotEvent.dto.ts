import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { RobotEventType } from '../coreClient/enum';

export class RobotEventDto {
  @IsNumber()
  @IsOptional()
  public sessionId?: number;

  @IsString()
  @IsNotEmpty()
  public machineSerial: string;

  @IsString()
  @IsNotEmpty()
  public eventType: RobotEventType;

  @IsObject()
  @IsNotEmpty()
  public data: Record<string, any>;
}
