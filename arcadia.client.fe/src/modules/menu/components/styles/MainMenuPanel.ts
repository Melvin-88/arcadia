import { IStyle } from '@uifabric/styling';
import { classNamesFunction } from '@uifabric/utilities';
import { Color } from '../../../../styles/constants';

export interface IMainMenuPanelStyleProps {
}

export interface IMainMenuPanelStyles {
  mainMenu: IStyle;
  item: IStyle;
  icon: IStyle;
}

export const getStyles = (): IMainMenuPanelStyles => ({
  mainMenu: {
    textTransform: 'uppercase',
    marginTop: '1.5rem',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '7.36rem',
    cursor: 'pointer',
    selectors: {
      ':first-child': {
        marginTop: 0,
      },
    },
  },
  icon: {
    width: '7.5rem',
    marginRight: '3.57rem',
    fill: Color.panel.headerIconFillColor,
  },
});

export const getClassNames = classNamesFunction<IMainMenuPanelStyleProps, IMainMenuPanelStyles>();
