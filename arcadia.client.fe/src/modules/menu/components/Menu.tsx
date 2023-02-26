import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MainMenuPanel } from './MainMenuPanel';
import { SettingsPanel } from './SettingsPanel';
import { MenuType } from '../types';
import { setMenu } from '../state/actions';
import { menuSelector } from '../state/selectors';
import { PayTablePanel } from './PayTablePanel';
import { PubSubClient } from '../../../services/pubSubClient/client';
import { PubSubUserEventNotification } from '../../../services/pubSubClient/constants';

const pubSubClient = PubSubClient.getInstance();

export interface IMenuProps {
}

export const Menu: React.FC<IMenuProps> = () => {
  const dispatch = useDispatch();
  const { openedMenu } = useSelector(menuSelector);

  const handleOpenMainMenu = useCallback(() => {
    dispatch(setMenu({
      openedMenu: MenuType.main,
    }));
  }, []);

  const handleCloseMenu = useCallback(() => {
    dispatch(setMenu({
      openedMenu: null,
    }));
    pubSubClient.sendUserEventNotification({ type: PubSubUserEventNotification.menuClosed });
  }, []);

  return (
    <>
      <MainMenuPanel isOpen={openedMenu === MenuType.main} onClose={handleCloseMenu} />
      <SettingsPanel isOpen={openedMenu === MenuType.settings} onClose={handleOpenMainMenu} />
      <PayTablePanel isOpen={openedMenu === MenuType.payTable} onClose={handleOpenMainMenu} />
    </>
  );
};
