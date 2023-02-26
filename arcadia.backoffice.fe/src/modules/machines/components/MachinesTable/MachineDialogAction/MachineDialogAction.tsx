import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  DialogAction,
  ActionType,
  ActionTypeUnion,
} from '../../../../../components/dialogs/DialogAction/DialogAction';
import { MachineAction } from '../../../types';
import { machineActionLabelMap } from '../../../constants';
import { machineDialogActionSelector } from '../../../state/selectors';
import { executeMachinesAction, setMachinesDialogAction } from '../../../state/actions';

const actionTypeMap: { [key in MachineAction]: ActionTypeUnion } = {
  [MachineAction.dry]: ActionType.negative,
  [MachineAction.shutdown]: ActionType.negative,
  [MachineAction.remove]: ActionType.negative,
  [MachineAction.reboot]: ActionType.negative,
};

interface IMachineDialogActionProps {
}

export const MachineDialogAction: React.FC<IMachineDialogActionProps> = () => {
  const dispatch = useDispatch();
  const {
    id, action, isOpen, isLoading,
  } = useSelector(machineDialogActionSelector);

  const onClose = useCallback(() => {
    dispatch(setMachinesDialogAction());
  }, []);

  const onSubmit = useCallback((data) => {
    dispatch(executeMachinesAction({
      ...data,
      id,
      action,
    }));
  }, [id, action]);

  return (
    <DialogAction
      isOpen={isOpen}
      isLoading={isLoading}
      actionType={actionTypeMap[action]}
      action={machineActionLabelMap[action]}
      subject="Machine"
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
};
