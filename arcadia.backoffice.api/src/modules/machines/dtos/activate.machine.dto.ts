import { IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ActivateMachineDto {
  @IsBoolean()
  @ApiProperty()
  public resetTableState: boolean;

  @IsBoolean()
  @ApiProperty()
  public resetDispensers: boolean;
}
