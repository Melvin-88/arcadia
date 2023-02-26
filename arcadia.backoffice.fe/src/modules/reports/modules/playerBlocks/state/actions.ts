import { createAction } from '@reduxjs/toolkit';
import { IGetProcessedReportRequestFiltersParams } from '../../../types';
import { IGetPlayerBlocksReportResponseBody } from '../types';

export const clearPlayerBlocksReport = createAction('REPORT/CLEAR_PLAYER_BLOCKS');

export const getPlayerBlocksReport = createAction<IGetProcessedReportRequestFiltersParams>('REPORT/GET_PLAYER_BLOCKS');
export const getPlayerBlocksReportSuccess = createAction<IGetPlayerBlocksReportResponseBody>('REPORT/GET_PLAYER_BLOCKS/SUCCESS');
export const getPlayerBlocksReportError = createAction('REPORT/GET_PLAYER_BLOCKS/ERROR');

export const exportPlayerBlocksReport = createAction<IGetProcessedReportRequestFiltersParams>('REPORT/EXPORT_PLAYER_BLOCKS');
export const exportPlayerBlocksReportSuccess = createAction('REPORT/EXPORT_PLAYER_BLOCKS/SUCCESS');
export const exportPlayerBlocksReportError = createAction('REPORT/EXPORT_PLAYER_BLOCKS/ERROR');
