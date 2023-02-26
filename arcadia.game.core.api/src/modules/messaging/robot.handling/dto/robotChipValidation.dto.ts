import { IsNotEmpty, IsString } from 'class-validator';
import { RobotToCoreBaseMessage } from './robotToCoreBaseMessage.dto';

export class RobotChipValidationDto extends RobotToCoreBaseMessage {
  @IsString()
  @IsNotEmpty()
  public rfid: string;
}
