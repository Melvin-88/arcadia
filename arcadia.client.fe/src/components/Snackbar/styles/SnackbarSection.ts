import { IStyle } from '@uifabric/styling';
import { classNamesFunction } from '@uifabric/utilities';
import { Color } from '../../../styles/constants';

export interface ISnackbarSectionStyleProps {
  className?: string;
}

export interface ISnackbarSectionStyles {
  root: IStyle;
}

export const getStyles = ({ className }: ISnackbarSectionStyleProps): ISnackbarSectionStyles => ({
  root: [
    {
      width: '100%',
      padding: '2.5rem 4.6rem',
      borderTop: `0.36rem solid ${Color.snackbar.sectionBorderColor}`,
    },
    className,
  ],
});

export const getClassNames = classNamesFunction<ISnackbarSectionStyleProps, ISnackbarSectionStyles>();
