import React, { useCallback, useEffect } from 'react';
import { IStyleFunctionOrObject, styled } from '@uifabric/utilities';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { getLobbyData } from '../state/actions';
import { LOBBY_DATA_POLLING_INTERVAL } from '../constants';
import { lobbyReducerSelector } from '../state/selectors';
import { SessionStorageKeys } from '../../../constants';
import { GroupId } from '../../../types/group';
import { getOrGenerateFootprint } from '../../../services/general';
import { setAppLoader } from '../../app/actions';
import { SoundsController } from '../../../services/sounds/controller';
import { BackgroundSound } from '../../../services/sounds/types';
import { pubSubConnectAndLogin } from '../../../services/pubSubClient/actions';
import Groups from '../../../components/Groups/Groups';
import { StarSpinner } from '../../../components/loaders/StarSpinner/StarSpinner';
import {
  getClassNames, getStyles, ILobbyStyleProps, ILobbyStyles,
} from './styles/Lobby';

export interface ILobbyProps {
  styles?: IStyleFunctionOrObject<ILobbyStyleProps, ILobbyStyles>;
}

const LobbyBase: React.FC<ILobbyProps> = ({ styles }) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const { groups } = useSelector(lobbyReducerSelector);

  const handleGetLobbyData = useCallback(() => {
    dispatch(getLobbyData({
      token: sessionStorage.getItem(SessionStorageKeys.accessToken) as string,
    }));
  }, []);

  useEffect(() => {
    SoundsController.getInstance().playBackgroundSound(BackgroundSound.lobby);
  }, []);

  useEffect(() => {
    handleGetLobbyData();

    const getDataPollingInterval = setInterval(() => {
      handleGetLobbyData();
    }, LOBBY_DATA_POLLING_INTERVAL);

    return () => clearInterval(getDataPollingInterval);
  }, [handleGetLobbyData]);

  const handleGroupCardClick = useCallback((groupId: GroupId) => {
    const footprint = getOrGenerateFootprint();

    dispatch(setAppLoader({
      isLoading: true,
      message: t('Lobby.PreparingGroup'),
    }));

    dispatch(pubSubConnectAndLogin({
      footprint,
      groupId,
      url: sessionStorage.getItem(SessionStorageKeys.socketURL) as string,
      token: sessionStorage.getItem(SessionStorageKeys.accessToken) as string,
    }));
  }, []);

  const classNames = getClassNames(styles);

  return (
    <div className={classNames.root}>
      { !groups.length ? (
        <StarSpinner e2eSelector="lobby-spinner" className={classNames.spinner} />
      ) : (
        <Groups groups={groups} onCardClick={handleGroupCardClick} />
      )}
    </div>
  );
};

export default styled<ILobbyProps, ILobbyStyleProps, ILobbyStyles>(
  LobbyBase,
  getStyles,
);
