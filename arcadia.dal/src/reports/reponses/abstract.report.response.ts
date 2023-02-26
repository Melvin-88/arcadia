import { ApiProperty } from '@nestjs/swagger';
import { AbstractReportInterface, ReportAvailabilityInterface } from '../interfaces';

export abstract class AbstractReportResponse {
  abstract data: any;
  abstract groupingKey: any;

  @ApiProperty()
  public total: number;

  @ApiProperty({ type: ReportAvailabilityInterface })
  public info: ReportAvailabilityInterface;
}
