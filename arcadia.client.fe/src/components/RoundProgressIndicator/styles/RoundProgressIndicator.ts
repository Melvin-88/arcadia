import { IStyle } from '@uifabric/styling';
import { classNamesFunction } from '@uifabric/utilities';
import { Color, FontFamily } from '../../../styles/constants';

export interface IRoundProgressIndicatorStyleProps {
}

// TODO: Review all styles and cleanup
export interface IRoundProgressIndicatorStyles {
  root: IStyle;
  stacksImg: IStyle;
  rounds: IStyle;
  yourStacks: IStyle;
  rejectButton: IStyle;
}

export const getStyles = (): IRoundProgressIndicatorStyles => ({
  root: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    color: Color.white,
    fontFamily: FontFamily.secondary,
    textTransform: 'uppercase',
  },
  stacksImg: {
    width: '8.9rem',
    margin: '-2.1rem 0 0 0.6rem',
  },
  rounds: {
    position: 'absolute',
    justifyContent: 'flex-end',
    width: 'auto',
    left: 0,
    right: '-0.45rem',
    bottom: '4.4rem',
    height: '5.1rem',
    textTransform: 'none',
    letterSpacing: '-0.06em',
    backgroundImage: 'linear-gradient(to top, #dff8ff, #ffffff), linear-gradient(to bottom, #ffffff, #ffffff)',
    backgroundClip: 'text',
    '-webkit-background-clip': 'text',
    '-webkit-text-stroke': '0.05em #21007c',
    '-webkit-text-fill-color': 'transparent',
  },
  yourStacks: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '3.3rem',
    marginTop: '0.6rem',
    backgroundImage: 'linear-gradient(to top, #dff8ff, #ffffff), linear-gradient(to bottom, #ffffff, #ffffff)',
    backgroundClip: 'text',
    letterSpacing: '-0.12rem',
    whiteSpace: 'pre-line',
    '-webkit-text-stroke': `0.06em ${Color.roundProgressIndicator.yourStacksStrokeColor}`,
    '-webkit-background-clip': 'text',
    '-webkit-text-fill-color': 'transparent',
  },
  rejectButton: {
    width: '4.2rem',
    margin: 'auto auto -0.55rem',
  },
});

export const getClassNames = classNamesFunction<IRoundProgressIndicatorStyleProps, IRoundProgressIndicatorStyles>();
