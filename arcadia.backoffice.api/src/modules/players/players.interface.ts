import { ApiProperty } from '@nestjs/swagger';

export class PlayerResponse {
    @ApiProperty()
    public status: string;

    @ApiProperty()
    public operatorName: string;

    @ApiProperty()
    public blockReason?: string;

    @ApiProperty()
    public cid: string;

    @ApiProperty()
    public bets: number;

    @ApiProperty()
    public wins: number;

    @ApiProperty()
    public netCash: number;

    @ApiProperty()
    public currency: string;

    @ApiProperty()
    public createdDate: string;

    @ApiProperty()
    public lastSessionDate: string;

    @ApiProperty()
    public settings: Record<string, any>;

    @ApiProperty()
    public connectedMachines?: string[];
}

export class PlayersResponse {
    @ApiProperty()
    public total: number;

    @ApiProperty({ type: [PlayerResponse] })
    public players: PlayerResponse[];
}

export class SitesResponse {
    @ApiProperty()
    public sites: string[];
}

export class BlockReasonsResponse {
    @ApiProperty()
    public blockReasons: string[];
}
