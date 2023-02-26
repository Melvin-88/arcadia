import { IStyle } from '@uifabric/styling';
import { classNamesFunction } from '@uifabric/utilities';

export interface ICarouselStyleProps {
}

export interface ICarouselStyles {
  progressContainer: IStyle;
}

export const getStyles = (): ICarouselStyles => ({
  progressContainer: {
    position: 'absolute',
    left: '23%',
    bottom: '8.5rem',
    width: '54%',
  },
});

export const getClassNames = classNamesFunction<ICarouselStyleProps, ICarouselStyles>();
