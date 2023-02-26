import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  DialogAction,
  ActionType,
  ActionTypeUnion,
} from '../../../../../components/dialogs/DialogAction/DialogAction';
import { CameraAction } from '../../../types';
import { cameraActionLabelMap } from '../../../constants';
import { cameraDialogActionSelector } from '../../../state/selectors';
import { executeCameraAction, setCameraDialogAction } from '../../../state/actions';

const actionTypeMap: { [key in CameraAction]: ActionTypeUnion } = {
  [CameraAction.remove]: ActionType.negative,
  [CameraAction.reset]: ActionType.negative,
};

interface ICameraDialogActionProps {
  site: string
}

export const CameraDialogAction: React.FC<ICameraDialogActionProps> = ({ site }) => {
  const {
    id, action, isOpen, isLoading,
  } = useSelector(cameraDialogActionSelector);
  const dispatch = useDispatch();

  const onClose = useCallback(() => {
    dispatch(setCameraDialogAction());
  }, []);

  const onSubmit = useCallback((data) => {
    dispatch(executeCameraAction({
      ...data,
      site,
      id,
      action,
    }));
  }, [id, action, site]);

  return (
    <DialogAction
      isOpen={isOpen}
      isLoading={isLoading}
      withPasswordConfirm
      actionType={actionTypeMap[action]}
      action={cameraActionLabelMap[action]}
      subject="Camera"
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
};
