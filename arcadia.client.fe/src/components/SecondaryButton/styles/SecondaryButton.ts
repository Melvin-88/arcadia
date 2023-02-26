import { IStyle } from '@uifabric/styling';
import { classNamesFunction } from '@uifabric/utilities';
import { forceMinAspectRatio } from '../../../styles/helpers';

export interface ISecondaryButtonStyleProps {
  className?: string;
}

export interface ISecondaryButtonStyles {
  root: IStyle;
}

export const getStyles = ({ className }: ISecondaryButtonStyleProps): ISecondaryButtonStyles => ({
  root: [
    forceMinAspectRatio(202, 66),
    className,
  ],
});

export const getClassNames = classNamesFunction<ISecondaryButtonStyleProps, ISecondaryButtonStyles>();
