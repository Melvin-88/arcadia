import { ApiProperty } from '@nestjs/swagger';

export class GroupNameResponse {
  @ApiProperty()
  public name: string;

  @ApiProperty()
  public id: number;
}

export class GroupNamesResponse {
  @ApiProperty()
  public total: number;

  @ApiProperty({ type: [GroupNameResponse] })
  public groups: GroupNameResponse[];
}
