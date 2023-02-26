import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  DialogAction,
  ActionType,
  ActionTypeUnion,
} from '../../../../../components/dialogs/DialogAction/DialogAction';
import { monitoringDialogActionSelector } from '../../../state/selectors';
import { setMonitoringDialogAction, executeMonitoringAction } from '../../../state/actions';
import { MonitoringAction } from '../../../types';
import { monitoringActionLabelMap } from '../../../constants';

const actionTypeMap: { [key in MonitoringAction]: ActionTypeUnion } = {
  [MonitoringAction.remove]: ActionType.negative,
};

interface IMonitoringDialogActionProps {
}

export const MonitoringDialogAction: React.FC<IMonitoringDialogActionProps> = () => {
  const {
    id, isOpen, action, isLoading,
  } = useSelector(monitoringDialogActionSelector);
  const dispatch = useDispatch();

  const onClose = useCallback(() => {
    dispatch(setMonitoringDialogAction());
  }, []);

  const onSubmit = useCallback((data) => {
    if (id) {
      dispatch(executeMonitoringAction({
        id,
        action,
        ...data,
      }));
    }
  }, [id]);

  return (
    <DialogAction
      isOpen={isOpen}
      isLoading={isLoading}
      actionType={actionTypeMap[action]}
      action={monitoringActionLabelMap[action]}
      subject="Monitoring"
      withPasswordConfirm
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
};
