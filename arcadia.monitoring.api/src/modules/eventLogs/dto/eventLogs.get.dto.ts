import {
  IsArray, IsDateString,
  IsInt, IsNotEmpty, IsOptional, IsString,
} from 'class-validator';

export class EventLogsGetDto {
    @IsInt()
    @IsOptional()
    public take: number;

    @IsInt()
    @IsOptional()
    public offset: number;

    @IsArray({ each: true })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    public source: string[];

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    public type: string;

    @IsDateString()
    @IsNotEmpty()
    @IsOptional()
    public dateFrom: Date;

    @IsDateString()
    @IsNotEmpty()
    @IsOptional()
    public dateTo: Date;
}
