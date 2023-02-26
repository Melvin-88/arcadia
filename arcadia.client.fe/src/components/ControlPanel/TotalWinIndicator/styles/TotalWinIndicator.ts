import { IStyle } from '@uifabric/styling';
import { classNamesFunction } from '@uifabric/utilities';
import { Color } from '../../../../styles/constants';
import { forceMinAspectRatio } from '../../../../styles/helpers';

export interface ITotalWinIndicatorStyleProps {
  className?: string;
}

export interface ITotalWinIndicatorStyles {
  root: IStyle;
  totalWinIndicatorBackground: IStyle;
  totalWinIndicatorContent: IStyle;
}

export const getStyles = ({ className }: ITotalWinIndicatorStyleProps): ITotalWinIndicatorStyles => ({
  root: [
    forceMinAspectRatio(448, 121),
    {
      position: 'relative',
      width: '100%',
    },
    className,
  ],
  totalWinIndicatorBackground: {
    display: 'block',
    width: '100%',
  },
  totalWinIndicatorContent: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: '10%',
    bottom: '15.93%',
    width: '80%',
    height: '42.6%',
    textAlign: 'center',
    color: Color.totalWinIndicator.valueColor,
    textShadow: `0.36rem 0.71rem 1.07rem ${Color.totalWinIndicator.valueStrokeColor}`,
  },
});

export const getClassNames = classNamesFunction<ITotalWinIndicatorStyleProps, ITotalWinIndicatorStyles>();
