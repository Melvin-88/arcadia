import { IQueue } from '../../types/queue';

export interface IQueueLeaveDialog {
  isOpen: boolean;
}

export interface IQueueReducer extends IQueue {
  queueLeaveDialog: IQueueLeaveDialog;
}

export interface IQueueStoreSlice {
  queueReducer: IQueueReducer;
}
