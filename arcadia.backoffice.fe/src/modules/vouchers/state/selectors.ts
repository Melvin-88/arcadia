import { IVouchersSlice } from '../types';

export const vouchersReducerSelector = ({ vouchersReducer }: IVouchersSlice) => vouchersReducer;

export const selectedVouchersSelector = ({ vouchersReducer }: IVouchersSlice) => vouchersReducer.selectedVouchers;

export const vouchersRevokeDialogSelector = ({ vouchersReducer }: IVouchersSlice) => vouchersReducer.dialogRevoke;
