import {
  IsArray,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PasswordRequiredDto } from '../../dtos/password.required.dto';

export class CreateOperatorDto extends PasswordRequiredDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public apiConnectorId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public apiAccessToken: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public voucherPortalUsername: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public voucherPortalPassword: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty()
  public apiTokenExpirationDate: Date;

  @IsObject()
  @IsNotEmpty()
  @ApiProperty()
  public regulation: Record<string, any>;

  @IsInt({ each: true })
  @IsArray()
  @ApiProperty()
  public linkToGroups: number[];

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: false })
  public logoUrl?: string;

  @IsOptional()
  @Length(1, 128)
  @ApiProperty({ required: false })
  public blueRibbonOperatorId?: string;

  @IsObject()
  @IsNotEmpty()
  @ApiProperty()
  public configuration: Record<string, any>;
}

export class EditOperatorDto extends PasswordRequiredDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: false })
  public name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: false })
  public apiConnectorId?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: false })
  public apiAccessToken?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: false })
  public voucherPortalUsername?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: false })
  public voucherPortalPassword?: string;

  @IsOptional()
  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({ required: false })
  public apiTokenExpirationDate?: Date;

  @IsOptional()
  @IsObject()
  @IsNotEmpty()
  @ApiProperty({ required: false })
  public regulation?: Record<string, any>;

  @IsOptional()
  @IsInt({ each: true })
  @IsArray()
  @ApiProperty({ required: false })
  public linkToGroups?: number[];

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  public logoUrl?: string;

  @IsOptional()
  @Length(1, 128)
  @ApiProperty({ required: false })
  public blueRibbonOperatorId?: string;

  @IsOptional()
  @IsObject()
  @IsNotEmpty()
  @ApiProperty()
  public configuration: Record<string, any>;
}
