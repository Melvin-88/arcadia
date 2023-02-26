import { IStyle } from '@uifabric/styling';
import { classNamesFunction } from '@uifabric/utilities';

export interface ICollapsibleStyleProps {
  className?: string;
  classNameContent?: string;
  classNameArrow?: string;
  animationDurationInSeconds: number;
}

export interface ICollapsibleStyles {
  root: IStyle;
  content: IStyle;
  collapseButton: IStyle;
  collapseButtonImage: IStyle;
}

export const getStyles = ({
  className, classNameContent, classNameArrow, animationDurationInSeconds,
}: ICollapsibleStyleProps): ICollapsibleStyles => ({
  root: [
    {
      position: 'relative',
    },
    className,
  ],
  content: [
    {
      display: 'block',
      width: '100%',
      transition: `visibility ${animationDurationInSeconds}s`,
    },
    classNameContent,
  ],
  collapseButton: [
    {
      position: 'absolute',
      top: 0,
      left: '50%',
      width: '8rem',
      transform: 'translateX(-50%) translateY(-100%)',
      opacity: 0,
      visibility: 'hidden',
      transition: `visibility ${animationDurationInSeconds}s`,
    },
    classNameArrow,
  ],
  collapseButtonImage: {
    display: 'block',
    width: '100%',
  },
});

export const getClassNames = classNamesFunction<ICollapsibleStyleProps, ICollapsibleStyles>();
