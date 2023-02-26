import React, { useCallback } from 'react';
import {
  Form,
  Button,
  Dialog,
  DialogType,
  TextField,
} from 'arcadia-common-fe';
import { useDispatch, useSelector } from 'react-redux';
import { administrationDialogFindChipSelector } from '../../state/selectors';
import { administrationFindChip, setAdministrationDialogFindChip } from '../../state/actions';
import { AdministrationTableFindChip } from './AdministrationTableFindChip/AdministrationTableFindChip';
import './AdministrationDialogFindChip.scss';

interface IAdministrationDialogFindChipProps {
}

export const AdministrationDialogFindChip: React.FC<IAdministrationDialogFindChipProps> = () => {
  const dispatch = useDispatch();
  const {
    isOpen, isLoading, chips, total,
  } = useSelector(administrationDialogFindChipSelector);

  const onFiltersSubmit = useCallback((data) => {
    dispatch(administrationFindChip(data));
  }, []);

  const handleClose = useCallback(() => {
    dispatch(setAdministrationDialogFindChip());
  }, []);

  return (
    <Dialog
      className="administration-dialog-find-chip"
      dialogType={DialogType.wide}
      title="Find Chip"
      isOpen={isOpen}
      onClose={handleClose}
    >
      <Form
        onSubmit={onFiltersSubmit}
        render={({ handleSubmit }) => (
          <form
            className="administration-dialog-find-chip-form"
            onSubmit={handleSubmit}
          >
            <div className="administration-dialog-find-chip-form__body">
              <TextField name="term" label="RFID" isRequired />
            </div>
            <div className="administration-dialog-find-chip-form__controls">
              <Button
                className="administration-dialog-find-chip-form__btn"
                color="tertiary"
                type="submit"
                isLoading={isLoading}
              >
                Find
              </Button>
            </div>
          </form>
        )}
      />
      <AdministrationTableFindChip
        chips={chips}
        total={total}
      />
    </Dialog>
  );
};
