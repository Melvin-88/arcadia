import { ApiProperty } from '@nestjs/swagger';
import { Length } from 'class-validator';
import { CustomParamDto } from './customParamDto';

export class AuthRequestDto extends CustomParamDto {
  @ApiProperty()
  @Length(1, 200)
  authToken: string;
}
