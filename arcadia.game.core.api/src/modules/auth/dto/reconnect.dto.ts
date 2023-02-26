import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, Length } from 'class-validator';

export class ReconnectDto {
  @ApiProperty()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  sessionId: number;

  @ApiProperty()
  @Length(10, 50)
  footprint: string;
}
