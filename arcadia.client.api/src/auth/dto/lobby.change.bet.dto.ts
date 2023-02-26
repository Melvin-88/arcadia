import { ApiProperty } from '@nestjs/swagger';
import { LobbyChangeBetGroupDto } from './lobby.change.bet.group.dto';

export class LobbyChangeBetDto {
  @ApiProperty()
  jackpotOperatorId: string;

  @ApiProperty({ type: [LobbyChangeBetGroupDto] })
  groups: LobbyChangeBetGroupDto[];
}