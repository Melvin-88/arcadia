import { IStyle } from '@uifabric/styling';
import { classNamesFunction } from '@uifabric/utilities';

export interface ICSRTCVideoPlayerStyleProps {
  className?: string;
}

export interface ICSRTCVideoPlayerStyles {
  videoPlayer: IStyle;
}

export const getStyles = ({ className }: ICSRTCVideoPlayerStyleProps): ICSRTCVideoPlayerStyles => ({
  videoPlayer: [
    {
      display: 'block',
      width: '100%',
      selectors: {
        '> video': {
          display: 'block',
          width: '100%',
        },
      },
    },
    className,
  ],
});

export const getClassNames = classNamesFunction<ICSRTCVideoPlayerStyleProps, ICSRTCVideoPlayerStyles>();
