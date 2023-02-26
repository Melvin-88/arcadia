import { IStyle } from '@uifabric/styling';
import { classNamesFunction } from '@uifabric/utilities';

export interface IStopButtonStyleProps {
}

export interface IStopButtonStyles {
  badge: IStyle;
}

export const getStyles = (): IStopButtonStyles => ({
  badge: {
    position: 'absolute',
    top: '72.12%',
    left: '25.81%',
    width: '47.55%',
  },
});

export const getClassNames = classNamesFunction<IStopButtonStyleProps, IStopButtonStyles>();
