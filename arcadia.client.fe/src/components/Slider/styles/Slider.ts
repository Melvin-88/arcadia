import { IStyle } from '@uifabric/styling';
import { classNamesFunction } from '@uifabric/utilities';
import { Color } from '../../../styles/constants';
import { hexToRGBA } from '../../../styles/helpers';

export interface ISliderStyleProps {
  className?: string;
}

export interface ISliderStyles {
  root: IStyle;
  track: IStyle;
  thumb: IStyle;
}

export const getStyles = ({ className }: ISliderStyleProps): ISliderStyles => ({
  root: [
    {
      display: 'flex',
      alignItems: 'center',
      width: '100%',
    },
    className,
  ],
  track: {
    height: '1.54rem',
    borderRadius: '1.07rem',
    backgroundColor: Color.white,
    cursor: 'pointer',
  },
  thumb: {
    width: '6.07rem',
    height: '6.07rem',
    borderRadius: '50%',
    backgroundImage: `linear-gradient(135deg, ${Color.sliderThumb.thumbBackgroundGradientStartColor} 0%,
     ${Color.sliderThumb.thumbBackgroundGradientEndColor} 100%)`,
    boxShadow: `0 0.71rem 1.43rem ${hexToRGBA(Color.black, 0.5)}`,
    cursor: 'pointer',
  },
});

export const getClassNames = classNamesFunction<ISliderStyleProps, ISliderStyles>();
