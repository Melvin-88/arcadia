import { IGroupsSlice } from '../types';

export const groupsReducerSelector = ({ groupsReducer }: IGroupsSlice) => groupsReducer;

export const groupDialogActionSelector = ({ groupsReducer }: IGroupsSlice) => groupsReducer.dialogAction;

export const groupDialogFormSelector = ({ groupsReducer }: IGroupsSlice) => groupsReducer.dialogForm;
