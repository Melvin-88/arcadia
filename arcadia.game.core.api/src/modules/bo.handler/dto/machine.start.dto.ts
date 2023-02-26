import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class MachineStartDto {
  @ApiProperty()
  @IsBoolean()
  resetTableState: boolean;

  @ApiProperty()
  @IsBoolean()
  resetDispensers: boolean;
}