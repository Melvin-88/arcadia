import React, { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { CommandBar, ICommandBarItems, AddIcon } from 'arcadia-common-fe';
import { setGroupsDialogForm } from '../../state/actions';

export const GroupsCommandBar = () => {
  const dispatch = useDispatch();

  const handleAdd = useCallback(() => {
    dispatch(setGroupsDialogForm({
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
