import { IDashboardSlice } from '../types';

export const dashboardReducerSelector = ({ dashboardReducer }: IDashboardSlice) => dashboardReducer;

export const dashboardStatisticsSelector = ({ dashboardReducer }: IDashboardSlice) => dashboardReducer.statistics;

export const voucherDialogFormSelector = ({ dashboardReducer }: IDashboardSlice) => dashboardReducer.voucherDialogForm;
