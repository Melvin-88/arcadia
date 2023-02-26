import { IStyle } from '@uifabric/styling';
import { classNamesFunction } from '@uifabric/utilities';
import { Color, FontFamily } from '../../../styles/constants';

export interface IChipWinStyleProps {
  className?: string;
}

export interface IChipWinStyles {
  root: IStyle;
  chipItem: IStyle;
  chipNotIdentifiedIcon: IStyle;
  chipLoader: IStyle;
  container: IStyle;
  winLabel: IStyle;
  value: IStyle;
  identifyingLabel: IStyle;
}

export const getStyles = ({ className }: IChipWinStyleProps): IChipWinStyles => ({
  root: [
    {
      display: 'flex',
      alignItems: 'center',
      width: '36.9rem',
      padding: '1.38rem 3.54rem 1.38rem 1.56rem',
      color: Color.chipWin.color,
      backgroundColor: Color.chipWin.backgroundColor,
      border: `0.9rem solid ${Color.chipWin.borderColor}`,
      borderRadius: '5.4rem',
      fontFamily: FontFamily.secondary,
      textTransform: 'uppercase',
    },
    className,
  ],
  chipItem: {
    position: 'relative',
    width: '30%',
    flexShrink: 0,
  },
  chipNotIdentifiedIcon: {
    display: 'block',
    width: '100%',
  },
  chipLoader: {
    position: 'absolute',
    top: '20%',
    left: '12%',
    width: '60%',
    fill: Color.chipWin.loaderColor,
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  winLabel: {
    height: '3rem',
  },
  value: {
    height: '3.4rem',
  },
  identifyingLabel: {
    height: '3.2rem',
    marginLeft: '1.5rem',
    letterSpacing: '-0.09rem',
  },
});

export const getClassNames = classNamesFunction<IChipWinStyleProps, IChipWinStyles>();
