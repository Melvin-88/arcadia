import {
  IsBoolean,
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsValidBackofficePassword } from './backoffice.password.validator';
import { PasswordRequiredDto } from '../../../dtos/password.required.dto';

export class CreateUserDto extends PasswordRequiredDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public firstName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public lastName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public email: string;

  @IsMobilePhone()
  @IsNotEmpty()
  @ApiProperty()
  public phone1: string;

  @IsMobilePhone()
  @IsOptional()
  @ApiProperty()
  public phone2: string;

  @IsBoolean()
  @ApiProperty()
  public isAdmin: boolean;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @IsValidBackofficePassword()
  public userPassword: string;

  @ApiProperty()
  @IsNotEmpty()
  public permittedModules: number[];
}

export class EditUserDto extends PasswordRequiredDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public firstName: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public lastName: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public email: string;

  @IsOptional()
  @IsMobilePhone()
  @IsNotEmpty()
  @ApiProperty()
  public phone1: string;

  @IsOptional()
  @IsMobilePhone()
  @IsOptional()
  @ApiProperty()
  public phone2: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  public isAdmin: boolean;

  @IsOptional()
  @ApiProperty()
  public permittedModules: number[];
}

export class ChangeUserPasswordDto extends PasswordRequiredDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Administrator\'s password' })
  public currentUsersPassword: string;
}
