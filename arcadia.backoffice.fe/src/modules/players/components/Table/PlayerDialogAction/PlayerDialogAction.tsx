import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DialogSection } from 'arcadia-common-fe';
import {
  ActionType,
  ActionTypeUnion,
  DialogAction,
} from '../../../../../components/dialogs/DialogAction/DialogAction';
import { playerActionLabelMap } from '../../../constants';
import { PlayerAction } from '../../../types';
import { playerDialogActionSelector } from '../../../state/selectors';
import { executePlayersAction, setPlayersDialogAction } from '../../../state/actions';
import { BlockingReasonField } from '../../../../../components/fields/BlockingReasonField';
import './PlayerDialogAction.scss';

const actionTypeMap: { [key in PlayerAction]: ActionTypeUnion } = {
  [PlayerAction.unblock]: ActionType.positive,
  [PlayerAction.block]: ActionType.negative,
};

interface IPlayerDialogActionProps {
}

export const PlayerDialogAction: React.FC<IPlayerDialogActionProps> = () => {
  const {
    id, action, isOpen, isLoading,
  } = useSelector(playerDialogActionSelector);
  const dispatch = useDispatch();

  const onClose = useCallback(() => {
    dispatch(setPlayersDialogAction());
  }, []);

  const onSubmit = useCallback((data) => {
    dispatch(executePlayersAction({
      id,
      action,
      reason: data.reason,
    }));
  }, [id, action]);

  return (
    <DialogAction
      isOpen={isOpen}
      isLoading={isLoading}
      actionType={actionTypeMap[action]}
      action={playerActionLabelMap[action]}
      subject="Player"
      onClose={onClose}
      onSubmit={onSubmit}
    >
      {
        action === PlayerAction.block && (
          <DialogSection>
            <BlockingReasonField className="player-dialog-action__blocking-reason" isRequired />
          </DialogSection>
        )
      }
    </DialogAction>
  );
};
