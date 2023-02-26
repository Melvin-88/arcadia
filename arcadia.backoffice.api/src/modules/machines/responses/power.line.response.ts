import { ApiProperty } from '@nestjs/swagger';
import { MachinePowerLine } from 'arcadia-dal';

export class PowerLineResponse {
  @ApiProperty({ enum: MachinePowerLine })
  public name: MachinePowerLine;
}

export class PowerLinesResponse {
  @ApiProperty()
  public total: number;

  @ApiProperty({ type: [PowerLineResponse] })
  public powerLines: PowerLineResponse[];
}
