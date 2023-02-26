import { IStyle } from '@uifabric/styling';
import { classNamesFunction } from '@uifabric/utilities';

export interface IChipStyleProps {
  className?: string;
}

export interface IChipStyles {
  chip: IStyle;
}

export const getStyles = ({ className }: IChipStyleProps): IChipStyles => ({
  chip: [
    {
      display: 'block',
      width: '100%',
    },
    className,
  ],
});

export const getClassNames = classNamesFunction<IChipStyleProps, IChipStyles>();
