import { ApiProperty } from '@nestjs/swagger';

export class SessionResponse {
    @ApiProperty()
    public status: string;

    @ApiProperty()
    public id: number;

    @ApiProperty()
    public groupName: string;

    @ApiProperty()
    public machineId: number;

    @ApiProperty()
    public operatorName: string;

    @ApiProperty()
    public playerCid: string;

    @ApiProperty()
    public ip: string;

    @ApiProperty()
    public startDate: Date;

    @ApiProperty()
    public duration: number;

    @ApiProperty()
    public rounds: number;

    @ApiProperty()
    public totalWinning: number;

    @ApiProperty()
    public totalNetCash: number;

    @ApiProperty()
    public viewerDuration: number;

    @ApiProperty()
    public queueDuration: number;

    @ApiProperty()
    public totalBets: number;

    @ApiProperty()
    public totalStacksUsed: number;

    @ApiProperty()
    public currency: string;

    @ApiProperty()
    public clientVersion: string;

    @ApiProperty()
    public os: string;

    @ApiProperty()
    public deviceType: string;

    @ApiProperty()
    public browser: string;

    @ApiProperty()
    public systemSettings: Record<string, any>;

    @ApiProperty()
    public videoUrl: string;
}

export class SessionsResponse {
    @ApiProperty()
    public total: number;

    @ApiProperty({ type: [SessionResponse] })
    public sessions: SessionResponse[];
}