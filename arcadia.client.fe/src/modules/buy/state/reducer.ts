import { createReducer } from '@reduxjs/toolkit';
import { IBuyReducer } from './types';
import { mergeBuy, setBuy, setVoucher } from './actions';

const initialState: IBuyReducer = {
  isOpen: false,
  isLoading: false,
  rounds: 1,
  voucher: {
    voucherId: null,
  },
};

export const buyReducer = createReducer(initialState, (builder) => {
  builder.addCase(setBuy, (state, { payload }) => ({
    ...initialState,
    ...payload,
  }));

  builder.addCase(mergeBuy, (state, { payload }) => ({
    ...state,
    ...payload,
  }));

  builder.addCase(setVoucher, (state, { payload }) => ({
    ...state,
    voucher: {
      ...payload,
    },
  }));
});
