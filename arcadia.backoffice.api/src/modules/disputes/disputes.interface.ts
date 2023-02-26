import { ApiProperty } from '@nestjs/swagger';

export class DisputeResponse {
    @ApiProperty()
    public status: string;

    @ApiProperty()
    public id: number;

    @ApiProperty()
    public operatorName: string;

    @ApiProperty()
    public operatorId: number;

    @ApiProperty()
    public playerCid: string;

    @ApiProperty()
    public sessionId: number;

    @ApiProperty()
    public rebateSum: number;

    @ApiProperty()
    public rebateCurrency: string;

    @ApiProperty()
    public openedAtDate: string;

    @ApiProperty({ required: false })
    public closedAtDate?: string;

    @ApiProperty()
    public complaint: string;

    @ApiProperty()
    public discussion: string;
}

export class DisputesResponse {
    @ApiProperty()
    public total: number;

    @ApiProperty({ type: [DisputeResponse] })
    public disputes: DisputeResponse[];
}
