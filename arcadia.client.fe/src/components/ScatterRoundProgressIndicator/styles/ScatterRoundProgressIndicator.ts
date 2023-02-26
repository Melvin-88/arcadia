import { IStyle } from '@uifabric/styling';
import { classNamesFunction } from '@uifabric/utilities';

export interface IScatterRoundProgressIndicatorStyleProps {
}

export interface IScatterRoundProgressIndicatorStyles {
  scatterImg: IStyle;
  progressIndicatorContent: IStyle;
}

export const getStyles = (): IScatterRoundProgressIndicatorStyles => ({
  scatterImg: {
    display: 'block',
    width: '100%',
  },
  progressIndicatorContent: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '4.7rem 4.7rem 6.7rem',
  },
});

export const getClassNames = classNamesFunction<IScatterRoundProgressIndicatorStyleProps, IScatterRoundProgressIndicatorStyles>();
