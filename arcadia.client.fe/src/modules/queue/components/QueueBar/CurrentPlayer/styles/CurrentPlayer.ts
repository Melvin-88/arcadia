import { IStyle, keyframes } from '@uifabric/styling';
import { classNamesFunction } from '@uifabric/utilities';
import { Color, FontFamily } from '../../../../../../styles/constants';

export interface ICurrentPlayerStyleProps {
  className?: string;
  isPositionExists: boolean;
}

export interface ICurrentPlayerStyles {
  root: IStyle;
  imgBasement1: IStyle;
  imgBasement2: IStyle;
  imgFigure: IStyle;
  title: IStyle;
}

const shadowKeyframes = keyframes({
  '0%': {
    transform: 'scaleX(1)',
  },
  '100%': {
    transform: 'scaleX(0.7) translateX(-5%)',
  },
});

const levitationKeyframes = keyframes({
  '0%': {
    transform: 'translateY(0)',
  },
  '100%': {
    transform: 'translateY(-5%)',
  },
});

const LEVITATION_DURATION_MS = 1200;

export const getStyles = ({ className, isPositionExists }: ICurrentPlayerStyleProps): ICurrentPlayerStyles => ({
  root: [
    {
      position: 'relative',
      display: 'block',
      width: '100%',
      paddingBottom: '1.4rem',
    },
    isPositionExists && {
      paddingBottom: 0,
    },
    className,
  ],
  imgBasement1: {
    display: 'block',
    width: '100%',
  },
  imgBasement2: {
    display: 'block',
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    animation: `${shadowKeyframes} ${LEVITATION_DURATION_MS}ms linear infinite alternate`,
  },
  imgFigure: {
    display: 'block',
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    animation: `${levitationKeyframes} ${LEVITATION_DURATION_MS}ms linear infinite alternate`,
  },
  title: [
    {
      position: 'absolute',
      left: '25%',
      bottom: 0,
      backgroundImage: `linear-gradient(to top, #dff8ff, ${Color.white}), linear-gradient(to bottom, ${Color.white}, ${Color.white})`,
      fontFamily: FontFamily.tertiary,
      fontSize: '3.85rem',
      color: Color.white,
      backgroundClip: 'text',
      textTransform: 'uppercase',
      '-webkit-text-stroke': '0.065em #0a001d',
      '-webkit-background-clip': 'text',
      '-webkit-text-fill-color': 'transparent',
    },
    isPositionExists && {
      fontSize: '2.65rem',
      left: '20%',
      bottom: '6.41%',
      '-webkit-text-stroke': '0.082em #0a001d',
    },
  ],
});

export const getClassNames = classNamesFunction<ICurrentPlayerStyleProps, ICurrentPlayerStyles>();
