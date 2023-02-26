import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AdministrationAction } from '../../../types';
import {
  ActionType,
  ActionTypeUnion,
  DialogAction,
} from '../../../../../components/dialogs/DialogAction/DialogAction';
import { administrationDialogActionSelector, administrationReducerSelector } from '../../../state/selectors';
import { administrationActionLabelMap } from '../../../constants';
import { setAdministrationDialogAction, executeAdministrationAction } from '../../../state/actions';

const actionTypeMap: { [key in AdministrationAction]: ActionTypeUnion } = {
  [AdministrationAction.enable]: ActionType.positive,
  [AdministrationAction.disable]: ActionType.negative,
  [AdministrationAction.remove]: ActionType.negative,
};

interface IAdministrationDialogActionProps {
}

export const AdministrationDialogAction: React.FC<IAdministrationDialogActionProps> = () => {
  const { users } = useSelector(administrationReducerSelector);
  const {
    id, action, isOpen, isLoading,
  } = useSelector(administrationDialogActionSelector);
  const dispatch = useDispatch();

  const message = useMemo(() => {
    if (action === AdministrationAction.remove) {
      const user = users.find((item) => item.id === id);

      return `Remove ${user?.userName} (this action cannot be undone)?`;
    }

    return undefined;
  }, [action, id]);

  const onClose = useCallback(() => {
    dispatch(setAdministrationDialogAction());
  }, []);

  const onSubmit = useCallback((data) => {
    dispatch(executeAdministrationAction({
      ...data,
      id,
      action,
    }));
  }, [id, action]);

  return (
    <DialogAction
      isOpen={isOpen}
      isLoading={isLoading}
      message={message}
      withPasswordConfirm
      actionType={actionTypeMap[action]}
      action={administrationActionLabelMap[action]}
      subject="User"
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
};
