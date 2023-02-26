import { createAction } from '@reduxjs/toolkit';
import { IGetProcessedReportRequestFiltersParams } from '../../../types';
import { IGetPlayerStatsReportResponseBody } from '../types';

export const clearPlayerStatsReport = createAction('REPORT/CLEAR_PLAYER_STATS');

export const getPlayerStatsReport = createAction<IGetProcessedReportRequestFiltersParams>('REPORT/GET_PLAYER_STATS');
export const getPlayerStatsReportSuccess = createAction<IGetPlayerStatsReportResponseBody>('REPORT/GET_PLAYER_STATS/SUCCESS');
export const getPlayerStatsReportError = createAction('REPORT/GET_PLAYER_STATS/ERROR');

export const exportPlayerStatsReport = createAction<IGetProcessedReportRequestFiltersParams>('REPORT/EXPORT_PLAYER_STATS');
export const exportPlayerStatsReportSuccess = createAction('REPORT/EXPORT_PLAYER_STATS/SUCCESS');
export const exportPlayerStatsReportError = createAction('REPORT/EXPORT_PLAYER_STATS/ERROR');
