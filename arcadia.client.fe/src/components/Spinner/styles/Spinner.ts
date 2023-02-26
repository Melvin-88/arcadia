import { IStyle, keyframes } from '@uifabric/styling';
import { classNamesFunction } from '@uifabric/utilities';
import { Color, Time } from '../../../styles/constants';

export interface ISpinnerStyleProps {
}

export interface ISpinnerStyles {
  spinner: IStyle;
  spinnerItem: IStyle;
}

const bounceKeyFrame = keyframes({
  '0%': {
    opacity: 0.05,
  },
  '40%': {
    opacity: 1,
  },
  '100%': {
    opacity: 0.05,
  },
});

export const getStyles = (): ISpinnerStyles => ({
  spinner: {
    width: '48px',
    borderRadius: '50%',
    color: Color.primaryTextColor,
  },
  spinnerItem: {
    fill: 'currentColor',
    animation: `${bounceKeyFrame} ${Time.spinnerAnimationTime}s infinite`,
    selectors: {
      ':nth-child(1)': {
        animationDelay: `-${Time.spinnerAnimationTime * 0.4}s`,
      },
      ':nth-child(2)': {
        animationDelay: `-${Time.spinnerAnimationTime * 0.35}s`,
      },
      ':nth-child(3)': {
        animationDelay: `-${Time.spinnerAnimationTime * 0.30}s`,
      },
      ':nth-child(4)': {
        animationDelay: `-${Time.spinnerAnimationTime * 0.25}s`,
      },
      ':nth-child(5)': {
        animationDelay: `-${Time.spinnerAnimationTime * 0.20}s`,
      },
      ':nth-child(6)': {
        animationDelay: `-${Time.spinnerAnimationTime * 0.15}s`,
      },
      ':nth-child(7)': {
        animationDelay: `-${Time.spinnerAnimationTime * 0.10}s`,
      },
      ':nth-child(8)': {
        animationDelay: `-${Time.spinnerAnimationTime * 0.05}s`,
      },
    },
  },
});

export const getClassNames = classNamesFunction<ISpinnerStyleProps, ISpinnerStyles>();
