import { ApiProperty } from '@nestjs/swagger';

export class MachineNameResponse {
  @ApiProperty()
  public id: number;

  @ApiProperty()
  public name: string;
}

export class MachineNamesResponse {
  @ApiProperty()
  public total: number;

  @ApiProperty({ type: [MachineNameResponse] })
  public machines: MachineNameResponse[];
}
