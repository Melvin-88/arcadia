import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ActionType, DialogAction } from '../../../../../components/dialogs/DialogAction/DialogAction';
import { alertsDismissDialogSelector, alertsReducerSelector, selectedAlertsSelector } from '../../../state/selectors';
import { dismissAlerts, setDismissDialog } from '../../../state/actions';
import { AlertStatus } from '../../../types';

interface IAlertsDismissDialogProps {
}

export const AlertsDismissDialog: React.FC<IAlertsDismissDialogProps> = () => {
  const { isOpen, isLoading } = useSelector(alertsDismissDialogSelector);
  const { entities } = useSelector(alertsReducerSelector);
  const selectedAlerts = useSelector(selectedAlertsSelector);
  const dispatch = useDispatch();

  const onClose = useCallback(() => {
    dispatch(setDismissDialog());
  }, []);

  const onSubmit = useCallback(() => {
    const activeSelectedAlerts = selectedAlerts.filter(
      (id) => entities[id].status === AlertStatus.active,
    );

    dispatch(dismissAlerts(activeSelectedAlerts));
  }, [selectedAlerts, entities]);

  return (
    <DialogAction
      isOpen={isOpen}
      isLoading={isLoading}
      actionType={ActionType.negative}
      action="Dismiss"
      subject={`Alert${selectedAlerts.length > 1 ? 's' : ''}`}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
};
