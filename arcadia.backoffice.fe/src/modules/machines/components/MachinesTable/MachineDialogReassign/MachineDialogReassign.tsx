import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Form, TextField, DialogSection, DialogConfirmation,
} from 'arcadia-common-fe';
import { machineDialogReassignSelector } from '../../../state/selectors';
import { reassignMachine, setDialogReassignMachine } from '../../../state/actions';
import { LinkToGroup } from '../../../../operators/components/OperatorsDialogForm/LinkToGroup/LinkToGroup';
import { IMachineReassignRequestBody } from '../../../types';
import './MachineDialogReassign.scss';

interface IMachineDialogReassignProps {
}

let submitForm = () => {};

export const MachineDialogReassign: React.FC<IMachineDialogReassignProps> = () => {
  const dispatch = useDispatch();
  const {
    id, isOpen, isLoading,
  } = useSelector(machineDialogReassignSelector);

  const handleClose = useCallback(() => {
    dispatch(setDialogReassignMachine());
  }, []);

  const handleSubmitClick = useCallback(() => {
    submitForm();
  }, [submitForm]);

  const handleFormSubmit = useCallback((values: IMachineReassignRequestBody) => {
    if (id) {
      dispatch(reassignMachine({ ...values, id }));
    }
  }, [id]);

  return (
    <DialogConfirmation
      className="machine-dialog-reassign"
      isOpen={isOpen}
      isLoading={isLoading}
      title="Reassign Machine"
      onClose={handleClose}
      onSubmit={handleSubmitClick}
    >
      <Form
        onSubmit={handleFormSubmit}
        render={({ handleSubmit }) => {
          submitForm = handleSubmit;

          return (
            <form onSubmit={handleSubmit}>
              <DialogSection className="machine-dialog-reassign__section">
                <LinkToGroup name="groupId" label="Group" isMulti={false} isRequired />
                <TextField name="rtpSegment" label="RTP segment" />
              </DialogSection>
            </form>
          );
        }}
      />
    </DialogConfirmation>
  );
};
