import { IReportsSlice } from '../types';

export const reportsReducerSelector = ({ rootReportsReducer }: IReportsSlice) => rootReportsReducer.reportsReducer;
