import React, { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { CommandBar, ICommandBarItems, AddIcon } from 'arcadia-common-fe';
import { setOperatorDialogForm } from '../../state/actions';

export const OperatorsCommandBar = () => {
  const dispatch = useDispatch();

  const handleAdd = useCallback(() => {
    dispatch(setOperatorDialogForm({
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
