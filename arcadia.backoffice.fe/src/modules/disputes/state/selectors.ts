import { IDisputesSlice } from '../types';

export const disputesReducerSelector = ({ disputesReducer }: IDisputesSlice) => disputesReducer;

export const disputesDialogFormSelector = ({ disputesReducer }: IDisputesSlice) => disputesReducer.dialogForm;
