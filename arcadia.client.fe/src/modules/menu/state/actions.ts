import { createAction } from '@reduxjs/toolkit';
import { IMenuReducer } from '../types';

export const setMenu = createAction<Partial<IMenuReducer>>('MENU/SET');
