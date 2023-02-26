import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class LogDto {
    @ApiProperty()
    @IsInt()
    public time: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    public source: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    public severity: 'INFO' | 'WARNING' | 'ERROR';

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    public message: string;
}
