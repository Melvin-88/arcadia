import { ApiResponseProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiResponseProperty()
  url: string;

  @ApiResponseProperty()
  token: string;

  @ApiResponseProperty()
  currency: string;

  @ApiResponseProperty()
  blueRibbonToken: string;

  @ApiResponseProperty()
  blueRibbonOperatorId: string;

  @ApiResponseProperty()
  blueRibbonBaseServiceUrl: string;

  @ApiResponseProperty()
  playerId: string;
}
