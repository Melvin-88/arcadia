import { createAction } from '@reduxjs/toolkit';
import { ITutorialReducer } from '../types';

export const setTutorial = createAction<Partial<ITutorialReducer>>('TUTORIAL/SET');
