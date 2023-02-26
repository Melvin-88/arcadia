import { IAdministrationSlice } from '../types';

export const administrationReducerSelector = ({ administrationReducer }: IAdministrationSlice) => administrationReducer;

export const administrationDialogFormSelector = ({ administrationReducer }: IAdministrationSlice) => administrationReducer.dialogForm;

export const administrationDialogActionSelector = ({ administrationReducer }: IAdministrationSlice) => administrationReducer.dialogAction;

export const administrationDialogEditPassword = ({ administrationReducer }: IAdministrationSlice) => (
  administrationReducer.dialogEditPassword
);

export const administrationDialogRegisterChipsSelector = ({ administrationReducer }: IAdministrationSlice) => (
  administrationReducer.dialogRegisterChips
);

export const administrationDialogDisqualifyChipsSelector = ({ administrationReducer }: IAdministrationSlice) => (
  administrationReducer.dialogDisqualifyChips
);

export const administrationDialogFindChipSelector = ({ administrationReducer }: IAdministrationSlice) => (
  administrationReducer.dialogFindChip
);

export const administrationDialogUserActionsSelector = ({ administrationReducer }: IAdministrationSlice) => (
  administrationReducer.dialogUserActions
);
