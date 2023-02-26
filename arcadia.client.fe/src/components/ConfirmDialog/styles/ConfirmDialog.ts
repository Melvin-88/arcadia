import { IStyle } from '@uifabric/styling';
import { classNamesFunction } from '@uifabric/utilities';
import { Color } from '../../../styles/constants';

export interface IConfirmDialogStyleProps {
  classNameCard?: string;
}

export interface IConfirmDialogStyles {
  classNameCard: IStyle;
  content: IStyle;
  buttons: IStyle;
  button: IStyle;
}

export const getStyles = ({ classNameCard }: IConfirmDialogStyleProps): IConfirmDialogStyles => ({
  classNameCard: [
    {
      width: '85rem',
    },
    classNameCard,
  ],
  content: {
    margin: '4rem 0',
    color: Color.white,
  },
  buttons: {
    display: 'flex',
    justifyContent: 'center',
  },
  button: {
    margin: '0 1rem',
    color: Color.white,
  },
});

export const getClassNames = classNamesFunction<IConfirmDialogStyleProps, IConfirmDialogStyles>();
