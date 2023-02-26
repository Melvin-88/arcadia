import { IStyle, keyframes } from '@uifabric/styling';
import { classNamesFunction } from '@uifabric/utilities';

export interface IJackpotWinOverlayStyleProps {
}

export interface IJackpotWinOverlayStyles {
  content: IStyle;
  animation: IStyle;
  amount: IStyle;
}

const fadeInKeyFrames = keyframes({
  '100%': {
    opacity: 1,
  },
});

export const getStyles = (): IJackpotWinOverlayStyles => ({
  content: {
    width: '100%',
    height: '100%',
    padding: 0,
  },
  animation: {
    width: '100%',
    height: '100%',
  },
  amount: {
    position: 'absolute',
    left: '20.97%',
    right: '20.97%',
    top: '43.5%',
    height: '12.8rem',
    width: 'auto',
    lineHeight: '1',
    color: '#ffcf00',
    backgroundImage: 'linear-gradient(to top, #fff000 0%, #ffb033 25%, #ffb828 42%, #ffdf90 42%, #ffe08a 50%, #fff000 100%)',
    backgroundClip: 'text',
    opacity: 0,
    userSelect: 'none',
    animation: `${fadeInKeyFrames} 750ms 50ms forwards`,
    '-webkit-background-clip': 'text',
    '-webkit-text-fill-color': 'transparent',
    '-webkit-text-stroke': '0.045em #550050',
  },
});

export const getClassNames = classNamesFunction<IJackpotWinOverlayStyleProps, IJackpotWinOverlayStyles>();
