import { IStyle } from '@uifabric/styling';
import { classNamesFunction } from '@uifabric/utilities';
import { Color } from '../../../../styles/constants';

export interface ILobbyStyleProps {
}

export interface ILobbyStyles {
  root: IStyle;
  spinner: IStyle;
}

export const getStyles = (): ILobbyStyles => ({
  root: {
    background: Color.lobby.background,
    height: '100%',
    overflowY: 'auto',
    display: 'flex',
    alignItems: 'flex-start',
  },
  spinner: {
    margin: 'auto',
  },
});

export const getClassNames = classNamesFunction<ILobbyStyleProps, ILobbyStyles>();
