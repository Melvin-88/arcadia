export interface ISignInRequestBody {
  accessToken: string;
  operatorId: number;
  homeUrl?: string;
}

export interface ISignInResponseBody {
  url: string;
  token: string;
  playerId: string;
  currency: string;
  blueRibbonBaseServiceUrl: string;
  blueRibbonToken: string;
  blueRibbonOperatorId: string;
}
