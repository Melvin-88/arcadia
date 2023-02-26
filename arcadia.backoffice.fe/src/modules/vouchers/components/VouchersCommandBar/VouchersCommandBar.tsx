import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CommandBar, ICommandBarItems, VoucherStatus } from 'arcadia-common-fe';
import DismissIcon from '../../../../assets/svg/dismiss.svg';
import { vouchersReducerSelector } from '../../state/selectors';
import { setVouchersRevokeDialog } from '../../state/actions';

export const VouchersCommandBar = () => {
  const dispatch = useDispatch();
  const { selectedVouchers, entities } = useSelector(vouchersReducerSelector);

  const handleRevoke = useCallback(() => {
    dispatch(setVouchersRevokeDialog({ isOpen: true }));
  }, []);

  const isRevokeDisabled = useMemo(() => (
    !selectedVouchers.length || !selectedVouchers.some((id) => (
      entities[id].status === VoucherStatus.pending
    ))
  ), [entities, selectedVouchers]);

  const items: ICommandBarItems = useMemo(() => [
    {
      text: 'Revoke',
      Icon: DismissIcon,
      disabled: isRevokeDisabled,
      onClick: handleRevoke,
    },
  ], [handleRevoke, isRevokeDisabled]);

  return (
    <CommandBar items={items} />
  );
};
