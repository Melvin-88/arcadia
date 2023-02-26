import React, { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { CommandBar, ICommandBarItems, AddIcon } from 'arcadia-common-fe';
import { setMonitoringDialogForm } from '../../state/actions';

export const MonitoringCommandBar = () => {
  const dispatch = useDispatch();

  const handleAdd = useCallback(() => {
    dispatch(setMonitoringDialogForm({
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
