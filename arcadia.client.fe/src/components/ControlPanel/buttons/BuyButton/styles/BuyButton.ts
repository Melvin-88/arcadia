import { IStyle } from '@uifabric/styling';
import { classNamesFunction } from '@uifabric/utilities';

export interface IBuyButtonStyleProps {
  isPressed?: boolean;
}

export interface IBuyButtonStyles {
  animation: IStyle;
}

export const getStyles = ({ isPressed }: IBuyButtonStyleProps): IBuyButtonStyles => ({
  animation: [
    {
      position: 'absolute',
      left: '50%',
      top: '0',
      width: '140%',
      height: '140%',
      transform: 'translate(-53%, -26.5%)',
      opacity: 1,
      visibility: 'visible',
      transition: 'opacity 600ms , visibility 600ms, transform 75ms',
    },
    isPressed && {
      opacity: 0,
      visibility: 'hidden',
      transform: 'translate(-53%, -22.5%)',
    },
  ],
});

export const getClassNames = classNamesFunction<IBuyButtonStyleProps, IBuyButtonStyles>();
