import { ApiPropertyOptional, ApiResponseProperty } from '@nestjs/swagger';

export class AuthResponse {
  @ApiResponseProperty()
  balance: number;

  @ApiResponseProperty()
  cid: string;

  @ApiResponseProperty()
  currencyCode: string;

  @ApiPropertyOptional()
  countryCode?: string;

  @ApiPropertyOptional()
  name?: string;

  @ApiPropertyOptional()
  affiliateId?: string;

  @ApiPropertyOptional()
  playerIp?: string;

  @ApiResponseProperty()
  timestamp: Date;

  @ApiResponseProperty()
  type: string;

  @ApiPropertyOptional()
  playerToken?: string;
}
