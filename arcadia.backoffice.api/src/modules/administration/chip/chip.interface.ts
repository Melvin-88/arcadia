import { ApiProperty } from '@nestjs/swagger';
import { ChipStatus } from 'arcadia-dal';

export class ChipResponse {
    @ApiProperty()
    public rfid: string;

    @ApiProperty()
    public typeId: number;

    @ApiProperty()
    public value: number;

    @ApiProperty()
    public siteId: number;

    @ApiProperty()
    public status: ChipStatus;
}

export class ChipsResponse {
    @ApiProperty()
    public total: number;

    @ApiProperty({ type: [ChipResponse] })
    public chips: ChipResponse[];
}

export class DisqualifyChipsResponse {
    @ApiProperty()
    public total: number;

    @ApiProperty()
    public rfids: string[];
}

export class ParsedFromToRfidsInterface {
    from: {
        serial: string;
        index: number|null;
    };
    to?: {
        serial: string;
        index: number|null;
    };
}

export class ChipTypeResponse {
    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;
}

export class ChipTypesResponse {
    @ApiProperty()
    public total: number;

    @ApiProperty({ type: [ChipTypeResponse] })
    public chipTypes: ChipTypeResponse[];
}
