import { createAction } from '@reduxjs/toolkit';
import {
  GroupAction,
  IGroupDialogActionState,
  IGetGroupsRequestFiltersParams,
  IGroupsNormalizedData,
  IGroupActionRequestBody,
  IGroupDialogFormState,
  IPostGroupRequestBody,
  IPutGroupRequestBody,
} from '../types';

interface IExecuteActionPayload extends IGroupActionRequestBody {
  action: GroupAction
}

export const postGroup = createAction<IPostGroupRequestBody>('GROUPS/POST_GROUP');

export const getGroups = createAction<IGetGroupsRequestFiltersParams>('GROUPS/GET_GROUPS');
export const getGroupsSuccess = createAction<IGroupsNormalizedData>('GROUPS/GET_GROUPS/SUCCESS');
export const getGroupsError = createAction('GROUPS/GET_GROUPS/ERROR');

export const putGroup = createAction<IPutGroupRequestBody>('GROUPS/PUT_GROUP');

export const setGroupsDialogForm = createAction<Partial<IGroupDialogFormState> | undefined>('GROUPS/SET_DIALOG_FORM');
export const mergeGroupsDialogForm = createAction<Partial<IGroupDialogFormState> | undefined>('GROUPS/MERGE_DIALOG_FORM');

export const setGroupsDialogAction = createAction<Partial<IGroupDialogActionState> | undefined>('GROUPS/SET_DIALOG_ACTION');
export const mergeGroupsDialogAction = createAction<Partial<IGroupDialogActionState> | undefined>('GROUPS/MERGE_DIALOG_ACTION');
export const executeGroupsAction = createAction<IExecuteActionPayload>('GROUPS/EXECUTE_ACTION');

export const exportGroups = createAction<IGetGroupsRequestFiltersParams>('GROUPS/EXPORT');
export const exportGroupsSuccess = createAction('GROUPS/EXPORT/SUCCESS');
export const exportGroupsError = createAction('GROUPS/EXPORT/ERROR');
