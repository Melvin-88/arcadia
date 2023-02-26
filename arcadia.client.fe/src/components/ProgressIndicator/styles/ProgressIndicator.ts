import { IStyle } from '@uifabric/styling';
import { classNamesFunction } from '@uifabric/utilities';
import { Color, Time } from '../../../styles/constants';

export interface IProgressIndicatorStyleProps {
  className?: string;
  classNameContent?: string;
  circleColor?: string;
  progress?: number;
}

export interface IProgressIndicatorStyles {
  root: IStyle;
  progressIndicatorBackground: IStyle;
  progressCircle: IStyle;
  progressCirclePath: IStyle;
  content: IStyle;
}

export const getStyles = ({
  className,
  classNameContent,
  circleColor = Color.white, progress = 0,
}: IProgressIndicatorStyleProps): IProgressIndicatorStyles => ({
  root: [
    {
      position: 'relative',
      display: 'block',
      width: '100%',
      textAlign: 'center',
    },
    className,
  ],
  progressIndicatorBackground: {
    width: '100%',
    height: '100%',
  },
  progressCircle: [
    {
      position: 'absolute',
      top: '0%',
      left: '0%',
      width: '100%',
      fill: 'none',
      strokeWidth: 5,
      stroke: circleColor,
      opacity: 1,
      strokeLinecap: 'round',
      transform: 'rotate(-90deg) scaleX(-1)',
      transition: `opacity ${Time.defaultAnimationTime}s`,
    },
    progress === 0 && {
      opacity: 0,
    },
  ],
  progressCirclePath: {
    transition: 'stroke-dasharray 500ms',
  },
  content: [
    {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      padding: '25% 25% 15%',
      paddingBottom: '19%', // TODO: Make only for the RoundProgressIndicator
    },
    classNameContent,
  ],
});

export const getClassNames = classNamesFunction<IProgressIndicatorStyleProps, IProgressIndicatorStyles>();
