import { IVoucher } from '../../../types/voucher';

export interface IBuyReducer {
  isOpen: boolean;
  isLoading: boolean;
  rounds: number;
  voucher: IVoucher;
}

export interface IBuyReducerSlice {
  buyReducer: IBuyReducer;
}
