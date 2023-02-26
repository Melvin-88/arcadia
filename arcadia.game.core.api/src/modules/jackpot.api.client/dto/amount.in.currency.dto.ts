import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsString } from 'class-validator';

export class AmountInCurrency {
  @ApiProperty()
  @IsNumberString()
  public amount: string;

  @ApiProperty()
  @IsString()
  public currency: string;

  @ApiProperty()
  @IsNumberString()
  public rate: string;
}
