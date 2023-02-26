import { createAction } from '@reduxjs/toolkit';
import { IAutoplayReducer } from '../types';
import { IAutoplayConfig, TiltMode } from '../../../types/autoplay';

// Review usage BEGIN
export const setAutoplay = createAction<Partial<IAutoplayReducer> | undefined>('AUTOPLAY/SET');
// Review usage END
export const mergeAutoplay = createAction<Partial<IAutoplayReducer>>('AUTOPLAY/MERGE');

export const setAutoplayConfig = createAction<Partial<IAutoplayConfig> | undefined>(
  'AUTOPLAY/CONFIG/SET',
);
export const mergeAutoplayConfig = createAction<Partial<IAutoplayConfig>>('AUTOPLAY/CONFIG/MERGE');

export const setAutoSwingMode = createAction<{ mode: TiltMode }>('AUTOPLAY/SET_AUTO_SWING_MODE');
