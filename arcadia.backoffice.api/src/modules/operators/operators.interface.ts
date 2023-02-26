import { ApiProperty } from '@nestjs/swagger';

export class OperatorResponse {
    @ApiProperty()
    public status: string;

    @ApiProperty()
    public id: number;

    @ApiProperty()
    public name: string;

    @ApiProperty()
    public logoUrl?: string;

    @ApiProperty()
    public apiConnectorId: string;

    @ApiProperty()
    public apiAccessToken: string;

    @ApiProperty()
    public apiTokenExpirationDate: Date;

    @ApiProperty()
    public regulation: Record<string, any>;

    @ApiProperty()
    public linkToGroups: number[];

    @ApiProperty()
    public linkToVouchers: number[];

    @ApiProperty()
    public activeSessionsCount: number;

    @ApiProperty()
    public blueRibbonOperatorId: string;

    @ApiProperty()
    public voucherPortalUsername: string;

    @ApiProperty()
    public configuration: Record<string, any>;
}

export class OperatorNameResponse {
    @ApiProperty()
    public id: number;

    @ApiProperty()
    public name: string;
}

export class OperatorNamesResponse {
    @ApiProperty()
    public total: number;

    @ApiProperty({ type: [OperatorNameResponse] })
    public operators: OperatorNameResponse[];
}

export class OperatorsResponse {
    @ApiProperty()
    public total: number;

    @ApiProperty({ type: [OperatorResponse] })
    public operators: OperatorResponse[];
}

export class OperatorLogoResponse {
    @ApiProperty()
    public id: number;

    @ApiProperty()
    public url: string;
}