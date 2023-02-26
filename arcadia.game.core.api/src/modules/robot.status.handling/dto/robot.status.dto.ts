import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { RobotToCoreBaseMessage } from '../../messaging/robot.handling/dto';
import { Status } from './status';

export class RobotStatusDto extends RobotToCoreBaseMessage {
  @IsString()
  @IsNotEmpty()
  public type: string;

  @Type(() => Status)
  @ValidateNested()
  @IsNotEmpty()
  public status: Status;
}
