import { createAction } from '@reduxjs/toolkit';
import {
  HistoryType, IGetHistoryRequestBody, IGetHistoryResponseBody, HistoryId,
} from '../types';

interface IHistoryDataActionPayload extends Partial<IGetHistoryResponseBody> {
  id: HistoryId
  historyType: HistoryType
  filterParams?: { [key: string]: string }
}

export const getHistoryData = createAction<IGetHistoryRequestBody>('HISTORY/GET_HISTORY_DATA');
export const getHistoryDataSuccess = createAction<IHistoryDataActionPayload>('HISTORY/GET_HISTORY_DATA/SUCCESS');
export const getHistoryDataError = createAction('HISTORY/GET_HISTORY_DATA/ERROR');

export const resetHistory = createAction('HISTORY/RESET');

export const exportHistory = createAction<IGetHistoryRequestBody>('HISTORY/EXPORT');
export const exportHistorySuccess = createAction('HISTORY/EXPORT/SUCCESS');
export const exportHistoryError = createAction('HISTORY/EXPORT/ERROR');
