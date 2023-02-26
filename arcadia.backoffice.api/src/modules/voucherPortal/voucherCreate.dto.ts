import {
  IsArray, IsDateString, IsNotEmpty, IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class VoucherCreateDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    public groupName: string;

    @IsDateString()
    @IsNotEmpty()
    @ApiProperty()
    public expirationDate: Date;

    @IsArray()
    @Transform(({ value }) => (Array.isArray(value) ? value : value.split(',')))
    @IsNotEmpty()
    @ApiProperty()
    public playerCid: string[];
}
