import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsInt, IsNotEmpty, Length, Min,
} from 'class-validator';

export class VerifyAuthTokenDto {
  @ApiProperty()
  @IsNotEmpty()
  token: string;

  @ApiProperty()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  groupId: number;

  @ApiProperty()
  @Length(10, 50)
  footprint: string;
}
