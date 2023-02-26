import { IOperatorsSlice } from '../types';

export const operatorsReducerSelector = ({ operatorsReducer }: IOperatorsSlice) => operatorsReducer;

export const operatorDialogActionSelector = ({ operatorsReducer }: IOperatorsSlice) => operatorsReducer.dialogAction;

export const operatorDialogFormSelector = ({ operatorsReducer }: IOperatorsSlice) => operatorsReducer.dialogForm;
