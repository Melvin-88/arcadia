import { IStyle, keyframes } from '@uifabric/styling';
import { classNamesFunction } from '@uifabric/utilities';

export interface ILiveStreamBadgeStyleProps {
  className?: string;
}

export interface ILiveStreamBadgeStyles {
  root: IStyle;
  path2: IStyle;
  path3: IStyle;
  path4: IStyle;
}

const bounceKeyFrames = keyframes({
  '0%': {
    opacity: 0,
  },
  '40%': {
    opacity: 0.7,
  },
  '70%': {
    opacity: 1,
  },
  '100%': {
    opacity: 1,
  },
});

export const getStyles = ({ className }: ILiveStreamBadgeStyleProps): ILiveStreamBadgeStyles => ({
  root: [
    {
      display: 'block',
      width: '100%',
    },
    className,
  ],
  path2: {
    fill: '#010101',
  },
  path3: {
    fill: '#fff',
  },
  path4: {
    fill: '#e73445',
    animation: `${bounceKeyFrames} 1000ms ease-in infinite alternate`,
  },
});

export const getClassNames = classNamesFunction<ILiveStreamBadgeStyleProps, ILiveStreamBadgeStyles>();
