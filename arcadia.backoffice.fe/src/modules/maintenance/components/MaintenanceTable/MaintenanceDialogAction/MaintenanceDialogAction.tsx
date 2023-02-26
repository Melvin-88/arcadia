import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ActionType, DialogAction } from '../../../../../components/dialogs/DialogAction/DialogAction';
import { maintenanceDialogActionSelector, maintenanceReducerSelector } from '../../../state/selectors';
import { executeMaintenanceAction, setMaintenanceDialogAction } from '../../../state/actions';
import { IAlert, MaintenanceAction } from '../../../types';
import { getActionText } from '../../../helpers';

interface IMaintenanceDialogActionProps {
}

export const MaintenanceDialogAction: React.FC<IMaintenanceDialogActionProps> = () => {
  const {
    id, isOpen, action, isLoading,
  } = useSelector(maintenanceDialogActionSelector);
  const { alerts } = useSelector(maintenanceReducerSelector);
  const dispatch = useDispatch();

  const actionText = useMemo(() => getActionText(action), [action]);

  const message = useMemo(() => {
    const currentAlert = alerts.find((alert: IAlert) => alert.id === id);

    if (action === MaintenanceAction.fillDispenser) {
      return (
        `Replace cartridge in dispenser ${currentAlert?.additionalInfo.dispenserName} with ${currentAlert?.additionalInfo.chipType} chips`
      );
    } if (action === MaintenanceAction.waistEmptied) {
      return 'Remove dispenser waist bin, empty, and replace';
    }

    return 'Dismiss';
  }, [action, alerts, id]);

  const onClose = useCallback(() => {
    dispatch(setMaintenanceDialogAction());
  }, []);

  const onSubmit = useCallback(() => {
    if (id) {
      dispatch(executeMaintenanceAction({ id, action }));
    }
  }, [id, action]);

  return (
    <DialogAction
      isOpen={isOpen}
      isLoading={isLoading}
      actionType={ActionType.negative}
      action={actionText}
      message={message}
      subject="Alert"
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
};
