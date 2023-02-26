import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Checkbox, DialogSection } from 'arcadia-common-fe';
import { DialogAction } from '../../../../../components/dialogs/DialogAction/DialogAction';
import { machineDialogActivateSelector } from '../../../state/selectors';
import { activateMachine, setDialogActivateMachine } from '../../../state/actions';
import './MachineDialogActivate.scss';

interface IMachineDialogActivateProps {
}

export const MachineDialogActivate: React.FC<IMachineDialogActivateProps> = () => {
  const dispatch = useDispatch();
  const {
    id, isOpen, isLoading,
  } = useSelector(machineDialogActivateSelector);

  const onClose = useCallback(() => {
    dispatch(setDialogActivateMachine());
  }, []);

  const onSubmit = useCallback((data) => {
    dispatch(activateMachine({ ...data, id }));
  }, [id]);

  return (
    <DialogAction
      isOpen={isOpen}
      isLoading={isLoading}
      initialValues={{ resetTableState: true, resetDispensers: true }}
      action="Activate"
      subject="Machine"
      onClose={onClose}
      onSubmit={onSubmit}
    >
      <DialogSection className="machine-dialog-activate__section">
        <Checkbox name="resetTableState" label="Reset Table State" />
        <Checkbox name="resetDispensers" label="Reset Dispensers" />
      </DialogSection>
    </DialogAction>
  );
};
