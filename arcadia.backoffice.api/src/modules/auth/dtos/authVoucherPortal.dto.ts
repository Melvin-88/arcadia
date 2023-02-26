import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginVoucherPortalDto {
  @ApiProperty()
  @IsString()
  public username: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  public password: string;
}
