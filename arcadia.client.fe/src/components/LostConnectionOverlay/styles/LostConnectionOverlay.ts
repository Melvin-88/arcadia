import { IStyle } from '@uifabric/styling';
import { classNamesFunction } from '@uifabric/utilities';

export interface ILostConnectionOverlayStyleProps {
}

export interface ILostConnectionOverlayStyles {
  title: IStyle;
}

export const getStyles = (): ILostConnectionOverlayStyles => ({
  title: {
    textAlign: 'center',
    fontSize: '11.4rem',
  },
});

export const getClassNames = classNamesFunction<ILostConnectionOverlayStyleProps, ILostConnectionOverlayStyles>();
