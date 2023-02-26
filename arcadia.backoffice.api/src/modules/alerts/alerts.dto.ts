import { ApiProperty } from '@nestjs/swagger';
import { IsObject } from 'class-validator';

export class AlertJsonEditDto {
    @ApiProperty()
    @IsObject()
    public additionalInfo: Record<string, any>;
}
