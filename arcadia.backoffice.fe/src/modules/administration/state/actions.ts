import { createAction } from '@reduxjs/toolkit';
import {
  AdministrationAction,
  IAdministrationActionRequestBody,
  IAdministrationDialogActionState,
  IAdministrationDialogEditPassword,
  IAdministrationEditPasswordRequestBody,
  IAdministrationDialogFormState,
  IGetAdministrationRequestFiltersParams,
  IGetAdministrationResponseBody,
  IPostAdministrationRequestBody,
  IPutAdministrationRequestBody,
  IAdministrationDialogRegisterChips,
  IDisqualifyChipsPayload,
  IAdministrationDialogDisqualifyChips,
  IRegisterChipsRequestBody,
  IFindChipPayload,
  IAdministrationDialogFindChip,
  IAdministrationDialogUserActions,
  IGetUserActionsPayload,
} from '../types';

interface IExecuteActionPayload extends IAdministrationActionRequestBody {
  action: AdministrationAction
}

export const postAdministration = createAction<IPostAdministrationRequestBody>('ADMINISTRATION/POST_ADMINISTRATION');

export const getAdministration = createAction<IGetAdministrationRequestFiltersParams>('ADMINISTRATION/GET_ADMINISTRATION');
export const getAdministrationSuccess = createAction<IGetAdministrationResponseBody>('ADMINISTRATION/GET_ADMINISTRATION/SUCCESS');
export const getAdministrationError = createAction('ADMINISTRATION/GET_ADMINISTRATION/ERROR');

export const putAdministration = createAction<IPutAdministrationRequestBody>('ADMINISTRATION/PUT_ADMINISTRATION');

export const setAdministrationDialogForm = createAction<Partial<IAdministrationDialogFormState> | undefined>(
  'ADMINISTRATION/SET_DIALOG_FORM',
);
export const mergeAdministrationDialogForm = createAction<Partial<IAdministrationDialogFormState> | undefined>(
  'ADMINISTRATION/MERGE_DIALOG_FORM',
);

export const setAdministrationDialogAction = createAction<Partial<IAdministrationDialogActionState> | undefined>(
  'ADMINISTRATION/SET_DIALOG_ACTION',
);
export const mergeAdministrationDialogAction = createAction<Partial<IAdministrationDialogActionState> | undefined>(
  'ADMINISTRATION/MERGE_DIALOG_ACTION',
);
export const executeAdministrationAction = createAction<IExecuteActionPayload>('ADMINISTRATION/EXECUTE_ACTION');

export const setAdministrationDialogEditPassword = createAction<Partial<IAdministrationDialogEditPassword> | undefined>(
  'ADMINISTRATION/SET_PASSWORD_DIALOG',
);
export const mergeAdministrationDialogEditPassword = createAction<Partial<IAdministrationDialogEditPassword> | undefined>(
  'ADMINISTRATION/MERGE_PASSWORD_DIALOG',
);
export const administrationEditPassword = createAction<IAdministrationEditPasswordRequestBody>('ADMINISTRATION/EDIT_PASSWORD');

export const setAdministrationDialogRegisterChips = createAction<Partial<IAdministrationDialogRegisterChips> | undefined>(
  'ADMINISTRATION/SET_DIALOG_REGISTER_CHIPS',
);
export const mergeAdministrationDialogRegisterChips = createAction<Partial<IAdministrationDialogRegisterChips> | undefined>(
  'ADMINISTRATION/MERGE_DIALOG_REGISTER_CHIPS',
);
export const administrationRegisterChips = createAction<IRegisterChipsRequestBody>('ADMINISTRATION/REGISTER_CHIPS');

export const setAdministrationDialogDisqualifyChips = createAction<Partial<IAdministrationDialogDisqualifyChips> | undefined>(
  'ADMINISTRATION/SET_DIALOG_DISQUALIFY_CHIPS',
);
export const mergeAdministrationDialogDisqualifyChips = createAction<Partial<IAdministrationDialogDisqualifyChips> | undefined>(
  'ADMINISTRATION/MERGE_DIALOG_DISQUALIFY_CHIPS',
);
export const administrationDisqualifyChips = createAction<IDisqualifyChipsPayload>('ADMINISTRATION/DISQUALIFY_CHIPS');

export const setAdministrationDialogFindChip = createAction<Partial<IAdministrationDialogFindChip> | undefined>(
  'ADMINISTRATION/SET_DIALOG_FIND_CHIP',
);
export const mergeAdministrationDialogFindChip = createAction<Partial<IAdministrationDialogFindChip> | undefined>(
  'ADMINISTRATION/MERGE_DIALOG_FIND_CHIP',
);
export const administrationFindChip = createAction<IFindChipPayload>('ADMINISTRATION/FIND_CHIP');

export const getUserActions = createAction<IGetUserActionsPayload>('ADMINISTRATION/GET_USER_ACTIONS');

export const setAdministrationDialogUserActions = createAction<Partial<IAdministrationDialogUserActions> | undefined>(
  'ADMINISTRATION/SET_DIALOG_USER_ACTIONS',
);
export const mergeAdministrationDialogUserActions = createAction<Partial<IAdministrationDialogUserActions> | undefined>(
  'ADMINISTRATION/MERGE_DIALOG_USER_ACTIONS',
);

export const exportAdministrationUserActions = createAction<IGetUserActionsPayload>('ADMINISTRATION/USER_ACTIONS_EXPORT');
export const exportAdministrationUserActionsSuccess = createAction('ADMINISTRATION/USER_ACTIONS_EXPORT/SUCCESS');
export const exportAdministrationUserActionsError = createAction('ADMINISTRATION/USER_ACTIONS_EXPORT/ERROR');

export const exportAdministration = createAction<IGetAdministrationRequestFiltersParams>('ADMINISTRATION/EXPORT');
export const exportAdministrationSuccess = createAction('ADMINISTRATION/EXPORT/SUCCESS');
export const exportAdministrationError = createAction('ADMINISTRATION/EXPORT/ERROR');
