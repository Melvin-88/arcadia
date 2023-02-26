import { IRawStyle, IStyle } from '@uifabric/styling';
import { classNamesFunction } from '@uifabric/utilities';
import { Variant } from 'framer-motion';
import { Time } from '../../../../styles/constants';
import { RoundType } from '../../../../types/round';

export interface IGameStyleProps {
  activeRoundType?: RoundType | null;
  isFortuneWheelActive?: boolean;
  isBetBehindSession?: boolean;
  phantomWidgetTransitionDurationMS?: number;
}

export interface IGameStyles {
  root: IStyle;
  header: IStyle;
  container: IStyle;
  videoContainer: IStyle;
  videoStream: IStyle;
  fortuneWheel: IStyle;
  slotMachine: IStyle;
  gameInfoLeft: IStyle;
  gameInfoRight: IStyle;
  timerIndicator: IStyle;
  roundProgressIndicatorContainer: IStyle;
  roundProgressIndicator: IStyle;
  secondaryRoundProgressIndicator: IStyle;
  chipsBarWrapper: IStyle;
  chipsBar: IStyle;
  queueBar: IStyle;
  chipWin: IStyle;
  controlPanel: IStyle;
  buyPanel: IStyle;
}

const gameInfoCommonStyles: IRawStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  width: '50%',
  height: '100%',
  overflow: 'auto',
};

export const getStyles = ({
  activeRoundType,
  isFortuneWheelActive,
  isBetBehindSession,
  phantomWidgetTransitionDurationMS = 300,
}: IGameStyleProps): IGameStyles => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    height: '100%',
    userSelect: 'none',
  },
  header: {
    zIndex: 1,
  },
  container: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  videoContainer: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    padding: '1.8rem 0 32.5rem',
    flexGrow: 1,
    overflow: 'auto',
  },
  videoStream: {
    position: 'absolute',
    top: '0',
    bottom: '0',
    left: '0',
    right: '0',
    zIndex: -1,
  },
  fortuneWheel: [
    {
      position: 'absolute',
      top: '0',
      left: '50%',
      width: '95%',
      transform: 'translate3d(-50%, -58.5%, 0) scale(0.55)',
      transition: `transform ${phantomWidgetTransitionDurationMS}ms ${phantomWidgetTransitionDurationMS}ms`,
    },
    isFortuneWheelActive && {
      transform: 'translate3d(-50%, -77.5%, 0)',
      transition: `transform ${phantomWidgetTransitionDurationMS}ms ${phantomWidgetTransitionDurationMS / 2}ms`,
    },
  ],
  slotMachine: {
    position: 'absolute',
    top: '0',
    left: '50%',
    width: '60%',
    transform: 'translate3d(-50%, -80%, 0)',
    transition: `transform ${phantomWidgetTransitionDurationMS}ms ${phantomWidgetTransitionDurationMS}ms`,
  },
  gameInfoLeft: gameInfoCommonStyles,
  gameInfoRight: [
    gameInfoCommonStyles,
    {
      alignItems: 'flex-end',
    },
  ],
  timerIndicator: {
    width: '23.79rem',
  },
  roundProgressIndicatorContainer: {
    position: 'relative',
    width: '23.79rem',
    marginRight: '0.81rem',
  },
  roundProgressIndicator: [
    {
      width: '100%',
      transform: 'translate3d(0, 0, 0)',
      transition: `transform ${Time.defaultAnimationTime}s`,
      transformOrigin: 'center right',
    },
    (isBetBehindSession || activeRoundType === RoundType.scatter) && {
      transform: 'translate3d(-105%, 0, 0) scale(0.54)',
    },
  ],
  secondaryRoundProgressIndicator: {
    position: 'absolute',
    left: '0',
    top: '0',
    width: '100%',
  },
  chipsBarWrapper: {
    overflow: 'auto',
    margin: '1.5rem 2.67rem 0px 0px',
  },
  chipsBar: {
    width: '12.33rem',
  },
  queueBar: {
    marginTop: '1.5rem',
    paddingLeft: '2.85rem',
  },
  chipWin: {
    position: 'absolute',
    bottom: '32.5rem',
    left: '50%',
    transform: 'translateX(-50%)',
  },
  controlPanel: {
    marginTop: '-10rem',
  },
  buyPanel: {
    marginTop: '3.57rem',
  },
});

export const getClassNames = classNamesFunction<IGameStyleProps, IGameStyles>();

export enum ChipWinAnimationKeys {
  initial = 'initial',
  fadeIn = 'fadeIn',
  exit = 'exit',
  chipDetectionExit = 'chipDetectionExit',
}

export const chipWinAnimationVariants: { [key in ChipWinAnimationKeys]: Variant } = {
  [ChipWinAnimationKeys.initial]: { x: '-50%', scale: 0, opacity: 1 },
  [ChipWinAnimationKeys.fadeIn]: { x: '-50%', scale: 1, opacity: 1 },
  [ChipWinAnimationKeys.chipDetectionExit]: { x: '-50%', scale: 0, opacity: 0 },
  [ChipWinAnimationKeys.exit]: {
    x: ['-50%', '-130%', '-150%'],
    y: ['50%', '100%', '150%'],
    scale: [1, 0.8, 0],
    opacity: [1, 0.8, 0],
  },
};
