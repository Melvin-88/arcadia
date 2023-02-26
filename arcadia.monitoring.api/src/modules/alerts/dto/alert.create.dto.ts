import { ApiProperty } from '@nestjs/swagger';
import { AlertSeverity, AlertType } from 'arcadia-dal';
import {
  IsNotEmpty, IsObject, IsOptional, IsString,
} from 'class-validator';

export class AlertCreateDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    public type: AlertType;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    public source: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    public severity: AlertSeverity;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    public description: string;

    @ApiProperty()
    @IsObject()
    @IsOptional()
    public additionalInformation: Record<string, any>;
}
