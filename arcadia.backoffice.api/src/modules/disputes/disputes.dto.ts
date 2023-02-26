import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DisputeStatus } from 'arcadia-dal';

export class CreateDisputeDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    public status: DisputeStatus;

    @IsNumber()
    @IsOptional()
    @ApiProperty()
    public rebateSum: number;

    @IsString()
    @IsOptional()
    @Length(3, 3)
    @ApiProperty()
    public rebateCurrency: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    public complaint: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    public discussion: string;

    @IsNumber()
    @ApiProperty()
    public operatorId: number;

    @IsString()
    @IsOptional()
    @ApiProperty()
    public playerCid: string;

    @IsOptional()
    @IsNumber()
    @ApiProperty()
    public sessionId: number;
}

export class UpdateDisputeDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    public status: DisputeStatus;

    @IsNumber()
    @IsOptional()
    @ApiProperty()
    public rebateSum: number;

    @IsString()
    @IsOptional()
    @Length(3, 3)
    @ApiProperty()
    public rebateCurrency: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    public complaint: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    public discussion: string;

    @IsNumber()
    @ApiProperty()
    public operatorId: number;

    @IsString()
    @IsOptional()
    @ApiProperty()
    public playerCid: string;

    @IsOptional()
    @IsNumber()
    @ApiProperty()
    public sessionId: number;
}
