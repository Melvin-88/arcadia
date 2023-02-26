import { IStyle } from '@uifabric/styling';
import { classNamesFunction } from '@uifabric/utilities';
import { forceMinAspectRatio } from '../../../styles/helpers';

export interface IPrimaryButtonStyleProps {
  className?: string;
}

export interface IPrimaryButtonStyles {
  root: IStyle;
}

export const getStyles = ({ className }: IPrimaryButtonStyleProps): IPrimaryButtonStyles => ({
  root: [
    forceMinAspectRatio(202, 66),
    className,
  ],
});

export const getClassNames = classNamesFunction<IPrimaryButtonStyleProps, IPrimaryButtonStyles>();
