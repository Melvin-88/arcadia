import { IsNotEmpty, IsString } from 'class-validator';
import { RobotToCoreBaseMessage } from './robotToCoreBaseMessage.dto';

export class RobotChipDropDto extends RobotToCoreBaseMessage {
  @IsString()
  @IsNotEmpty()
  public rfid: string;
}
