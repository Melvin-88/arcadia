import { ApiProperty } from '@nestjs/swagger';

export class ReportAvailabilityInterface {
  @ApiProperty()
  public available: number;

  @ApiProperty()
  public inProgress: number;

  @ApiProperty()
  public toCreate: number;
}
