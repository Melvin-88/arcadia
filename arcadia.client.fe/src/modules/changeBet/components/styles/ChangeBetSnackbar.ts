import { IStyle } from '@uifabric/styling';
import { classNamesFunction } from '@uifabric/utilities';

export interface IChangeBetSnackbarStyleProps {
  groupsLength: number;
}

export interface IChangeBetSnackbarStyles {
  loaderContainer: IStyle;
  snackbar: IStyle;
  groupListSection: IStyle;
  groups:IStyle;
}

export const getStyles = ({ groupsLength }: IChangeBetSnackbarStyleProps): IChangeBetSnackbarStyles => ({
  loaderContainer: {
    position: 'absolute',
  },
  snackbar: {
    padding: 0,
  },
  groupListSection: {
    padding: '2rem 0',
    position: 'relative',
    minHeight: '72rem',
  },
  groups: {
    padding: '2rem 0',
    gridTemplateColumns: `0.1rem repeat(${groupsLength}, 40.8rem) 0.1rem`,
    overflowX: 'auto',
    gap: '4.8rem',
    selectors: {
      ':before, :after': {
        content: '""',
        display: 'block',
        width: '0.1rem',
      },
    },
  },
});

export const getClassNames = classNamesFunction<IChangeBetSnackbarStyleProps, IChangeBetSnackbarStyles>();
