export interface GroupInterface {
  id: number;
  status: string;
  name: string;
  blueRibbonGameId: string;
  color: string;
  machinesTotal: number;
  totalPowerLineA: number;
  totalPowerLineB: number;
  machinesIdle: number;
  denominator: number;
  hasJackpot: boolean;
  operators: boolean;
  stackCoinsSize: number;
  stackBuyLimit: number;
  idleTimeout: number;
  graceTimeout: number;
  isPrivate: boolean;
  regulation: Record<string, any>;
  configuration: Record<string, any>;
  prizeGroup: string;
}
