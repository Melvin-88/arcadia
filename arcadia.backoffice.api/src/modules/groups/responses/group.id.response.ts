import { ApiProperty } from '@nestjs/swagger';

export class GroupIdResponse {
  @ApiProperty()
  public groupId: number;
}
