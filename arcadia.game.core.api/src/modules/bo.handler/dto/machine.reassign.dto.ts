import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt } from 'class-validator';

export class MachineReassignDto {
  @ApiProperty()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  groupId: number;
}