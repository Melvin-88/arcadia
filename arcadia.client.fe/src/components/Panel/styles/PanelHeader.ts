import { IStyle } from '@uifabric/styling';
import { classNamesFunction } from '@uifabric/utilities';
import { Color } from '../../../styles/constants';

export interface IPanelHeaderStyleProps {
}

export interface IPanelHeaderStyles {
  panelHeader: IStyle;
  iconArrow: IStyle;
  titleIcon: IStyle;
}

export const getStyles = (): IPanelHeaderStyles => ({
  panelHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: '8.93rem',
    textTransform: 'uppercase',
    letterSpacing: '-0.15rem',
  },
  iconArrow: {
    position: 'absolute',
    left: '4.6rem',
    width: '3.93rem',
    transform: 'rotate(180deg)',
  },
  titleIcon: {
    width: '7.5rem',
    marginRight: '3.21rem',
    fill: Color.panel.headerIconFillColor,
  },
});

export const getClassNames = classNamesFunction<IPanelHeaderStyleProps, IPanelHeaderStyles>();
