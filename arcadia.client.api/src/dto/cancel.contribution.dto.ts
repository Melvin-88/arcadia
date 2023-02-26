import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDefined, ValidateNested } from 'class-validator';
import { CancelDetailsDto } from './cancel.details.dto';

export class CancelContributionDto {
  @ApiProperty({ type: CancelDetailsDto })
  @ValidateNested({ each: true })
  @Type(() => CancelDetailsDto)
  @IsDefined()
  cancelDetails: CancelDetailsDto;
}