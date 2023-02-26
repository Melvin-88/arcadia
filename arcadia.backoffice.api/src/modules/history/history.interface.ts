import { ApiProperty } from '@nestjs/swagger';

export class EntityHistoryUserResponse {
    @ApiProperty()
    public id: number;

    @ApiProperty()
    public email: string;

    @ApiProperty()
    public name: string;
}

export class EntityHistoryResponse {
    @ApiProperty()
    public date: Date;

    @ApiProperty()
    public action: string;

    @ApiProperty({ type: EntityHistoryUserResponse })
    public user: EntityHistoryUserResponse;

    @ApiProperty()
    public previousData: any;

    @ApiProperty()
    public newData: any;
}

export class EntitiesHistoryResponse {
    @ApiProperty()
    public total: number;

    @ApiProperty({ type: [EntityHistoryResponse] })
    public history: EntityHistoryResponse[];
}
