import { ApiProperty } from '@nestjs/swagger';
import { IsJWT } from 'class-validator';

export class JwtTokenDto {
  @ApiProperty()
  @IsJWT()
  token: string;
}