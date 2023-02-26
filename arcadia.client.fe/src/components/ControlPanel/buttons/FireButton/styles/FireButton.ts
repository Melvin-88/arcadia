import { IStyle } from '@uifabric/styling';
import { classNamesFunction } from '@uifabric/utilities';

export interface IFireButtonStyleProps {
}

export interface IFireButtonStyles {
  freeBadge: IStyle;
}

export const getStyles = (): IFireButtonStyles => ({
  freeBadge: {
    position: 'absolute',
    top: '72.12%',
    left: '25.81%',
    width: '47.55%',
  },
});

export const getClassNames = classNamesFunction<IFireButtonStyleProps, IFireButtonStyles>();
