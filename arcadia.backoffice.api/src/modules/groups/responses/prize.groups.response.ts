import { ApiProperty } from '@nestjs/swagger';

export class PrizeGroupsResponse {
  @ApiProperty()
  public total: number;

  @ApiProperty()
  public groups: string[];
}
