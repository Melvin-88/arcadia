import { createAction } from '@reduxjs/toolkit';
import { IBetBehindReducer } from '../types';
import { IBetBehindConfig } from '../../../types/betBehind';

export const enableBetBehind = createAction<{ config: IBetBehindConfig }>('BET_BEHIND/ENABLE');
export const disableBetBehind = createAction('BET_BEHIND/DISABLE');

export const mergeBetBehind = createAction<Partial<IBetBehindReducer>>('BET_BEHIND/MERGE');

export const setBetBehindConfig = createAction<IBetBehindConfig>('BET_BEHIND/CONFIG/SET');
export const mergeBetBehindConfig = createAction<Partial<IBetBehindConfig>>('BET_BEHIND/CONFIG/MERGE');
