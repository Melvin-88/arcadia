import { IStyle } from '@uifabric/styling';
import { classNamesFunction } from '@uifabric/utilities';

export interface IExitStyleProps {
}

export interface IExitStyles {
  title: IStyle;

}

export const getStyles = (): IExitStyles => ({
  title: {
    fontSize: '11.4rem',
  },
});

export const getClassNames = classNamesFunction<IExitStyleProps, IExitStyles>();
