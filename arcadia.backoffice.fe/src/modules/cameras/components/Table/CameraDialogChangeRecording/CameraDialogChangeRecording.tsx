import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ActionType, DialogAction } from '../../../../../components/dialogs/DialogAction/DialogAction';
import { camerasDialogChangeRecordingSelector } from '../../../state/selectors';
import { changeRecording, setChangeRecordingDialog } from '../../../state/actions';

interface ICameraDialogChangeRecordingProps {
  site: string
}

export const CameraDialogChangeRecording: React.FC<ICameraDialogChangeRecordingProps> = ({ site }) => {
  const dispatch = useDispatch();
  const {
    id, isRecorded, isOpen, isLoading,
  } = useSelector(camerasDialogChangeRecordingSelector);

  const onClose = useCallback(() => {
    dispatch(setChangeRecordingDialog());
  }, []);

  const onSubmit = useCallback(() => {
    dispatch(changeRecording({
      id,
      isRecorded,
      site,
    }));
  }, [id, isRecorded, site]);

  return (
    <DialogAction
      isOpen={isOpen}
      isLoading={isLoading}
      actionType={isRecorded ? ActionType.positive : ActionType.negative}
      action={isRecorded ? 'Start' : 'Stop'}
      subject="Recording"
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
};
