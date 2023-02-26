import { IRawStyle, IStyle } from '@uifabric/styling';
import { classNamesFunction } from '@uifabric/utilities';
import { Color, FontFamily } from '../../../styles/constants';

export interface IChipsBarStyleProps {
  className?: string;
}

export interface IChipsBarStyles {
  root: IStyle;
  chipItem: IStyle;
  chipIcon: IStyle;
  chipPhantomIcon: IStyle;
  chipValue: IStyle;
  chipPhantomValue: IStyle;
}

const chipValueBaseStyles: IRawStyle = {
  width: '85.18%',
  height: '4rem',
  backgroundImage: 'linear-gradient(to top, #fff000, #fed088, #ffea5d, #ffffff), linear-gradient(to bottom, #ffbf24, #ffbf24)',
  color: Color.chipsBar.valueColor,
  backgroundClip: 'text',
  paintOrder: 'stroke fill',
  '-webkit-text-stroke': `0.05em ${Color.chipsBar.valueStrokeColor}`,
  '-webkit-background-clip': 'text',
  '-webkit-text-fill-color': 'transparent',
};

const ICON_MARGIN_BOTTOM = '0.3rem';

export const getStyles = ({ className }: IChipsBarStyleProps): IChipsBarStyles => ({
  root: [
    {
      display: 'flex',
      flexDirection: 'column',
      padding: '0.5rem 0 1.7rem',
      backgroundColor: Color.chipsBar.backgroundColor,
      border: `solid 0.8rem ${Color.chipsBar.borderColor}`,
      fontFamily: FontFamily.tertiary,
      overflow: 'auto',
      borderRadius: '4rem',
      boxShadow: 'inset 1.7rem -0.03rem 5.4rem 0 #5185ff, inset -1.7rem 0px 5.4rem 0 #dc51ff75',
    },
    className,
  ],
  chipItem: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: '0.4rem',
    textAlign: 'center',
    textTransform: 'uppercase',
    color: Color.chipsBar.valueColor,
    selectors: {
      ':last-child': {
        marginBottom: 0,
      },
    },
  },
  chipIcon: {
    display: 'block',
    width: '83.33%',
    marginBottom: ICON_MARGIN_BOTTOM,
  },
  chipPhantomIcon: {
    display: 'block',
    width: '86.11%',
    marginBottom: ICON_MARGIN_BOTTOM,
  },
  chipValue: chipValueBaseStyles,
  chipPhantomValue: [
    chipValueBaseStyles,
    {
      height: '5.6rem',
      lineHeight: '1',
    },
  ],
});

export const getClassNames = classNamesFunction<IChipsBarStyleProps, IChipsBarStyles>();
