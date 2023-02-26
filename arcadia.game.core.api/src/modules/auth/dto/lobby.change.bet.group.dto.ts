import { ApiProperty } from '@nestjs/swagger';
import { PayTableDto } from './paytable.dto';

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

  @ApiProperty()
  payTable: PayTableDto[];

  @ApiProperty()
  color: string;
}
