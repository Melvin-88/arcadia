import { ApiProperty } from '@nestjs/swagger';

export class MaintenanceAlertResponse {
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
    public additionalInfo: { maintenanceRequired?: boolean; maintenanceType?: string; machineId?: number; dispenserId?: number };
}

export class MaintenanceAlertsResponse {
    @ApiProperty()
    public total: number;

    @ApiProperty({ type: [MaintenanceAlertResponse] })
    public alerts: MaintenanceAlertResponse[];
}
