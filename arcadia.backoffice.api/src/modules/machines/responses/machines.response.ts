import { ApiProperty } from '@nestjs/swagger';
import { Configuration, MachinePowerLine } from 'arcadia-dal';

export class MachineResponse {
  @ApiProperty()
  public id: number;

  @ApiProperty()
  public status: string;

  @ApiProperty()
  public queueStatus: string;

  @ApiProperty()
  public name: string;

  @ApiProperty()
  public groupName: string;

  @ApiProperty()
  public viewers: number;

  @ApiProperty()
  public inQueue: number; // TODO: ???

  @ApiProperty()
  public uptime: number;

  @ApiProperty()
  public serial: string;

  @ApiProperty()
  public cameraID: string;

  @ApiProperty()
  public controllerIP: string;

  @ApiProperty()
  public siteName: string;

  @ApiProperty()
  public location: string;

  @ApiProperty()
  public lastDiagnosticDate: Date;

  @ApiProperty({ type: Configuration })
  public configuration: Configuration;

  // TODO: Chips on table, probably from robot via API
  @ApiProperty()
  public chipsOnTable: Record<string, any>;

  @ApiProperty({ enum: MachinePowerLine })
  public powerLine: MachinePowerLine;
}

export class MachinesResponse {
  @ApiProperty()
  public total: number;

  @ApiProperty({ type: [MachineResponse] })
  public machines: MachineResponse[];
}
