import { ApiProperty } from '@nestjs/swagger';

export class MachineIdResponse {
  @ApiProperty()
  public machineId: number;
}
