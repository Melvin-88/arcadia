import { IReportsSlice } from '../../../types';

export const processedReportsSelector = ({ rootReportsReducer }: IReportsSlice) => rootReportsReducer.processedReportsReducer;
