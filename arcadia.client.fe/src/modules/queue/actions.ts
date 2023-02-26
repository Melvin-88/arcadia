import { createAction } from '@reduxjs/toolkit';
import { IQueueLeaveDialog } from './types';
import { IQueue } from '../../types/queue';

export const setQueue = createAction<IQueue>('QUEUE/SET_QUEUE');

export const setQueueLeaveDialog = createAction<IQueueLeaveDialog>('QUEUE/SET_QUEUE_LEAVE_DIALOG');

export const leaveQueue = createAction('QUEUE/LEAVE_QUEUE');
