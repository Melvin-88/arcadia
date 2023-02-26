import { IsObject, IsOptional, Length } from 'class-validator';
import { RobotToCoreBaseMessage } from './robotToCoreBaseMessage.dto';

export class RobotErrorMessage extends RobotToCoreBaseMessage {
  @Length(1, 256)
  module: string;

  @Length(1, 256)
  error: string;

  @IsOptional()
  @IsObject()
  details?: Record<string, any>;
}