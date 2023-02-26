import { IsOptional, Length } from 'class-validator';
import { RobotToCoreBaseMessage } from './robotToCoreBaseMessage.dto';

export class RobotCommandErrorDto extends RobotToCoreBaseMessage {
  @IsOptional()
  @Length(1, 200)
  public command?: string;

  @Length(1, 200)
  public reason: string;
}
