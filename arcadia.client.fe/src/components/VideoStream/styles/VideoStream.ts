import { IStyle } from '@uifabric/styling';
import { classNamesFunction } from '@uifabric/utilities';
import { Color, FontSize } from '../../../styles/constants';

export interface IVideoStreamStyleProps {
  className?: string;
}

export interface IVideoStreamStyles {
  root: IStyle;
  videoPlayer: IStyle;
  errorMessage: IStyle;
  loadingOverlay: IStyle;
  liveStreamBadge: IStyle;
}

export const getStyles = ({ className }: IVideoStreamStyleProps): IVideoStreamStyles => ({
  root: [
    {
      position: 'relative',
      background: Color.black,
      zIndex: -1,
    },
    className,
  ],
  videoPlayer: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    selectors: {
      video: {
        display: 'block',
        width: '100%',
        height: '100%',
        objectPosition: 'center bottom',
        objectFit: 'cover',
      },
    },
  },
  errorMessage: {
    position: 'absolute',
    top: '50%',
    left: 0,
    width: '100%',
    textAlign: 'center',
    fontSize: FontSize.Size6,
    color: Color.white,
  },
  loadingOverlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
  },
  liveStreamBadge: {
    position: 'absolute',
    bottom: '4%',
    right: '2.5%',
    width: '11.73%',
  },
});

export const getClassNames = classNamesFunction<IVideoStreamStyleProps, IVideoStreamStyles>();
