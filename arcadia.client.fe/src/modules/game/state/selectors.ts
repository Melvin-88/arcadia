import { IGameReducerStoreSlice } from '../types';

export const gameSelector = ({ gameReducer }: IGameReducerStoreSlice) => (
  gameReducer
);
