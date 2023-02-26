import { IStyle } from '@uifabric/styling';
import { classNamesFunction } from '@uifabric/utilities';
import { Color, FontFamily, FontSize } from '../../../styles/constants';

export interface ISnackbarStyleProps {
  className?: string;
  classNameHeader?: string;
}

export interface ISnackbarStyles {
  root: IStyle;
  header: IStyle;
  closeBtn: IStyle;
}

export const getStyles = ({ className, classNameHeader }: ISnackbarStyleProps): ISnackbarStyles => ({
  root: [
    {
      display: 'flex',
      flexDirection: 'column',
      position: 'absolute',
      left: 0,
      bottom: 0,
      width: '100%',
      padding: '0 6rem 0.71rem',
      color: Color.primaryTextColor,
      backgroundColor: Color.snackbar.backgroundColor,
      textAlign: 'center',
      fontFamily: FontFamily.secondary,
      fontSize: FontSize.Size7,
      fontWeight: '600',
      letterSpacing: '-0.13rem',
      textTransform: 'uppercase',
      borderRadius: '5rem 5rem 0 0',
    },
    className,
  ],
  header: [
    {
      display: 'flex',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 7.14rem',
      fontSize: FontSize.Size6,
    },
    classNameHeader,
  ],
  closeBtn: {
    position: 'absolute',
    top: '2.55rem',
    right: '2.55rem',
    width: '6.3rem',
  },
});

export const getClassNames = classNamesFunction<ISnackbarStyleProps, ISnackbarStyles>();
