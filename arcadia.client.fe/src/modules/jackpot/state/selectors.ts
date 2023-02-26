import { IJackpotReducerStoreSlice } from '../types';

export const jackpotSelector = ({ jackpotReducer }: IJackpotReducerStoreSlice) => (
  jackpotReducer
);
