import { ApiProperty } from '@nestjs/swagger';

export class StatisticsResponse {
    @ApiProperty()
    public inPending: string;

    @ApiProperty()
    public usedInLast24Hours: string;

    @ApiProperty()
    public usedInLast7Days: string;

    @ApiProperty()
    public usedInLast30Days: string;
}