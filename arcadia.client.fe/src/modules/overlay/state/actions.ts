import { createAction } from '@reduxjs/toolkit';
import { IOverlayReducer } from '../types';

export const mergeOverlay = createAction<Partial<IOverlayReducer>>('OVERLAY/MERGE');
