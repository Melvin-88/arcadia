import { SessionStatus } from '../../../types/session';
import { IActiveRound, RoundType } from '../../../types/round';

interface IGetRoundsProgressIndicatorCoins {
  sessionStatus: SessionStatus;
  activeRound: IActiveRound | null;
  stackSize: number;
  coins: number;
}

export const getRoundsProgressIndicatorCoins = ({
  sessionStatus,
  activeRound,
  stackSize,
  coins,
}: IGetRoundsProgressIndicatorCoins) => {
  if (sessionStatus === SessionStatus.viewer || sessionStatus === SessionStatus.viewerBetBehind || sessionStatus === SessionStatus.reBuy) {
    return null;
  }

  if (
    sessionStatus === SessionStatus.queue
    || sessionStatus === SessionStatus.queueBetBehind
    || activeRound?.type === RoundType.scatter
  ) {
    return stackSize;
  }

  return coins;
};
