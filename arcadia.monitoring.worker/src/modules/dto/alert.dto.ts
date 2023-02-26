import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { AlertSeverity, AlertType } from 'arcadia-dal';

export class AlertDto {
  @IsEnum(AlertType)
  @IsNotEmpty()
  public alertType: AlertType;

  @IsString()
  @IsNotEmpty()
  public source: string;

  @IsEnum(AlertSeverity)
  @IsNotEmpty()
  public severity: AlertSeverity;

  @IsString()
  @IsNotEmpty()
  public description: string;

  @IsObject()
  @IsOptional()
  public additionalInformation: Record<string, any>;
}