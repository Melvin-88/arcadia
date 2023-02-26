import { createAction } from '@reduxjs/toolkit';
import { VoucherId, IVoucher } from '../../../types/voucher';
import { IBuyReducer } from './types';

export const setBuy = createAction<Partial<IBuyReducer> | undefined>('BUY/SET');

export const getVoucher = createAction('BUY/GET_VOUCHER');

export const setVoucher = createAction<IVoucher>('BUY/SET_VOUCHER');

export const mergeBuy = createAction<Partial<IBuyReducer>>('BUY/MERGE');

export const buyRounds = createAction<{ rounds: number; voucherId?: VoucherId | null }>('BUY/BUY_ROUNDS');
