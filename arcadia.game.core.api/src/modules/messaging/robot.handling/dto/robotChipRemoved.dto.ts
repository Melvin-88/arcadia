import { IsNotEmpty, IsOptional } from 'class-validator';
import { RobotChipValidationDto } from './robotChipValidation.dto';

export class RobotChipRemovedDto extends RobotChipValidationDto {
  @IsOptional()
  @IsNotEmpty()
  public reason: string;
}
