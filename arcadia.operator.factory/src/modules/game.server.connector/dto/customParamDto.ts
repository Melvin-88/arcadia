import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsOptional } from 'class-validator';

export class CustomParamDto {
  @ApiProperty()
  @IsOptional()
  @IsObject()
  params?: Record<string, any>;
}
