import { IStyle, keyframes } from '@uifabric/styling';
import { classNamesFunction } from '@uifabric/utilities';

export interface IBackgroundRaysStyleProps {
}

const rayStyle: IStyle = {
  position: 'absolute',
  border: '0 solid transparent',
  borderWidth: '4.6rem 60rem',
  borderColor: 'transparent black',
  width: 0,
  height: 0,
};

export interface IBackgroundRaysStyles {
  root: IStyle;
  rays: IStyle;
  ray: IStyle;
}

const rotateKeyFrames = keyframes({
  '100%': {
    transform: 'rotate(360deg)',
  },
});

export const getStyles = (): IBackgroundRaysStyles => ({
  root: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    overflow: 'hidden',
    borderRadius: '4rem',
  },
  rays: {
    position: 'absolute',
    top: '-1rem',
    right: '-1rem',
    left: '-1rem',
    bottom: '-1rem',
    margin: 'auto',
    width: 0,
    opacity: '.2',
    animation: `${rotateKeyFrames} 10s infinite linear`,
  },
  ray: [
    rayStyle,
    {
      left: '-60rem',
      top: '50%',
      marginTop: '-4.6rem',
      selectors: {
        ':after, :before': [
          rayStyle,
          {
            content: '""',
            left: '-60rem',
            top: '-4.6rem',
            display: 'block',
          },
        ],
        ':before': {
          transform: 'rotate(60deg)',
        },
        ':after': {
          transform: 'rotate(-60deg)',
        },
        ':nth-child(2)': {
          transform: 'rotate(20deg)',
        },
        ':nth-child(3)': {
          transform: 'rotate(40deg)',
        },
      },
    },
  ],
});

export const getClassNames = classNamesFunction<IBackgroundRaysStyleProps, IBackgroundRaysStyles>();
