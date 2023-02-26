import { IsInt, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PerformanceIndicatorSubsegment {
    @IsInt()
    @IsOptional()
    @ApiProperty({ required: false })
    group?: number;

    @IsInt()
    @IsOptional()
    @ApiProperty({ required: false })
    machine?: number;

    @IsInt()
    @IsOptional()
    @ApiProperty({ required: false })
    operator?: number;
}
