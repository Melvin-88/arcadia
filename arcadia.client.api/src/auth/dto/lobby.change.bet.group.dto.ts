import { ApiProperty } from '@nestjs/swagger';

export class LobbyChangeBetGroupDto {
  @ApiProperty()
  groupId: number;

  @ApiProperty()
  groupName: string;

  @ApiProperty()
  jackpotGameId: string;

  @ApiProperty()
  queueLength: number;

  @ApiProperty()
  betInCash: number;

  @ApiProperty()
  currency: string;
}