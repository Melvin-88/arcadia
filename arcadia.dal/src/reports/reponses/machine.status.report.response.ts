import { ApiProperty } from '@nestjs/swagger';
import { MachineStatusReportInterface } from '../interfaces';
import { MachineStatusReportGroupingKeys } from '../../enums';
import { AbstractReportResponse } from './abstract.report.response';

export class MachineStatusReportResponse extends AbstractReportResponse {
  @ApiProperty({ type: [MachineStatusReportInterface] })
  public data: MachineStatusReportInterface[];

  @ApiProperty({ enum: MachineStatusReportGroupingKeys })
  public groupingKey: MachineStatusReportGroupingKeys;
}
