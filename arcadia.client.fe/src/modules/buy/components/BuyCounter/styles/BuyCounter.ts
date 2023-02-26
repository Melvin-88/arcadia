import { IStyle } from '@uifabric/styling';
import { classNamesFunction } from '@uifabric/utilities';
import { Color, FontSize } from '../../../../../styles/constants';

export interface IBuyCounterStyleProps {
}

export interface IBuyCounterStyles {
  value: IStyle;
  factor: IStyle;
  iconValue: IStyle;
}

export const getStyles = (): IBuyCounterStyles => ({
  value: {
    display: 'flex',
    alignItems: 'center',
    color: Color.primaryTextColor,
    fontSize: FontSize.Size3,
    fontWeight: 500,
    letterSpacing: '-0.19rem',
  },
  factor: {
    margin: '1.5rem 0.8rem 0.71rem 1.71rem',
    fontSize: FontSize.Size12,
    fontWeight: 300,
  },
  iconValue: {
    width: '8.9rem',
  },
});

export const getClassNames = classNamesFunction<IBuyCounterStyleProps, IBuyCounterStyles>();
