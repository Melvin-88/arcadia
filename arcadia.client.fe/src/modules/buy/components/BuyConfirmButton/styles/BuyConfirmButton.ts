import { IStyle } from '@uifabric/styling';
import { classNamesFunction } from '@uifabric/utilities';
import { Color, FontSize } from '../../../../../styles/constants';
import { forceMinAspectRatio } from '../../../../../styles/helpers';

export interface IBuyConfirmButtonStyleProps {
  className?: string;
}

export interface IBuyConfirmButtonStyles {
  root: IStyle;
  rootImg: IStyle;
  content: IStyle;
  info: IStyle;
  coins: IStyle;
  coinsIcon: IStyle;
  total: IStyle;
  price: IStyle;
  buyBtn: IStyle;
  buyBtnContent: IStyle;
}

export const getStyles = ({ className }: IBuyConfirmButtonStyleProps): IBuyConfirmButtonStyles => ({
  root: [
    {
      position: 'relative',
      width: '100%',
      padding: '3rem 3.3rem 3rem 0',
      textAlign: 'left',
      fontWeight: 600,
      textTransform: 'uppercase',
      color: Color.primaryTextColor,
    },
    className,
  ],
  rootImg: {
    display: 'block',
    width: '100%',
  },
  content: {
    position: 'absolute',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.8rem 0 1.8rem 5rem',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
  },
  info: {
    flexGrow: 1,
    paddingRight: '0.5rem',
  },
  coins: {
    display: 'flex',
    alignItems: 'center',
    color: Color.buyConfirmButton.coinsColor,
    fontSize: FontSize.Size7,
    letterSpacing: '-0.084rem',
    '-webkit-text-stroke': `0.05em ${Color.buyConfirmButton.coinsStrokeColor}`,
  },
  coinsIcon: {
    width: '5.41rem',
    marginLeft: '1rem',
  },
  total: {
    marginTop: '0.9rem',
    fontSize: FontSize.Size11,
    '-webkit-text-stroke': `0.05em ${Color.buyConfirmButton.valueStrokeColor}`,
  },
  price: {
    fontSize: FontSize.Size6,
    '-webkit-text-stroke': `0.06em ${Color.buyConfirmButton.valueStrokeColor}`,
  },
  buyBtn: [
    forceMinAspectRatio(85, 86),
    {
      flexShrink: 0,
      width: '25.5rem',
    },
  ],
  buyBtnContent: {
    padding: '6rem 3rem 8.7rem',
    color: Color.primaryTextColor,
    letterSpacing: '-0.4rem',
    '-webkit-text-stroke': `0.07em ${Color.buyConfirmButton.valueStrokeColor}`,
  },
});

export const getClassNames = classNamesFunction<IBuyConfirmButtonStyleProps, IBuyConfirmButtonStyles>();
