export enum BusEventType {
  DEFAULT = 'event',
  BET_BEHIND_WIN = 'betBehindWin',
  BET_BEHIND_ROUND_END = 'betBehindRoundEnd',
  BET_BEHIND_ROUND_START = 'betBehindRoundStart',
  FINALIZE_SESSION = 'finalizeSession',
  ROUND_END = 'roundEnd',
  JACKPOT_CONTRIBUTE = 'jackpotContribute',
  TERMINATE_SESSION = 'terminateSession',
  ENGAGE_SESSION = 'engageSession',
  CHANGE_QUEUE = 'changeQueue',
  QUEUE_UPDATES = 'queueUpdates',
}
