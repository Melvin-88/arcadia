import { IStyle, keyframes } from '@uifabric/styling';
import { classNamesFunction } from '@uifabric/utilities';

export interface IStarSpinnerStyleProps {
  className?: string;
  circlesSize?: number;
}

export interface IStarSpinnerStyles {
  root: IStyle;
  star: IStyle;
  circles: IStyle;
}

const starAnimation = keyframes({
  '0%': {
    transform: 'scale(0) rotate(0deg)',
  },
  '100%': {
    transform: 'scale(0.7) rotate(360deg)',
  },
});

const circlesAnimation = keyframes({
  '0%': {
    boxShadow: '0 0 0 #18ffff',
    opacity: 1,
    transform: 'rotate(0deg)',
  },
  '50%': {
    boxShadow: '24px -22px #18ffff, 30px -15px 0 -3px #18ffff, 31px 0px #18ffff, 29px 9px 0 -3px #18ffff, 24px 23px #18ffff,'
      + ' 17px 30px 0 -3px #18ffff, 0px 33px #18ffff, -10px 28px 0 -3px #18ffff, -24px 22px #18ffff, -29px 14px 0 -3px #18ffff, '
      + '-31px -3px #18ffff, -30px -11px 0 -3px #18ffff, -20px -25px #18ffff, -12px -30px 0 -3px #18ffff, 5px -29px #18ffff, 13px -25px 0 '
      + '-3px #18ffff',
    transform: 'rotate(180deg)',
  },
  '100%': {
    opacity: 0,
    transform: 'rotate(360deg)',
    boxShadow: '25px -22px #18ffff, 15px -22px 0 -3px black, 31px 2px #18ffff, 21px 2px 0 -3px black, 23px 25px #18ffff, '
      + '13px 25px 0 -3px black, 0px 33px #18ffff, -10px 33px 0 -3px black, -26px 24px #18ffff, -19px 17px 0 -3px black, -32px'
      + ' 0px #18ffff, -23px 0px 0 '
      + '-3px black, -25px -23px #18ffff, -16px -23px 0 -3px black, 0px -31px #18ffff, -2px -23px 0 -3px black',
  },
});

export const getStyles = ({ className, circlesSize = 8 }: IStarSpinnerStyleProps): IStarSpinnerStyles => ({
  root: [
    {
      position: 'relative',
      width: 60,
      height: 60,
      borderRadius: '50%',
      display: 'block',
    },
    className,
  ],
  star: {
    width: '100%',
    height: '100%',
    fill: '#cf28f0',
    transform: 'scale(0.7)',
    animation: `${starAnimation} 1s ease alternate infinite`,
  },
  circles: {
    width: circlesSize,
    height: circlesSize,
    background: '#cf28f0',
    borderRadius: '50%',
    position: 'absolute',
    left: `calc(50% - ${circlesSize / 2}px)`,
    top: `calc(50% - ${circlesSize / 2}px)`,
    animation: `${circlesAnimation} 1s ease-in-out alternate infinite`,
  },
});

export const getClassNames = classNamesFunction<IStarSpinnerStyleProps, IStarSpinnerStyles>();
