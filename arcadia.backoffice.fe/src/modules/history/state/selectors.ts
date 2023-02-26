import { IHistorySlice } from '../types';

export const historySelector = ({ historyReducer }: IHistorySlice) => historyReducer;
