import { ApiProperty } from '@nestjs/swagger';

export abstract class AbstractReportInterface {
  abstract data: any;

  @ApiProperty()
  total: number;
}
