import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class VideoStreamAuthDto {
  @ApiProperty()
  @IsNotEmpty()
  token: string;
}
