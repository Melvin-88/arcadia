import { IStyle } from '@uifabric/styling';
import { classNamesFunction } from '@uifabric/utilities';
import { Color, FontFamily } from '../../../../../styles/constants';
import switchBar from '../../../../../assets/images/jackpot/switchBar.png';
import switchOffBackground from '../../../../../assets/images/jackpot/switchOffBackground.png';
import switchOnBackground from '../../../../../assets/images/jackpot/switchOnBackground.png';
import { forceMinAspectRatio } from '../../../../../styles/helpers';

export interface IJackpotIndicatorStyleProps {
  className?: string;
  isActive: boolean;
  isOptInEnabled: boolean;
}

export interface IJackpotIndicatorStyles {
  root: IStyle;
  jackpotIndicatorBackground: IStyle;
  jackpotAmount: IStyle;
  switchContainer: IStyle;
  switchTitle: IStyle;
  switch: IStyle;
}

const getTextColor = (isOptInEnabled: boolean) => (
  isOptInEnabled ? Color.jackpotIndicator.valueColor : Color.jackpotIndicator.valueDisabledColor
);

export const getStyles = ({ className, isActive, isOptInEnabled } : IJackpotIndicatorStyleProps): IJackpotIndicatorStyles => ({
  root: [
    forceMinAspectRatio(337, 153),
    {
      position: 'relative',
      width: '100%',
    },
    !isActive && {
      filter: 'greyscale(1)',
      pointerEvents: 'none',
    },
    className,
  ],
  jackpotIndicatorBackground: {
    display: 'block',
    width: '100%',
  },
  jackpotAmount: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: '13%',
    top: '28%',
    width: '74%',
    height: '28%',
    textAlign: 'center',
    fontFamily: FontFamily.secondary,
    color: getTextColor(isOptInEnabled),
    '-webkit-text-stroke': `0.05em ${Color.jackpotIndicator.valueStrokeColor}`,
    'background-image': 'linear-gradient(to top, rgba(255, 240, 0, 0.5) 0%, rgba(255, 255, 255, 0.5) 49%, rgba(255, 240, 0, 0.5) 100%)',
    '-webkit-background-clip': 'text',
    'background-clip': 'text',
  },
  switchContainer: {
    position: 'absolute',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '18rem',
    height: '2.8rem',
    left: '50%',
    bottom: '1.2rem',
    transform: 'translateX(-50%)',
  },
  switchTitle: {
    fontFamily: FontFamily.secondary,
    flexGrow: '1',
    maxHeight: '85%',
    letterSpacing: '-0.15rem',
    color: getTextColor(isOptInEnabled),
    '-webkit-text-stroke': `0.07em ${Color.jackpotIndicator.valueStrokeColor}`,
    'background-image': 'linear-gradient(to top, rgba(255, 240, 0, 0.5) 0%, rgba(255, 255, 255, 0.5) 49%, rgba(255, 240, 0, 0.5) 100%)',
    '-webkit-background-clip': 'text',
    'background-clip': 'text',
    textTransform: 'uppercase',
  },
  switch: [
    {
      width: '6.8rem',
      height: '2.8rem',
      flexShrink: '0',
      background: `url(${switchOffBackground}) no-repeat 50% 50% / contain`,
      border: 'none',
      selectors: {
        ':after': {
          width: '2.4rem',
          height: '2.4rem',
          background: `url(${switchBar}) no-repeat 50% 50% / contain`,
          top: '.3rem',
          left: '.2rem',
        },
      },
    },
    isOptInEnabled && {
      background: `url(${switchOnBackground}) no-repeat 50% 50% / contain`,
      selectors: {
        ':after': {
          background: `url(${switchBar}) no-repeat 50% 50% / contain`,
          transform: 'translateX(4rem)',
        },
      },
    },
  ],
});

export const getClassNames = classNamesFunction<IJackpotIndicatorStyleProps, IJackpotIndicatorStyles>();
