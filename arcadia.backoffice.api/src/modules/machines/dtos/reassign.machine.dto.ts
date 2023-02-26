import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class ReassignMachineDto {
  @ApiProperty()
  @IsInt()
  groupId: number;
}