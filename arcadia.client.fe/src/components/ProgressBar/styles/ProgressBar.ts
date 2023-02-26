import { IStyle } from '@uifabric/styling';
import { classNamesFunction } from '@uifabric/utilities';
import { Color, Time } from '../../../styles/constants';

export interface IProgressBarStyleProps {
  total: number;
  current: number;
}

export interface IProgressBarStyles {
  root: IStyle;
  bar: IStyle;
}

export const getStyles = ({ total, current }: IProgressBarStyleProps): IProgressBarStyles => ({
  root: {
    position: 'relative',
    display: 'block',
    width: '100%',
    height: '7rem',
    overflow: 'hidden',
    borderRadius: '3.5rem',
    border: `0.2rem solid ${Color.progressBar.mainColor}`,
  },
  bar: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    width: `${(current * 100) / total}%`,
    transition: `${Time.defaultAnimationTime}s width linear`,
    background: Color.progressBar.mainColor,
  },
});

export const getClassNames = classNamesFunction<IProgressBarStyleProps, IProgressBarStyles>();
