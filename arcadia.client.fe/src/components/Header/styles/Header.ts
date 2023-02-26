import { IStyle, keyframes } from '@uifabric/styling';
import { classNamesFunction } from '@uifabric/utilities';
import { Time } from '../../../styles/constants';

export interface IHeaderStyleProps {
  className?: string;
  isFortuneWheelPointerVisible?: boolean;
  isFortuneWheelPointerHighlighting?: boolean;
  isHomeButtonHidden?: boolean;
}

export interface IHeaderStyles {
  root: IStyle;
  headerBackground: IStyle;
  content: IStyle;
  burgerBtn: IStyle;
  ribbon: IStyle;
  jackpot: IStyle;
  lobbyBtn: IStyle;
  fortuneWheelPointer: IStyle;
}

// TODO: Prevent duplications after demo
const fortuneWheelPointerKeyframes = keyframes({
  '0%': {
    transform: 'translate(-50%, -21%) rotate(0deg) scale(1.25)',
  },
  '20%': {
    transform: 'translate(-50%, -21%) rotate(0deg) scale(1)',
  },
  '40%': {
    transform: 'translate(-50%, -21%) rotate(0deg) scale(1.25)',
  },
  '60%': {
    transform: 'translate(-50%, -21%) rotate(0deg) scale(1)',
  },
  '80%': {
    transform: 'translate(-50%, -21%) rotate(0deg) scale(1.25)',
  },
  '100%': {
    transform: 'translate(-50%, -21%) rotate(0deg) scale(1.25)',
  },
});

export const getStyles = ({
  className, isFortuneWheelPointerVisible, isFortuneWheelPointerHighlighting, isHomeButtonHidden,
}: IHeaderStyleProps): IHeaderStyles => ({
  root: [
    {
      position: 'relative',
      display: 'flex',
      width: '100%',
    },
    className,
  ],
  headerBackground: {
    display: 'block',
    width: '100%',
    height: 'intrinsic',
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    padding: '1.15% 1.6% 1.77%',
  },
  burgerBtn: {
    width: '10.93%',
  },
  ribbon: {
    position: 'relative',
    width: '64.71%',
  },
  jackpot: {
    position: 'absolute',
    left: '50%',
    top: '100%',
    width: '29.95%',
    transform: 'translate(-50%, -22%)',
  },
  lobbyBtn: [
    {
      width: '10.93%',
    },
    isHomeButtonHidden && ({
      visibility: 'hidden',
    }),
  ],
  fortuneWheelPointer: [
    {
      position: 'absolute',
      left: '50%',
      top: '100%',
      width: '5rem',
      zIndex: 1,
      opacity: 0,
      transform: 'translate(-50%, -21%) rotate(-90deg)',
      transformOrigin: '50% 18%',
      transition: `transform ${Time.defaultAnimationTime}s, opacity ${Time.defaultAnimationTime}s`,
    },
    isFortuneWheelPointerVisible && {
      opacity: 1,
      transform: 'translate(-50%, -21%) rotate(0deg)',
    },
    isFortuneWheelPointerHighlighting && {
      animation: `${fortuneWheelPointerKeyframes} 1000ms infinite`,
    },
  ],
});

export const getClassNames = classNamesFunction<IHeaderStyleProps, IHeaderStyles>();
