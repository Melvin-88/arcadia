import { createAction } from '@reduxjs/toolkit';
import { IChangeBetReducer } from '../types';
import { IGroups } from '../../../types/group';

export const mergeChangeBet = createAction<Partial<IChangeBetReducer>>('CHANGE_BET/MERGE');
export const setGroups = createAction<{groups: IGroups}>('CHANGE_BET/SET_GROUPS');
export const getGroups = createAction('CHANGE_BET/GET_GROUPS');
