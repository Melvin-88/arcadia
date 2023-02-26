import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { IStyleFunctionOrObject, styled } from '@uifabric/utilities';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { matchPath, useLocation } from 'react-router-dom';
import ShortestQueueProposal from './ShortestQueueProposal/ShortestQueueProposal';
import { appLoaderSelector, isLostConnectionSelector, shortestQueueProposalSelector } from '../selectors';
import { LoadingOverlay } from '../../../components/loaders/LoadingOverlay/LoadingOverlay';
import { ROUTES_MAP } from '../../../routing/constants';
import { SessionStorageKeys } from '../../../constants';
import { Menu } from '../../menu/components/Menu';
import { Overlay } from '../../overlay/components/Overlay';
import { Tutorial } from '../../tutorial/components/Tutorial';
import { GameRules } from '../../gameRules/components/GameRules';
import { QuitConfirmDialog } from '../../../components/QuitConfirmDialog/QuitConfirmDialog';
import { mergeSoundsConfig, restoreConnection } from '../actions';
import { LostConnectionOverlay } from '../../../components/LostConnectionOverlay/LostConnectionOverlay';
import { APP_CONTAINER_ID } from '../../../components/AppLayout/AppLayout';
import { OverlayBackdropColor } from '../../../components/Overlay/styles/Overlay.styles';
import 'react-toastify/dist/ReactToastify.css';
import { JackpotWinOverlay } from '../../jackpot/components/JackpotWinOverlay/JackpotWinOverlay';
import {
  getClassNames, getStyles, IAppStyleProps, IAppStyles,
} from './styles/App';

// TODO: Implement assets preload helper

interface IAppProps {
  styles?: IStyleFunctionOrObject<IAppStyleProps, IAppStyles>;
}

const AppBase: React.FC<IAppProps> = ({ styles, children }) => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const { isLoading, message } = useSelector(appLoaderSelector);

  const isLostConnection = useSelector(isLostConnectionSelector);

  const shortestQueueProposal = useSelector(shortestQueueProposalSelector);

  useEffect(() => {
    const soundsConfig = JSON.parse(sessionStorage.getItem(SessionStorageKeys.soundsConfig) || '{}');

    if (!matchPath(pathname, ROUTES_MAP.auth) && !matchPath(pathname, ROUTES_MAP.lobby)) {
      dispatch(restoreConnection());
    }

    dispatch(mergeSoundsConfig(soundsConfig));
  }, []);

  const classNames = getClassNames(styles);

  return (
    <>
      <main className={classNames.appContent}>
        { children }
      </main>
      { ReactDOM.createPortal(
        <>
          <Overlay />
          <Menu />
          <Tutorial />
          <GameRules />
          <LoadingOverlay
            isVisible={isLoading}
            overlayBackdropColor={OverlayBackdropColor.primarySolid}
            message={message}
            e2eSelector="app-loading-overlay"
          />
          <QuitConfirmDialog />
          <LostConnectionOverlay isVisible={isLostConnection} />
          <JackpotWinOverlay />
        </>,
        document.getElementById(APP_CONTAINER_ID) || document.body,
      ) }
      <ToastContainer bodyClassName={classNames.toastBody} />
      <ShortestQueueProposal shortestQueueProposal={shortestQueueProposal} />
    </>
  );
};

export const App = styled<IAppProps, IAppStyleProps, IAppStyles>(
  AppBase,
  getStyles,
);
