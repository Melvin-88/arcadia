import React, { useCallback } from 'react';
import { IStyleFunctionOrObject, styled } from '@uifabric/utilities';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { appStateSelector } from '../../app/selectors';
import { IPanelProps, Panel } from '../../../components/Panel/Panel';
import { setMenu } from '../state/actions';
import { setTutorial } from '../../tutorial/state/actions';
import { setGameRules } from '../../gameRules/state/actions';
import { MenuType } from '../types';
import { SoundsController } from '../../../services/sounds/controller';
import { ButtonSound } from '../../../services/sounds/types';
import { setQuitConfirmDialog } from '../../app/actions';
import IconGear from '../../../assets/svg/gear.svg';
import IconRules from '../../../assets/svg/rules.svg';
import IconTutorial from '../../../assets/svg/tutorial.svg';
import IconMoney from '../../../assets/svg/money.svg';
import IconLobby from '../../../assets/svg/lobby.svg';
import {
  getClassNames,
  getStyles,
  IMainMenuPanelStyleProps,
  IMainMenuPanelStyles,
} from './styles/MainMenuPanel';

export interface IMainMenuPanelProps extends Omit<IPanelProps, 'styles'> {
  styles?: IStyleFunctionOrObject<IMainMenuPanelStyleProps, IMainMenuPanelStyles>;
}

const MainMenuPanelBase: React.FC<IMainMenuPanelProps> = ({ styles, ...restProps }) => {
  const { t } = useTranslation();

  const { homeUrl } = useSelector(appStateSelector);

  const dispatch = useDispatch();
  const soundsController = SoundsController.getInstance();

  const createMenuItemClickHandler = useCallback((handler: () => void) => (() => {
    soundsController.playButtonSound(ButtonSound.secondary);
    handler();
  }), [soundsController]);

  const handleSettingsClick = useCallback(createMenuItemClickHandler(() => {
    dispatch(setMenu({
      openedMenu: MenuType.settings,
    }));
  }), [createMenuItemClickHandler]);

  const handleGameRulesClick = useCallback(createMenuItemClickHandler(() => {
    dispatch(
      setMenu({
        openedMenu: null,
      }),
    );
    dispatch(
      setGameRules({
        isOpened: true,
      }),
    );
  }), [createMenuItemClickHandler]);

  const handleTutorialClick = useCallback(createMenuItemClickHandler(() => {
    dispatch(
      setMenu({
        openedMenu: null,
      }),
    );
    dispatch(
      setTutorial({
        isOpened: true,
      }),
    );
  }), [createMenuItemClickHandler]);

  const handlePayTableClick = useCallback(createMenuItemClickHandler(() => {
    dispatch(setMenu({
      openedMenu: MenuType.payTable,
    }));
  }), [createMenuItemClickHandler]);

  const handleGoToTheLobbyClick = useCallback(createMenuItemClickHandler(() => {
    dispatch(setMenu({ openedMenu: null }));
    dispatch(setQuitConfirmDialog({ isOpen: true }));
  }), [createMenuItemClickHandler]);

  const items = [
    { Icon: IconGear, title: t('Menu.Titles.Settings'), onClick: handleSettingsClick },
    { Icon: IconRules, title: t('Menu.Titles.GameRules'), onClick: handleGameRulesClick },
    { Icon: IconTutorial, title: t('Menu.Titles.Tutorial'), onClick: handleTutorialClick },
    { Icon: IconMoney, title: t('Menu.Titles.PayTable'), onClick: handlePayTableClick },
    {
      Icon: IconLobby, title: t('Menu.Titles.GoToTheLobby'), onClick: handleGoToTheLobbyClick, isHidden: !homeUrl,
    },
  ];

  const classNames = getClassNames(styles);

  return (
    <Panel {...restProps}>
      <div className={classNames.mainMenu}>
        {items.map(({
          Icon, title, isHidden, onClick,
        }) => !isHidden && (
          <div
            key={title}
            className={classNames.item}
            role="button"
            tabIndex={0}
            onClick={onClick}
          >
            <Icon className={classNames.icon} />
            {title}
          </div>
        ))}
      </div>
    </Panel>
  );
};

export const MainMenuPanel = styled<IMainMenuPanelProps, IMainMenuPanelStyleProps, IMainMenuPanelStyles>(
  MainMenuPanelBase,
  getStyles,
);
