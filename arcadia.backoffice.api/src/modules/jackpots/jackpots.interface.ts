import { ApiProperty } from '@nestjs/swagger';

export class JackpotResponse {
    @ApiProperty()
    public status: string;

    @ApiProperty()
    public id: string;

    @ApiProperty()
    public name: string;

    @ApiProperty()
    public prize: number;

    @ApiProperty()
    public contribution: number;

    @ApiProperty()
    public seed: number;

    @ApiProperty()
    public autoReseed: boolean;

    @ApiProperty()
    public precedingJackpotId: string;

    @ApiProperty()
    public associatedGroups: string[];
}

export class JackpotsResponse {
    @ApiProperty()
    public total: number;

    @ApiProperty({ type: [JackpotResponse] })
    public jackpots: JackpotResponse[];
}
