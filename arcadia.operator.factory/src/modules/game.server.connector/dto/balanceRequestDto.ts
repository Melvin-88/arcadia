import { ApiProperty } from '@nestjs/swagger';
import { Length } from 'class-validator';
import { CustomParamDto } from './customParamDto';

export class BalanceRequestDto extends CustomParamDto {
  @ApiProperty()
  @Length(1, 200)
  cid: string;

  @ApiProperty()
  @Length(1, 200)
  sessionToken: string;
}
