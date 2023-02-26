import React, { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { CommandBar, ICommandBarItems, AddIcon } from 'arcadia-common-fe';
import {
  setAdministrationDialogDisqualifyChips,
  setAdministrationDialogForm,
  setAdministrationDialogRegisterChips,
  setAdministrationDialogFindChip,
} from '../../state/actions';

export const AdministrationCommandBar = () => {
  const dispatch = useDispatch();

  const handleAdd = useCallback(() => {
    dispatch(setAdministrationDialogForm({
      isOpen: true,
    }));
  }, []);

  const handleRegisterChips = useCallback(() => {
    dispatch(setAdministrationDialogRegisterChips({
      isOpen: true,
    }));
  }, []);

  const handleDisqualifyChips = useCallback(() => {
    dispatch(setAdministrationDialogDisqualifyChips({
      isOpen: true,
    }));
  }, []);

  const handleFindChip = useCallback(() => {
    dispatch(setAdministrationDialogFindChip({
      isOpen: true,
    }));
  }, []);

  const items: ICommandBarItems = useMemo(() => [
    { text: 'Add', Icon: AddIcon, onClick: handleAdd },
    { text: 'Register Chips', onClick: handleRegisterChips },
    { text: 'Disqualify Chips', onClick: handleDisqualifyChips },
    { text: 'Find Chip', onClick: handleFindChip },
  ], [handleAdd, handleRegisterChips, handleDisqualifyChips, handleFindChip]);

  return (
    <CommandBar items={items} />
  );
};
