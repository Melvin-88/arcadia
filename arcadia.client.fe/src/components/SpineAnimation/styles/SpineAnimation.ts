import { IStyle } from '@uifabric/styling';
import { classNamesFunction } from '@uifabric/utilities';

export interface ISpineAnimationStyleProps {
  className?: string;
}

export interface ISpineAnimationStyles {
  root: IStyle;
  canvas: IStyle;
}

export const getStyles = ({ className }: ISpineAnimationStyleProps): ISpineAnimationStyles => ({
  root: [
    {
      position: 'relative',
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
    },
    className,
  ],
  canvas: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
  },
});

export const getClassNames = classNamesFunction<ISpineAnimationStyleProps, ISpineAnimationStyles>();
