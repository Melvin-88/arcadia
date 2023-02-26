import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  DialogAction,
  ActionType,
  ActionTypeUnion,
} from '../../../../../components/dialogs/DialogAction/DialogAction';
import { GroupAction } from '../../../types';
import { groupActionLabelMap } from '../../../constants';
import { groupDialogActionSelector } from '../../../state/selectors';
import { executeGroupsAction, setGroupsDialogAction } from '../../../state/actions';

const actionTypeMap: { [key in GroupAction]: ActionTypeUnion } = {
  [GroupAction.activate]: ActionType.positive,
  [GroupAction.dry]: ActionType.negative,
  [GroupAction.shutdown]: ActionType.negative,
  [GroupAction.remove]: ActionType.negative,
};

interface IGroupDialogActionProps {
}

export const GroupDialogAction: React.FC<IGroupDialogActionProps> = () => {
  const {
    id, action, isOpen, isLoading,
  } = useSelector(groupDialogActionSelector);
  const dispatch = useDispatch();

  const onClose = useCallback(() => {
    dispatch(setGroupsDialogAction());
  }, []);

  const onSubmit = useCallback((data) => {
    dispatch(executeGroupsAction({
      ...data,
      id,
      action,
    }));
  }, [id, action]);

  return (
    <DialogAction
      isOpen={isOpen}
      isLoading={isLoading}
      withPasswordConfirm
      actionType={actionTypeMap[action]}
      action={groupActionLabelMap[action]}
      subject="Group"
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
};
