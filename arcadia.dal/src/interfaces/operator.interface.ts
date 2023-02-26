export interface OperatorInterface {
  status: string;
  id: number;
  name: string;
  apiConnectorId: string;
  apiAccessToken: string;
  apiTokenExpirationDate: Date;
  regulation: Record<string, any>;
  configuration: Record<string, any>;
  linkToGroups: number[];
  linkToVouchers: number[];
  activeSessionsCount: number;
  logoUrl?: string;
  blueRibbonOperatorId: string;
  voucherPortalUsername: string;
}
