import React, { useCallback, useEffect } from 'react';
import { IStyleFunctionOrObject, styled } from '@uifabric/utilities';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Groups from '../../../components/Groups/Groups';
import { SessionStorageKeys } from '../../../constants';
import { GroupId } from '../../../types/group';
import { getOrGenerateFootprint } from '../../../services/general';
import { setAppLoader } from '../../app/actions';
import { pubSubConnectAndLogin, pubSubForceDisconnect } from '../../../services/pubSubClient/actions';
import { SnackbarSection } from '../../../components/Snackbar/SnackbarSection';
import { Snackbar } from '../../../components/Snackbar/Snackbar';
import { LoadingOverlay } from '../../../components/loaders/LoadingOverlay/LoadingOverlay';
import { OverlayBackdropColor } from '../../../components/Overlay/styles/Overlay.styles';
import { changeBetSelector } from '../state/selectors';
import { mergeChangeBet, getGroups } from '../state/actions';
import { GROUPS_POLLING_INTERVAL } from '../constants';
import {
  getClassNames, getStyles, IChangeBetSnackbarStyleProps, IChangeBetSnackbarStyles,
} from './styles/ChangeBetSnackbar';

export interface IChangeBetSnackbarProps {
  styles?: IStyleFunctionOrObject<IChangeBetSnackbarStyleProps, IChangeBetSnackbarStyles>;
}

const ChangeBetSnackbarBase: React.FC<IChangeBetSnackbarProps> = ({
  styles,
}) => {
  const { t } = useTranslation();

  const { isSnackbarOpen, groups } = useSelector(changeBetSelector);
  const dispatch = useDispatch();

  const handleGetGroups = useCallback(() => {
    if (isSnackbarOpen) {
      dispatch(getGroups());
    }
  }, [isSnackbarOpen]);

  useEffect(() => {
    handleGetGroups();

    const getGroupsInterval = setInterval(() => {
      handleGetGroups();
    }, GROUPS_POLLING_INTERVAL);

    return () => clearInterval(getGroupsInterval);
  }, [handleGetGroups]);

  const handleClose = useCallback(() => {
    dispatch(mergeChangeBet({ isSnackbarOpen: false }));
  }, []);

  const handleGroupCardClick = useCallback((groupId: GroupId) => {
    const footprint = getOrGenerateFootprint();

    dispatch(pubSubForceDisconnect());

    dispatch(setAppLoader({
      isLoading: true,
      message: t('ChangeBetSnackbar.ChangingGroup'),
    }));

    dispatch(pubSubConnectAndLogin({
      footprint,
      groupId,
      url: sessionStorage.getItem(SessionStorageKeys.socketURL) as string,
      token: 'token', // Backend require any non empty string value for this property for change bet
    }));
  }, []);

  const classNames = getClassNames(styles, { groupsLength: groups.length });

  return (
    <Snackbar
      className={classNames.snackbar}
      headerContent={t('ChangeBetSnackbar.ChangeBet')}
      isOpen={isSnackbarOpen}
      e2eSelector="change-bet-snackbar"
      onClose={handleClose}
    >
      <SnackbarSection className={classNames.groupListSection}>
        <Groups
          className={classNames.groups}
          groups={groups}
          onCardClick={handleGroupCardClick}
        />
        <LoadingOverlay
          className={classNames.loaderContainer}
          isVisible={!groups.length}
          overlayBackdropColor={OverlayBackdropColor.transparent}
          message={t('ChangeBetSnackbar.LookingForBets')}
        />
      </SnackbarSection>
    </Snackbar>
  );
};

export const ChangeBetSnackbar = React.memo(
  styled<
    IChangeBetSnackbarProps,
    IChangeBetSnackbarStyleProps,
    IChangeBetSnackbarStyles
  >(
    ChangeBetSnackbarBase,
    getStyles,
  ),
);
