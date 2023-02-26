import { ApiProperty } from '@nestjs/swagger';
import { IsValidBackofficePassword } from '../modules/administration/user/backoffice.password.validator';

export class PasswordRequiredDto {
  @ApiProperty()
  @IsValidBackofficePassword()
  public password: string;
}
