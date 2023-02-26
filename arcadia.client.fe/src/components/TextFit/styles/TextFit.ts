import { IStyle } from '@uifabric/styling';
import { classNamesFunction } from '@uifabric/utilities';

export interface ITextFitStyleProps {
  className?: string;
}

export interface ITextFitStyles {
  root: IStyle;
}

export const getStyles = ({ className }: ITextFitStyleProps): ITextFitStyles => ({
  root: [
    {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
    },
    className,
  ],
});

export const getClassNames = classNamesFunction<ITextFitStyleProps, ITextFitStyles>();
