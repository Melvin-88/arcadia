import { createAction } from '@reduxjs/toolkit';
import { IDialogJSONViewer } from './types';

export const setDialogJSONViewer = createAction<Partial<IDialogJSONViewer> | undefined>('DIALOG_JSON_VIEWER/SET');
export const mergeDialogJSONViewer = createAction<Partial<IDialogJSONViewer> | undefined>('DIALOG_JSON_VIEWER/MERGE');
