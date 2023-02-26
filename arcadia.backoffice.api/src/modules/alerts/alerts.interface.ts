import { ApiProperty } from '@nestjs/swagger';
import { ViolatedThreshold } from 'arcadia-dal';

export class AlertResponse {
    @ApiProperty()
    public status: string;

    @ApiProperty()
    public id: number;

    @ApiProperty()
    public type: string;

    @ApiProperty()
    public severity: string;

    @ApiProperty()
    public source: string;

    @ApiProperty()
    public date: Date;

    @ApiProperty()
    public description: string;

    @ApiProperty()
    public additionalInfo: {
        maintenanceRequired?: boolean;
        maintenanceType?: string;
        machineId?: number;
        machineSerial?: string;
        machineName?: string;
        chipType?: number;
        dispenserName?: string;
        violatedThreshold?: ViolatedThreshold;
    };

    @ApiProperty()
    public isFlagged: boolean;
}

export class AlertsResponse {
    @ApiProperty()
    public total: number;

    @ApiProperty({ type: [AlertResponse] })
    public alerts: AlertResponse[];
}
