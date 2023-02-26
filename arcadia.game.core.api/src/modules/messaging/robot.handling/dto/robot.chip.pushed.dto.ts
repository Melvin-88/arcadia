import { Transform } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
import { RobotChipValidationDto } from './robotChipValidation.dto';

export class RobotChipPushedDto extends RobotChipValidationDto {
  @IsOptional()
  @Transform(({ value }) => {
    const result = parseInt(value, 10);
    if (Number.isNaN(result)) {
      return undefined;
    }
    return result;
  })
  @IsInt()
  public pending?: number;
}
