import { IStyle } from '@uifabric/styling';
import { classNamesFunction } from '@uifabric/utilities';
import { Color } from '../../../styles/constants';
import { hexToRGBA } from '../../../styles/helpers';

export enum OverlayBackdropColor {
  primary,
  primarySolid,
  secondary,
  transparent
}

export interface IOverlayStyleProps {
  className?: string;
  classNameContent?: string;
  overlayBackdropColor?: OverlayBackdropColor;
}

export interface IOverlayStyles {
  root: IStyle;
  overlayBackdrop: IStyle;
  overlayContent: IStyle;
}

export const getStyles = ({
  className,
  classNameContent,
  overlayBackdropColor = OverlayBackdropColor.primary,
}: IOverlayStyleProps): IOverlayStyles => ({
  root: [
    {
      position: 'absolute',
      bottom: '0',
      left: '0',
      right: '0',
      top: '0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1,
    },
    className,
  ],
  overlayBackdrop: [
    {
      position: 'absolute',
      width: '100%',
      height: '100%',
      background: hexToRGBA(Color.overlay.primaryBackgroundColor, 0.5),
    },
    overlayBackdropColor === OverlayBackdropColor.primarySolid && {
      background: Color.overlay.primaryBackgroundColor,
    },
    overlayBackdropColor === OverlayBackdropColor.secondary && {
      background: hexToRGBA(Color.overlay.secondaryBackgroundColor, 0.5),
    },
    overlayBackdropColor === OverlayBackdropColor.transparent && {
      background: 'none',
    },
  ],
  overlayContent: [
    {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
      textAlign: 'center',
      padding: '3.57rem',
      color: Color.white,
      zIndex: 1,
      maxWidth: '100%',
    },
    classNameContent,
  ],
});

export const getClassNames = classNamesFunction<IOverlayStyleProps, IOverlayStyles>();
