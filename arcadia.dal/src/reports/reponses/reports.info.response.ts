import { ApiProperty } from '@nestjs/swagger';
import { ReportInfoInterface } from '../interfaces/report.info.interface';

export class ReportsInfoResponse {
  @ApiProperty({ type: [ReportInfoInterface] })
  public data: ReportInfoInterface[];

  @ApiProperty()
  public total: number;
}
