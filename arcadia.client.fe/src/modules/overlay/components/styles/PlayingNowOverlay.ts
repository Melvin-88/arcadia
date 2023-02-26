import { IStyle } from '@uifabric/styling';
import { classNamesFunction } from '@uifabric/utilities';

export interface IPlayingNowOverlayStyleProps {
}

export interface IPlayingNowOverlayStyles {
  letters: IStyle;
}

export const getStyles = (): IPlayingNowOverlayStyles => ({
  letters: {
    width: '62%',
  },
});

export const getClassNames = classNamesFunction<IPlayingNowOverlayStyleProps, IPlayingNowOverlayStyles>();
