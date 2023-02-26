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

export class CreateMachineDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public serial: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: false })
  public groupName: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: false })
  public siteName: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: false })
  public cameraID: string;

  @IsOptional()
  @IsIP()
  @IsNotEmpty()
  @ApiProperty({ required: false })
  public controllerIP: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: false })
  public location: string;

  @IsOptional()
  @IsNotEmpty()
  @IsObject()
  @ApiProperty({ required: false })
  public configuration: any;

  @IsEnum(MachinePowerLine)
  @IsNotEmpty()
  @ApiProperty()
  public powerLine: MachinePowerLine;
}
