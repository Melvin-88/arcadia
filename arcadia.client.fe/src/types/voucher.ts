export type VoucherId = number;

export interface IVoucher {
  voucherId: VoucherId | null;
  expirationDate?: string;
}
