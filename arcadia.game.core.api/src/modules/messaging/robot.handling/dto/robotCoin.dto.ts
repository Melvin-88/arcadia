import { IsInt } from 'class-validator';
import { RobotToCoreBaseMessage } from './robotToCoreBaseMessage.dto';

export class RobotCoinDto extends RobotToCoreBaseMessage {
  @IsInt()
  public remaining: number;
}
