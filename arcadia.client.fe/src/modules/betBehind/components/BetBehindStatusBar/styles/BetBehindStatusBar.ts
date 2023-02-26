import { IRawStyle, IStyle } from '@uifabric/styling';
import { classNamesFunction } from '@uifabric/utilities';
import { FontFamily } from '../../../../../styles/constants';

export interface IBetBehindStatusBarStyleProps {
  className?: string;
}

export interface IBetBehindStatusBarStyles {
  root: IStyle;
  background: IStyle;
  content: IStyle;
  betBehindIcon: IStyle;
  buttonStop: IStyle;
  pendingLabel: IStyle;
  stopLabel: IStyle;
  betBehindLabel: IStyle;
  labelText: IStyle;
}

const basicLabelStyles: IRawStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexGrow: 1,
};

const basicTextStyles: IRawStyle = {
  backgroundImage: 'linear-gradient(to top, #fff000, #ffb033, #ffffff, #fff000), linear-gradient(to bottom, #ffbf24, #ffbf24)',
  fontFamily: FontFamily.secondary,
  fontWeight: '900',
  backgroundClip: 'text',
  color: '#ffbf24', // TODO: Extract to constants
  '-webkit-background-clip': 'text',
  '-webkit-text-fill-color': 'transparent',
  '-webkit-text-stroke': '0.3rem #500075', // TODO: Extract to constants
  textTransform: 'uppercase',
  whiteSpace: 'nowrap',
};

export const getStyles = ({ className }: IBetBehindStatusBarStyleProps): IBetBehindStatusBarStyles => ({
  root: [
    {
      position: 'relative',
      width: '100%',
    },
    className,
  ],
  background: {
    display: 'block',
    width: '100%',
  },
  content: {
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    padding: '3rem 3rem 0',
  },
  betBehindIcon: {
    display: 'block',
    width: '8.5rem',
    margin: '0 2.6rem 0 1.8rem',
  },
  buttonStop: {
    width: '10.7rem',
    flexShrink: 0,
    margin: '-2rem 3.2rem 0',
  },
  pendingLabel: [
    basicLabelStyles,
    {
      height: '15rem',
      justifyContent: 'flex-start',
      lineHeight: '1.3',
    },
  ],
  stopLabel: [
    basicLabelStyles,
    {
      height: '6.65rem',
      justifyContent: 'flex-end',
    },
  ],
  betBehindLabel: [
    basicLabelStyles,
    {
      height: '8.75rem',
      justifyContent: 'flex-start',
      lineHeight: '1',
    },
  ],
  labelText: basicTextStyles,
});

export const getClassNames = classNamesFunction<IBetBehindStatusBarStyleProps, IBetBehindStatusBarStyles>();
