import { IStyle } from '@uifabric/styling';
import { classNamesFunction } from '@uifabric/utilities';
import { Color, FontSize } from '../../../../styles/constants';
import { hexToRGBA } from '../../../../styles/helpers';

export interface ILoadingOverlayStyleProps {
  className?: string;
}

export interface ILoadingOverlayStyles {
  spinnerContainer: IStyle;
  message: IStyle;
  overlay: IStyle;
  overlayContent: IStyle;
}

export const getStyles = ({ className }: ILoadingOverlayStyleProps): ILoadingOverlayStyles => ({
  spinnerContainer: {
    padding: '3.57rem',
    borderRadius: '50%',
    backgroundColor: Color.loadingOverlay.spinnerBackgroundColor,
  },
  message: {
    textAlign: 'center',
    marginTop: '6.86rem',
    color: Color.primaryTextColor,
    fontSize: FontSize.Size7,
    fontWeight: '600',
    letterSpacing: '-0.13rem',
    textTransform: 'uppercase',
    textShadow: `0 0.71rem 1.43rem ${hexToRGBA(Color.black, 0.91)}`,
    whiteSpace: 'pre-line',
  },
  overlay: className,
  overlayContent: {
    paddingBottom: '18rem',
  },

});

export const getClassNames = classNamesFunction<ILoadingOverlayStyleProps, ILoadingOverlayStyles>();
