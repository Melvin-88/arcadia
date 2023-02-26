export enum WorkerMessage {
  PLAYER_IDLE_START = 'playerIdleStart', // Start player idle timer
  PLAYER_IDLE_RESET = 'playerIdleReset', // Reset player idle timer
  PLAYER_IDLE_STOP = 'playerIdleStop', // Removes player idle timer
  PLAYER_GRACE_START = 'playerGraceStart', // Start player grace timer
  PLAYER_GRACE_STOP = 'playerGraceStop', // Removes player grace timer
  PLAYER_ENGAGE_START = 'playerEngageStart', // Start player engage timer
  PLAYER_ENGAGE_STOP = 'playerEngageStop', // Removes player engage timer
  JACKPOT_RELOGIN_START = 'jackpotReloginStart', // Start jackpot service retry authorization timer
  JACKPOT_RELOGIN_STOP = 'jackpotReloginStop', // Removes jackpot service retry authorization timer
  PHANTOM_DELAY_START = 'phantomDelayStart',
  ROUND_END_DELAY_START = 'roundEndDelayStart',
  ROUND_END_DELAY_STOP = 'roundEndDelayStop',
  QUEUE_CHANGE_OFFERS = 'queueChangeOffers',
}
