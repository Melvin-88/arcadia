import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DialogSection } from 'arcadia-common-fe';
import {
  ActionType,
  ActionTypeUnion,
  DialogAction,
} from '../../../../../components/dialogs/DialogAction/DialogAction';
import { executeOperatorsAction, setOperatorsDialogAction } from '../../../state/actions';
import { operatorDialogActionSelector, operatorsReducerSelector } from '../../../state/selectors';
import { OperatorAction } from '../../../types';
import { operatorActionLabelMap } from '../../../constants';
import { PasswordConfirmField } from '../../../../../components/fields/PasswordConfirmField';
import './OperatorDialogAction.scss';

const actionTypeMap: { [key in OperatorAction]: ActionTypeUnion } = {
  [OperatorAction.enable]: ActionType.positive,
  [OperatorAction.disable]: ActionType.negative,
  [OperatorAction.remove]: ActionType.negative,
};

interface IOperatorDialogActionProps {
}

export const OperatorDialogAction: React.FC<IOperatorDialogActionProps> = () => {
  const {
    id, action, isOpen, isLoading,
  } = useSelector(operatorDialogActionSelector);
  const { operators } = useSelector(operatorsReducerSelector);
  const dispatch = useDispatch();

  const onClose = useCallback(() => {
    dispatch(setOperatorsDialogAction());
  }, []);

  const currentOperator = useMemo(() => operators.find((operator) => operator.id === id), [operators, id]);

  const onSubmit = useCallback((data) => {
    dispatch(executeOperatorsAction({
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
      action={operatorActionLabelMap[action]}
      subject="Operator"
      topContent={
        action === OperatorAction.disable && (
          <DialogSection>
            <div className="operator-dialog-action__active-sessions">
              <div className="operator-dialog-action__active-sessions-label">Active sessions</div>
              <div className="operator-dialog-action__active-sessions-value">
                {currentOperator && currentOperator.activeSessionsCount}
              </div>
            </div>
          </DialogSection>
        )
      }
      bottomContent={
        action === OperatorAction.remove && (
          <DialogSection>
            <div className="operator-dialog-action__field">
              <div className="operator-dialog-action__field-label">Password confirmation</div>
              <PasswordConfirmField label="" />
            </div>
          </DialogSection>
        )
      }
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
};
