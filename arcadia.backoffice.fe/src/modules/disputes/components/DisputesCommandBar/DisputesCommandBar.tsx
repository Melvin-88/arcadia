import React, { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { CommandBar, ICommandBarItems, AddIcon } from 'arcadia-common-fe';
import { setDisputeDialogForm } from '../../state/actions';

export const DisputesCommandBar = () => {
  const dispatch = useDispatch();

  const handleAdd = useCallback(() => {
    dispatch(setDisputeDialogForm({
      isOpen: true,
    }));
  }, []);

  const items: ICommandBarItems = useMemo(() => [
    { text: 'Add', Icon: AddIcon, onClick: handleAdd },
  ], [handleAdd]);

  return (
    <CommandBar items={items} />
  );
};
