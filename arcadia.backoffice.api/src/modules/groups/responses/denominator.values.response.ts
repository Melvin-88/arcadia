import { ApiProperty } from '@nestjs/swagger';

export class DenominatorValuesResponse {
  @ApiProperty()
  public total: number;

  @ApiProperty()
  public denominators: number[];
}
