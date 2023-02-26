import { IStyle } from '@uifabric/styling';
import { classNamesFunction } from '@uifabric/utilities';
import { FontSize } from '../../../../styles/constants';

export interface IClockStyleProps {
  className?: string;
}

export interface IClockStyles {
  root: IStyle;
  icon: IStyle;
}

export const getStyles = ({ className }: IClockStyleProps): IClockStyles => ({
  root: [
    {
      display: 'flex',
      alignItems: 'center',
      fontSize: FontSize.Size10,
      fontWeight: 700,
    },
    className,
  ],
  icon: {
    display: 'block',
    marginRight: '0.8rem',
    width: '2.4rem',
    fill: 'currentColor',
  },
});

export const getClassNames = classNamesFunction<IClockStyleProps, IClockStyles>();
