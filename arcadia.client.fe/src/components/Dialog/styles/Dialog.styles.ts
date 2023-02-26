import { IStyle } from '@uifabric/styling';
import { classNamesFunction } from '@uifabric/utilities';
import { Color, FontFamily, FontSize } from '../../../styles/constants';

export interface IDialogStyleProps {
  classNameCard?: string;
  classNameContainer?: string;
}

export interface IDialogStyles {
  overlay: IStyle;
  card: IStyle;
  dialogImg: IStyle;
  container: IStyle;
  title: IStyle;
  headerBtn: IStyle;
}

export const getStyles = ({ classNameCard, classNameContainer }: IDialogStyleProps): IDialogStyles => ({
  overlay: {
    position: 'absolute',
  },
  card: [
    {
      position: 'relative',
      maxWidth: '100%',
      textAlign: 'center',
      maxHeight: '96vh',
      overflowY: 'auto',
    },
    classNameCard,
  ],
  dialogImg: {
    display: 'block',
    width: '100%',
  },
  container: [
    {
      position: 'relative',
      left: 0,
      top: 0,
      zIndex: 1,
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: '100%',
      padding: '4rem 5rem',
    },
    classNameContainer,
  ],
  headerBtn: {
    position: 'absolute',
    top: '3.45rem',
    right: '3.45rem',
    width: '6.3rem',
    zIndex: 1,
  },
  title: {
    fontFamily: FontFamily.secondary,
    fontSize: FontSize.Size5,
    fontWeight: 900,
    color: Color.white,
    textShadow: '0 2px 1px #0a0a36',
    letterSpacing: '-0.14rem',
    textTransform: 'uppercase',
    padding: '0 7rem',
  },
});

export const getClassNames = classNamesFunction<IDialogStyleProps, IDialogStyles>();
