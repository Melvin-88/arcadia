export interface PlaceBetDto {
  operatorId: string;
  playerId: string;
  currency: string;
  gameId: string;
  totalContributionAmount: number;
  operatorContributionAmount: number;
  playerContributionAmount: number;
  betInCash: number;
}
