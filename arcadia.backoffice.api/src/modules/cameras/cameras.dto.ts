import {
  IsBoolean, IsInt, IsNotEmpty, IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddCameraDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    public id: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    public type: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    public ip: string;

    @IsInt()
    @IsNotEmpty()
    @ApiProperty()
    public port: number;

    @IsInt()
    @IsNotEmpty()
    @ApiProperty()
    public adminPort: number;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    public adminUrl: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    public adminUser: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    public adminPassword: string;
}

export class EditCameraDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    public type: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    public ip: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    public adminUrl: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    public adminUser: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    public adminPassword: string;
}

export class ToggleStreamDto {
    @IsBoolean()
    @IsNotEmpty()
    @ApiProperty()
    public isRecorded: boolean;
}
