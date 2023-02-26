import { IStyle } from '@uifabric/styling';
import { classNamesFunction } from '@uifabric/utilities';
import { Color, FontFamily, FontSize } from '../../../styles/constants';

export interface IRoundsCounterStyleProps {
}

export interface IRoundsCounterStyles {
  title: IStyle;
  value: IStyle;
  counterValue: IStyle;
}

export const getStyles = (): IRoundsCounterStyles => ({
  title: {
    color: Color.counter.titleTextColor,
    fontFamily: FontFamily.secondary,
    fontSize: FontSize.Size9,
    fontWeight: 700,
    letterSpacing: '-0.08rem',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  value: {
    marginTop: '1.8rem',
    color: Color.primaryTextColor,
    fontFamily: FontFamily.tertiary,
    fontSize: FontSize.Size3,
    fontWeight: 500,
    letterSpacing: '-0.19rem',
  },
  counterValue: {
    alignSelf: 'flex-start',
    marginTop: '-1.3rem',
  },
});

export const getClassNames = classNamesFunction<IRoundsCounterStyleProps, IRoundsCounterStyles>();
