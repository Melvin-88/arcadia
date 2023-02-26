export interface VoucherInterface {
  status: string;
  id: string;
  operatorName: string;
  playerCid: string;
  groupName: string;
  sessionId: number;
  grantedDate: string;
  expirationDate: string;
  revocationReason?: string;
}
