import { IStyle } from '@uifabric/styling';
import { classNamesFunction } from '@uifabric/utilities';

export interface IVolumeSliderStyleProps {
  className?: string;
}

export interface IVolumeSliderStyles {
  root: IStyle;
  volumeIcon: IStyle;
  slider: IStyle;
}

export const getStyles = ({ className }:IVolumeSliderStyleProps): IVolumeSliderStyles => ({
  root: [
    {
      display: 'flex',
      alignItems: 'center',
    },
    className,
  ],
  volumeIcon: {
    flexShrink: 0,
    width: '6.6rem',
    marginRight: '2rem',
  },
  slider: {
    flexGrow: 1,
  },
});

export const getClassNames = classNamesFunction<IVolumeSliderStyleProps, IVolumeSliderStyles>();
