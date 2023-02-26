import iconQueueUserViolet from '../../../../assets/images/queueUserViolet.png';
import iconQueueUserGreen from '../../../../assets/images/queueUserGreen.png';
import iconQueueUserBlue from '../../../../assets/images/queueUserBlue.png';
import iconQueueUserCyan from '../../../../assets/images/queueUserCyan.png';
import iconQueueUserPurple from '../../../../assets/images/queueUserPurple.png';
import { convertRemToPixels } from '../../../../styles/helpers';
import { IQueuePlayers } from '../../../../types/queue';

export const getQueueUserIcon = (queueItemOrder: number) => {
  const POSSIBLE_VARIANTS_COUNT = 5;
  let multiplier = Math.floor(queueItemOrder / POSSIBLE_VARIANTS_COUNT);

  if (queueItemOrder / POSSIBLE_VARIANTS_COUNT === multiplier) {
    multiplier -= 1;
  }

  const multipliedIncrement = POSSIBLE_VARIANTS_COUNT * multiplier;

  switch (true) {
    case queueItemOrder === 0:
    default:
      return iconQueueUserViolet;

    case queueItemOrder / (5 + multipliedIncrement) === 1:
      return iconQueueUserGreen;

    case queueItemOrder / (4 + multipliedIncrement) === 1:
      return iconQueueUserBlue;

    case queueItemOrder / (3 + multipliedIncrement) === 1:
      return iconQueueUserCyan;

    case queueItemOrder / (2 + multipliedIncrement) === 1:
      return iconQueueUserPurple;
  }
};

export const preprocessQueue = (queue: IQueuePlayers, currentPlayerQueueToken?: string) => {
  const queueBeforeCurrentUser: IQueuePlayers = [];
  const queueAfterCurrentUser: IQueuePlayers = [];
  let currentUserPosition: number | null = null;

  queue.forEach((item, index) => {
    if (currentPlayerQueueToken === item.queueToken) {
      currentUserPosition = index + 1;
    } else if (currentUserPosition === null) {
      queueBeforeCurrentUser.push(item);
    } else {
      queueAfterCurrentUser.push(item);
    }
  });

  return {
    queueBeforeCurrentUser,
    queueAfterCurrentUser,
    currentUserPosition,
  };
};

export const calculateDistanceBetweenQueueItems = (
  queueBeforeCurrentUserLength: number,
  queueAfterCurrentUserLength: number,
  summaryQueueItemsOverflowHeight: number,
) => {
  const maxDistanceBetweenQueueItemsInRem = 1.08;
  const maxDistanceBetweenQueueItems = convertRemToPixels(maxDistanceBetweenQueueItemsInRem);
  const queueLengthExcludingCurrentUser = queueBeforeCurrentUserLength + queueAfterCurrentUserLength;

  let queueLengthDecrement = 1;

  if (queueBeforeCurrentUserLength && queueAfterCurrentUserLength) {
    queueLengthDecrement += 1;
  }

  const result = summaryQueueItemsOverflowHeight / (queueLengthExcludingCurrentUser - queueLengthDecrement);

  return Math.min(result, maxDistanceBetweenQueueItems);
};
