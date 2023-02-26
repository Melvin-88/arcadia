import { IStyle } from '@uifabric/styling';
import { classNamesFunction } from '@uifabric/utilities';
import { Color, FontFamily } from '../../../styles/constants';

export interface ICardStyleProps {
  className?: string;
}

export interface ICardStyles {
  root: IStyle;
}

export const getStyles = ({ className } : ICardStyleProps): ICardStyles => ({
  root: [
    {
      backgroundColor: Color.card.defaultBackgroundColor,
      padding: '1rem 0 3rem',
      borderRadius: '6rem',
      position: 'relative',
      fontFamily: FontFamily.secondary,
      fontSize: '4rem',
      textAlign: 'center',
      boxShadow: 'darkblue 0px 0.4rem 0.6rem 0rem, inset 0 .6rem .3rem 0 darkblue',
      border: `1.5rem solid ${Color.card.borderColor}`,
    },
    className,
  ],
});

export const getClassNames = classNamesFunction<ICardStyleProps, ICardStyles>();
