export interface PlayerInterface {
  status: string;
  operatorName: string;
  blockReason?: string;
  cid: string;
  bets: number;
  wins: number;
  netCash: number;
  createdDate: string;
  lastSessionDate: string;
  settings: Record<string, any>;
}
