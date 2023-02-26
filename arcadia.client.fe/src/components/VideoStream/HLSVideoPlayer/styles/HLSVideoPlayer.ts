import { IStyle } from '@uifabric/styling';
import { classNamesFunction } from '@uifabric/utilities';

export interface IHLSVideoPlayerStyleProps {
  className?: string;
}

export interface IHLSVideoPlayerStyles {
  hlsVideoPlayerContainer: IStyle;
  hlsVideoPlayer: IStyle;
}

export const getStyles = ({ className }: IHLSVideoPlayerStyleProps): IHLSVideoPlayerStyles => ({
  hlsVideoPlayerContainer: [
    {
      display: 'block',
      width: '100%',
      selectors: {
        video: {
          display: 'block',
          width: '100%',
        },
      },
    },
    className,
  ],
  hlsVideoPlayer: {
    width: '100%',
    height: '100%',
  },
});

export const getClassNames = classNamesFunction<IHLSVideoPlayerStyleProps, IHLSVideoPlayerStyles>();
