import { IStyle } from '@uifabric/styling';
import { classNamesFunction } from '@uifabric/utilities';

export interface IGroupsStyleProps {
  className?: string;
}

export interface IGroupsStyles {
  root: IStyle;
}

export const getStyles = ({ className }: IGroupsStyleProps): IGroupsStyles => ({
  root: [
    {
      display: 'grid',
      width: '100%',
      gridTemplateColumns: '1fr 1fr',
      gridGap: '6.3rem 5rem',
      padding: '10rem',
      justifyItems: 'center',
    },
    className,
  ],
});

export const getClassNames = classNamesFunction<IGroupsStyleProps, IGroupsStyles>();
