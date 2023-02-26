import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { PasswordRequiredDto } from '../../../dtos/password.required.dto';

export class LoginDto extends PasswordRequiredDto {
  @ApiProperty()
  @IsEmail()
  public email: string;
}
