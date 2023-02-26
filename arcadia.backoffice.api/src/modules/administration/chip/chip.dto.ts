import {
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterChipDto {
    @IsString()
    @Length(1, 255)
    // @Matches(/[A-Za-z]+-[0-9]*/g, { message: 'RFID should match pattern /[A-Za-z]+-[0-9]*/' })
    @ApiProperty()
    public fromRFID: string;

    @IsString()
    @Length(1, 255)
    // @Matches(/[A-Za-z]+-[0-9]*/g, { message: 'RFID should match pattern /[A-Za-z]+-[0-9]*/' })
    @ApiProperty()
    public toRFID: string;

    @IsNumber()
    @ApiProperty()
    public typeId: number;

    @IsNumber()
    @ApiProperty()
    public value: number;

    @IsNumber()
    @ApiProperty()
    public siteId: number;

    @IsNumber()
    @IsOptional()
    @ApiProperty()
    public machineId: number;
}

export class DisqualifyChipDto {
    @IsString()
    @Length(1, 255)
    @ApiProperty()
    public fromRFID: string;

    @IsString()
    @IsOptional()
    @Length(1, 255)
    @ApiProperty()
    public toRFID?: string;
}
