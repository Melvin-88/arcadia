import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsOptional } from 'class-validator';

export class GroupStopDto {
  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  machineIds: number[];
}