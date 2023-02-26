import { IStyle } from '@uifabric/styling';
import { classNamesFunction } from '@uifabric/utilities';
import { Color, FontFamily } from '../../../styles/constants';

export interface IBetBehindRoundProgressIndicatorStyleProps {
}

export interface IBetBehindRoundProgressIndicatorStyles {
  betBehindImg: IStyle;
  amount: IStyle;
  progressIndicatorContent: IStyle;
}

export const getStyles = (): IBetBehindRoundProgressIndicatorStyles => ({
  betBehindImg: {
    display: 'block',
    width: '55%',
    margin: '0 auto 0.1rem',
  },
  amount: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    width: '100%',
    height: '5.7rem',
    marginTop: '0.9rem',
    fontFamily: FontFamily.tertiary,
    color: Color.betBehindRoundProgressIndicator.roundColor,
    '-webkit-text-stroke': `0.03em ${Color.betBehindRoundProgressIndicator.strokeColor}`,
  },
  progressIndicatorContent: {
    padding: '20%',
  },
});

export const getClassNames = classNamesFunction<IBetBehindRoundProgressIndicatorStyleProps, IBetBehindRoundProgressIndicatorStyles>();
