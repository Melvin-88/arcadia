export interface SessionInterface {
  status: string;
  id: number;
  groupName: string;
  operatorName: string;
  machineId: number;
  playerCid: string;
  playerIp: string;
  startDate: Date;
  duration: number;
  rounds: number;
  totalWinning: number;
  totalNetCash: number;
  viewerDuration: number;
  queueDuration: number;
  totalBets: number;
  totalStacksUsed: number;
  currency: string;
  clientVersion: string;
  os: string;
  deviceType: string;
  browser: string;
  systemSettings: Record<string, any>;
  total: number;
}
