import React, { RefObject, useCallback, useMemo } from 'react';
import { IStyleFunctionOrObject, styled } from '@uifabric/utilities';
import { ResizeObserver } from '@juggle/resize-observer';
import { motion, AnimateSharedLayout } from 'framer-motion';
import { useDimensions } from '../../../../hooks/useDimension';
import iconQueue from '../../../../assets/images/queue.png';
import iconBetBehind from '../../../../assets/images/betBehind.png';
import iconViewers from '../../../../assets/images/watchers.png';
import imgArrowRight from '../../../../assets/images/arrowRight.png';
import { TextFit } from '../../../../components/TextFit/TextFit';
import { calculateDistanceBetweenQueueItems, getQueueUserIcon, preprocessQueue } from './helpers';
import { CurrentPlayer } from './CurrentPlayer/CurrentPlayer';
import { SessionStatus } from '../../../../types/session';
import { convertRemToPixels } from '../../../../styles/helpers';
import { Collapsible } from '../../../../components/Collapsible/Collapsible';
import { IQueuePlayers } from '../../../../types/queue';
import {
  getClassNames, getStyles, IQueueBarStyleProps, IQueueBarStyles,
} from './styles/QueueBar';

export interface IQueueBarProps extends Partial<IQueueBarStyleProps> {
  styles?: IStyleFunctionOrObject<IQueueBarStyleProps, IQueueBarStyles>;
  currentUserQueueToken?: string;
  isPlaying: boolean;
  queue: IQueuePlayers;
  betBehindersCount?: number;
  viewersCount?: number;
}

const QueueBarBase: React.FC<IQueueBarProps> = ({
  styles,
  className,
  currentUserQueueToken,
  isPlaying,
  queue,
  betBehindersCount = 0,
  viewersCount = 0,
}) => {
  const { ref: rootRef, height: rootHeight } = useDimensions<HTMLDivElement>();
  const { ref: containerRef, entry: containerEntry } = useDimensions<HTMLDivElement>();
  const { ref: separatorRef, height: separatorHeight } = useDimensions<HTMLDivElement>({
    useBorderBoxSize: true,
    polyfill: ResizeObserver,
  });
  const { ref: queueInfoCurrentUserRef, height: queueInfoCurrentUserHeight = 0 } = useDimensions<HTMLDivElement>({
    useBorderBoxSize: true,
    polyfill: ResizeObserver,
  });
  const { ref: generalInfoRef, height: generalInfoHeight } = useDimensions<HTMLDivElement>();

  // TODO: Replace values by computed data BEGIN
  const TEMP_SINGLE_QUEUE_INFO_ITEM_HEIGHT = convertRemToPixels(7.232);
  // TODO: Replace values by computed data END

  const {
    queueBeforeCurrentUser,
    queueAfterCurrentUser,
    currentUserPosition,
  } = useMemo(() => (
    preprocessQueue(queue, currentUserQueueToken)
  ), [currentUserQueueToken, queue]);

  const containerVerticalBordersAndPaddingSum = useMemo(() => {
    const borderBox = Array.isArray(containerEntry?.borderBoxSize) ? containerEntry?.borderBoxSize[0] : containerEntry?.borderBoxSize;
    const contentBox = Array.isArray(containerEntry?.contentBoxSize) ? containerEntry?.contentBoxSize[0] : containerEntry?.contentBoxSize;

    // @ts-ignore TODO: This error should be ignored before fixed types in the library
    return (borderBox?.blockSize || 0) - (contentBox?.blockSize || 0);
  }, [containerEntry]);

  const isCurrentUserExistInQueue = currentUserPosition !== null;

  const classNames = getClassNames(styles, {
    className,
  });

  const renderGeneralInfoItem = useCallback((count: number, icon: string) => (
    <div className={classNames.generalInfoItem}>
      <img
        className={classNames.generalInfoIcon}
        src={icon}
        alt=""
      />
      <TextFit
        className={classNames.generalInfoAmount}
        mode="single"
        forceSingleModeWidth={false}
      >
        { count }
      </TextFit>
    </div>
  ), []);

  const renderCurrentUser = useCallback((classNameRoot: string, position: number | null, ref?: RefObject<HTMLDivElement>) => (
    <motion.div ref={ref} className={classNameRoot} layoutId="currentUser">
      <CurrentPlayer isPositionExists={!!position} />
      { position && (
        <TextFit
          className={classNames.currentUserPosition}
          mode="single"
          forceSingleModeWidth={false}
        >
          { `#${position}` }
        </TextFit>
      ) }
    </motion.div>
  ), []);

  const renderQueue = useCallback((
    queuePlayers: IQueuePlayers,
    distanceBetweenItems: number,
  ) => queuePlayers.map(({ queueToken, status }, index) => (
    <div
      key={queueToken}
      className={classNames.queueInfoItem}
      style={{
        marginTop: index === 0 ? 0 : distanceBetweenItems,
      }}
    >
      <img
        className={classNames.userIcon}
        src={getQueueUserIcon(index + 1)}
        alt=""
      />
      { status === SessionStatus.playing && (
        <img
          className={classNames.currentPlayingUserIcon}
          src={imgArrowRight}
          alt=""
        />
      ) }
    </div>
  )), []);

  const availableQueueInfoHeight = rootHeight - separatorHeight - generalInfoHeight - containerVerticalBordersAndPaddingSum;
  const summaryQueueItemsHeight = TEMP_SINGLE_QUEUE_INFO_ITEM_HEIGHT * (queue.length - (isCurrentUserExistInQueue ? 1 : 0));
  const summaryQueueItemsOverflowHeight = availableQueueInfoHeight - summaryQueueItemsHeight - queueInfoCurrentUserHeight;

  const distanceBetweenQueueItems = calculateDistanceBetweenQueueItems(
    queueBeforeCurrentUser.length,
    queueAfterCurrentUser.length,
    summaryQueueItemsOverflowHeight,
  );

  return (
    <div ref={rootRef} className={classNames.root}>
      <AnimateSharedLayout>
        <Collapsible classNameArrow={classNames.collapsibleArrow} collapseImage={iconQueue}>
          <div ref={containerRef} className={classNames.container}>
            { !isPlaying && queue.length > 0 && (
              <>
                <div
                  className={classNames.queueInfo}
                  style={{
                    height: summaryQueueItemsOverflowHeight >= 0 ? undefined : availableQueueInfoHeight,
                  }}
                >
                  { renderQueue(queueBeforeCurrentUser, distanceBetweenQueueItems) }
                  { isCurrentUserExistInQueue && (
                    renderCurrentUser(
                      classNames.queueInfoCurrentUserContainer,
                      currentUserPosition,
                      queueInfoCurrentUserRef,
                    )
                  ) }
                  { renderQueue(queueAfterCurrentUser, distanceBetweenQueueItems) }
                </div>
                <div ref={separatorRef} className={classNames.separator} />
              </>
            ) }
            <div ref={generalInfoRef} className={classNames.generalInfo}>
              { renderGeneralInfoItem(queue.length, iconQueue) }
              { !isCurrentUserExistInQueue && (
                renderCurrentUser(classNames.currentUserContainer, currentUserPosition)
              ) }
              { renderGeneralInfoItem(betBehindersCount, iconBetBehind) }
              { renderGeneralInfoItem(viewersCount, iconViewers) }
            </div>
          </div>
        </Collapsible>
      </AnimateSharedLayout>
    </div>
  );
};

export const QueueBar = React.memo(
  styled<
    IQueueBarProps,
    IQueueBarStyleProps,
    IQueueBarStyles
  >(
    QueueBarBase,
    getStyles,
  ),
);
