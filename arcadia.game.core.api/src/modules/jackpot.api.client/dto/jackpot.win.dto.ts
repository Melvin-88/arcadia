import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { WinnerDetails } from './winner.details.dto';

export class JackpotWinDto {
  @ApiProperty({ type: WinnerDetails })
  @Type(() => WinnerDetails)
  @ValidateNested({ each: true })
  @IsNotEmpty()
  public winnerDetails: WinnerDetails;
}
