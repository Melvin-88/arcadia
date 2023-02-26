import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CommandBar, ICommandBarItems } from 'arcadia-common-fe';
import { flagAlerts, setDismissDialog } from '../../state/actions';
import { alertsReducerSelector, selectedAlertsSelector } from '../../state/selectors';
import DismissIcon from '../../../../assets/svg/dismiss.svg';
import FlagIcon from '../../../../assets/svg/flag.svg';
import { AlertStatus } from '../../types';
import './AlertsCommandBar.scss';

export const AlertsCommandBar = () => {
  const dispatch = useDispatch();
  const { entities } = useSelector(alertsReducerSelector);
  const selectedAlerts = useSelector(selectedAlertsSelector);

  const handleDismiss = useCallback(() => {
    dispatch(setDismissDialog({
      isOpen: true,
    }));
  }, []);

  const dismissDisabled = useMemo(() => (
    !selectedAlerts.some((selectedId) => entities[selectedId].status === AlertStatus.active)
  ), [selectedAlerts, entities]);

  const handleFlag = useCallback(() => {
    dispatch(flagAlerts(selectedAlerts));
  }, [selectedAlerts]);

  const items: ICommandBarItems = useMemo(() => [
    {
      text: 'Dismiss', Icon: DismissIcon, disabled: dismissDisabled, onClick: handleDismiss,
    },
    {
      text: 'Toggle flag',
      Icon: FlagIcon,
      disabled: !selectedAlerts.length,
      iconClassName: 'alerts-command-bar__flag-icon',
      onClick: handleFlag,
    },
  ], [handleDismiss, dismissDisabled, handleFlag, selectedAlerts]);

  return (
    <CommandBar items={items} />
  );
};
