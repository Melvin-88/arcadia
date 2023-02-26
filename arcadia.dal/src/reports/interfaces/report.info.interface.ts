import { ApiProperty } from '@nestjs/swagger';
import { ReportStatus, ReportTypes } from '../../enums';

export class ReportInfoInterface {
  @ApiProperty({ enum: ReportTypes })
  reportType: ReportTypes;

  @ApiProperty()
  params: any;

  @ApiProperty()
  requestedDateTime: Date;

  @ApiProperty()
  status: ReportStatus;
}
