import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BlockPlayerDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    public reason: string;
}
