import { IsNumber } from 'class-validator';
import { RobotToCoreBaseMessage } from './robotToCoreBaseMessage.dto';

export class RobotPositionDto extends RobotToCoreBaseMessage {
  @IsNumber()
  public angle: number;
}
