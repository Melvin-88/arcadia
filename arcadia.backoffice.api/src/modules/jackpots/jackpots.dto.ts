import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PasswordRequiredDto } from '../../dtos/password.required.dto';

export class CreateJackpotDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public name: string;

  @IsNumber()
  @ApiProperty()
  public contribution: number;

  @IsNumber()
  @ApiProperty()
  public seed: number;

  @IsBoolean()
  @ApiProperty()
  public autoReseed: boolean;

  @IsNumber(null, { each: true })
  @ApiProperty()
  public linkToGroups: string[];
}

export class EditJackpotDto extends PasswordRequiredDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public name: string;

  @IsNumber()
  @ApiProperty()
  public contribution: number;

  @IsNumber()
  @ApiProperty()
  public seed: number;

  @IsBoolean()
  @ApiProperty()
  public autoReseed: boolean;

  @IsNumber(null, { each: true })
  @ApiProperty()
  public linkToGroups: string[];
}
