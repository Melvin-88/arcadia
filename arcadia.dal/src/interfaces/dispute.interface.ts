export interface DisputeInterface {
  status: string;
  id: number;
  operatorId: number;
  operatorName: string;
  playerCid: string;
  sessionId: number;
  rebateSum: number;
  rebateCurrency: string;
  openedAtDate: string;
  updatedAtDate?: string;
  closedAtDate?: string;
  complaint: string;
  discussion: string;
}
