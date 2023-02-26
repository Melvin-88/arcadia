export enum SessionEndReason {
  NORMAL = 'normal',
  FORCED_TERMINATION = 'forcedTermination',
  CHANGE_BET = 'changeBet',
  VIEWER_DISCONNECTED = 'viewerDisconnected',
  FINALIZE_SESSION = 'finalizeSession',
  WALLET_TRANSACTION_ERROR = 'walletTransactionError',
}
