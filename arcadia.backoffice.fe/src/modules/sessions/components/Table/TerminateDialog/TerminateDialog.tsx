import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IDialogProps } from 'arcadia-common-fe';
import { sessionDialogTerminateSelector } from '../../../selectors';
import { terminateSession, closeTerminateDialog } from '../../../actions';
import { DialogAction } from '../../../../../components/dialogs/DialogAction/DialogAction';

export interface ITerminateDialogProps extends Partial<IDialogProps> {
}

export const TerminateDialog: React.FC<ITerminateDialogProps> = () => {
  const { isOpen, isLoading, id } = useSelector(sessionDialogTerminateSelector);
  const dispatch = useDispatch();

  const onClose = useCallback(() => {
    dispatch(closeTerminateDialog());
  }, []);

  const onSubmit = useCallback(() => {
    if (id) {
      dispatch(terminateSession({ id }));
    }
  }, [id]);

  return (
    <DialogAction
      isOpen={isOpen}
      isLoading={isLoading}
      actionType="negative"
      action="Terminate"
      subject="Session"
      onSubmit={onSubmit}
      onClose={onClose}
    />
  );
};
