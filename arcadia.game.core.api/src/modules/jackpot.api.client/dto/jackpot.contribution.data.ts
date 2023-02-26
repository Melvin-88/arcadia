import { PlaceBetResp } from './place.bet.resp';

export class JackpotContributionData {
  sessionId: number;
  roundId: number;
  playerId: string;
  operatorConnector: string;
  betInCash: number;
  currency: string;
  contributionDetails: PlaceBetResp;
}