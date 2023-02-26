import { IStyle } from '@uifabric/styling';
import { classNamesFunction } from '@uifabric/utilities';

export interface IScatterRoundOverlayStyleProps {
}

export interface IScatterRoundOverlayStyles {
  content: IStyle;
  animation: IStyle;
}

export const getStyles = (): IScatterRoundOverlayStyles => ({
  content: {
    width: '100%',
    height: '100%',
    padding: 0,
  },
  animation: {
    width: '100%',
    height: '100%',
  },
});

export const getClassNames = classNamesFunction<IScatterRoundOverlayStyleProps, IScatterRoundOverlayStyles>();
