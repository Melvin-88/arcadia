import { ApiProperty } from '@nestjs/swagger';

export class GroupResponse {
  @ApiProperty()
  public id: number;

  @ApiProperty()
  public status: string;

  @ApiProperty()
  public name: string;

  @ApiProperty()
  public blueRibbonGameId: string;

  @ApiProperty()
  public color?: string;

  @ApiProperty()
  public machinesTotal: number;

  @ApiProperty()
  public totalPowerLineA: number;

  @ApiProperty()
  public totalPowerLineB: number;

  @ApiProperty()
  public machinesIdle: number;

  @ApiProperty()
  public denominator: number;

  @ApiProperty()
  public hasJackpot: boolean;

  @ApiProperty()
  public operators: boolean;

  @ApiProperty()
  public stackCoinsSize: number;

  @ApiProperty()
  public stackBuyLimit: number;

  @ApiProperty()
  public idleTimeout: number;

  @ApiProperty()
  public graceTimeout: number;

  @ApiProperty()
  public isPrivate: boolean;

  @ApiProperty()
  public regulation: Record<string, any>;

  @ApiProperty()
  public configuration: Record<string, any>;

  @ApiProperty()
  public prizeGroup: string;
}

export class GroupsResponse {
  @ApiProperty()
  public total: number;

  @ApiProperty({ type: [GroupResponse] })
  public groups: GroupResponse[];
}
