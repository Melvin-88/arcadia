import { IPlayersSlice } from '../types';

export const playersReducerSelector = ({ playersReducer }: IPlayersSlice) => playersReducer;

export const playerDialogActionSelector = ({ playersReducer }: IPlayersSlice) => playersReducer.dialogAction;
