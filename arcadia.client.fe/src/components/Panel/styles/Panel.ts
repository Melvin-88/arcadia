import { IStyle } from '@uifabric/styling';
import { classNamesFunction } from '@uifabric/utilities';
import { Color, FontFamily, FontSize } from '../../../styles/constants';

export interface IPanelStyleProps {
  className?: string;
}

export interface IPanelStyles {
  panel: IStyle;
}

export const getStyles = ({ className }: IPanelStyleProps): IPanelStyles => ({
  panel: [
    {
      display: 'flex',
      flexDirection: 'column',
      position: 'absolute',
      bottom: 0,
      left: 0,
      zIndex: 1,
      width: '92.86rem',
      height: '100%',
      padding: '4.6rem 5.56rem',
      color: Color.primaryTextColor,
      backgroundColor: Color.panel.backgroundColor,
      fontFamily: FontFamily.secondary,
      fontSize: FontSize.Size4,
      letterSpacing: '-0.15rem',
      overflow: 'auto',
    },
    className,
  ],
});

export const getClassNames = classNamesFunction<IPanelStyleProps, IPanelStyles>();
