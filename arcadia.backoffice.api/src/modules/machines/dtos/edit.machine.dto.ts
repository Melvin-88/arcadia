import {
  IsEnum,
  IsIP,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MachinePowerLine } from 'arcadia-dal';

export class EditMachineDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public name: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public serial: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public groupName: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public siteName: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public cameraID: string;

  @IsOptional()
  @IsIP()
  @IsNotEmpty()
  @ApiProperty()
  public controllerIP: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public location: string;

  @IsOptional()
  @IsNotEmpty()
  @IsObject()
  @ApiProperty()
  public configuration: any;

  @IsEnum(MachinePowerLine)
  @IsNotEmpty()
  @ApiProperty()
  public powerLine: MachinePowerLine;
}
