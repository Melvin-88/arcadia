import { IStyle } from '@uifabric/styling';
import { classNamesFunction } from '@uifabric/utilities';
import { Color, FontFamily, FontSize } from '../../../../styles/constants';

export interface IPayTablePanelStyleProps {
}

export interface IPayTablePanelStyles {
  title: IStyle;
  regularChips: IStyle;
  chipRegular: IStyle;
  chipRegularIcon: IStyle;
  separator: IStyle;
  chipRegularValue: IStyle;
  chipPhantom: IStyle;
  chipPhantomIcon: IStyle;
  info: IStyle;
  infoIcon: IStyle;
  infoText: IStyle;
  panel: IStyle;
}

export const getStyles = (): IPayTablePanelStyles => ({
  title: {
    margin: '7.28rem 0 0 0.132rem',
    fontSize: FontSize.Size6,
    textTransform: 'uppercase',
  },
  regularChips: {
    marginTop: '4.95rem',
  },
  chipRegular: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '7.28rem',
    selectors: {
      ':first-child': {
        marginTop: 0,
      },
    },
  },
  chipRegularIcon: {
    width: '8.95rem',
    marginRight: '1.35rem',
  },
  separator: {
    marginRight: '1.07rem',
    color: Color.white,
  },
  chipRegularValue: {
    fontSize: FontSize.Size6,
  },
  chipPhantom: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '7.28rem',
  },
  chipPhantomIcon: {
    width: '9.13rem',
    marginRight: '1.2rem',
  },
  info: {
    display: 'flex',
    alignItems: 'flex-start',
    marginTop: '9.2rem',
  },
  infoIcon: {
    width: '10.5rem',
    margin: '0.7rem 1.68rem 0 1.2rem',
    fill: Color.payTablePanel.iconInfoColor,
  },
  infoText: {
    fontFamily: FontFamily.primary,
    fontSize: FontSize.Size8,
  },
  panel: {
    padding: '4.6rem 6.55rem',
  },
});

export const getClassNames = classNamesFunction<IPayTablePanelStyleProps, IPayTablePanelStyles>();
