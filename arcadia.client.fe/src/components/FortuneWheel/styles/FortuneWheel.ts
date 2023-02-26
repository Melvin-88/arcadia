import { IStyle } from '@uifabric/styling';
import { classNamesFunction } from '@uifabric/utilities';

export interface IFortuneWheelStyleProps {
  className?: string;
}

export interface IFortuneWheelStyles {
  root: IStyle;
  container: IStyle;
  wheel: IStyle;
  wheelImg: IStyle;
  canvas: IStyle;
}

export const getStyles = ({ className }: IFortuneWheelStyleProps): IFortuneWheelStyles => ({
  root: [
    {
      width: '100%',
    },
    className,
  ],
  container: {
    boxShadow: '0 0.3rem 3rem 0.1rem',
    borderRadius: '50%',
    overflow: 'hidden',
  },
  wheel: {
    position: 'relative',
    display: 'block',
    width: '100%',
  },
  wheelImg: {
    display: 'block',
    width: '100%',
  },
  canvas: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    opacity: 0,
  },
});

export const getClassNames = classNamesFunction<IFortuneWheelStyleProps, IFortuneWheelStyles>();
