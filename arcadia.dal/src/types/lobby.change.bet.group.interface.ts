import { Configuration } from './configuration';

export class LobbyChangeBetGroupInterface {
  groupId: number;
  groupName: string;
  denominator: number;
  queueLength: number;
  jackpotGameId: string;
  config: Configuration;
  color: string;
  prizeGroup: string;
}
