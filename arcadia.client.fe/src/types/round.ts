export enum RoundType {
  regular = 'regular',
  betBehind = 'betBehind',
  scatter = 'scatter',
  voucher = 'voucher',
}

export interface IActiveRound {
  type: RoundType;
}
