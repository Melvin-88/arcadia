import { createAction } from '@reduxjs/toolkit';
import { IGameRulesReducer } from '../types';

export const setGameRules = createAction<Partial<IGameRulesReducer>>('GAME_RULES/SET');
