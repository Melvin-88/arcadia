import { createAction } from '@reduxjs/toolkit';
import { IGetProcessedReportRequestFiltersParams } from '../../../types';
import { IGetMachineStatusReportResponseBody } from '../types';

export const clearMachineStatusReport = createAction('REPORT/CLEAR_MACHINE_STATUS');

export const getMachineStatusReport = createAction<IGetProcessedReportRequestFiltersParams>('REPORT/GET_MACHINE_STATUS');
export const getMachineStatusReportSuccess = createAction<IGetMachineStatusReportResponseBody>('REPORT/GET_MACHINE_STATUS/SUCCESS');
export const getMachineStatusReportError = createAction('REPORT/GET_MACHINE_STATUS/ERROR');

export const exportMachineStatusReport = createAction<IGetProcessedReportRequestFiltersParams>('REPORT/EXPORT_MACHINE_STATUS');
export const exportMachineStatusReportSuccess = createAction('REPORT/EXPORT_MACHINE_STATUS/SUCCESS');
export const exportMachineStatusReportError = createAction('REPORT/EXPORT_MACHINE_STATUS/ERROR');
