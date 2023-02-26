import { ApiProperty } from '@nestjs/swagger';

export class VoucherResponse {
    @ApiProperty()
    public status: string;

    @ApiProperty()
    public id: string;

    @ApiProperty()
    public operatorName: string;

    @ApiProperty()
    public playerCid: string;

    @ApiProperty()
    public sessionId: number;

    @ApiProperty()
    public groupName: string;

    @ApiProperty()
    public grantedDate: string;

    @ApiProperty()
    public expirationDate: string;

    @ApiProperty()
    public revocationReason?: string;
}

export class VouchersResponse {
    @ApiProperty()
    public total: number;

    @ApiProperty({ type: [VoucherResponse] })
    public vouchers: VoucherResponse[];
}
