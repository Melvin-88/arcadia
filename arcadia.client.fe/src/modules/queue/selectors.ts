import { IQueueStoreSlice } from './types';

export const queueSelector = ({ queueReducer }: IQueueStoreSlice) => queueReducer;

export const queueLeaveDialogSelector = ({ queueReducer }: IQueueStoreSlice) => queueReducer.queueLeaveDialog;
