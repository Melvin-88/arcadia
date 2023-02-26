export enum SubscribeEventType {
  connect = 'connect',
  restoreConnection = 'restoreConnection',
  sessionState = 'sessionState',
  login = 'login',
  queue = 'queue',
  buy = 'buy',
  reBuy = 'reBuy',
  remainingCoins = 'remainingCoins',
  roundStart = 'roundStart',
  robot2player = 'robot2player',
  win = 'win',
  phantom = 'phantom',
  sessionResult = 'sessionResult',
  resetIdleTimeout = 'resetIdleTimeout',
  balance = 'balance',
  totalWin = 'totalWin',
  autoplay = 'autoplay',
  voucher = 'voucher',
  bets = 'bets',
  disconnect = 'disconnect',
  leaveQueue = 'leaveQueue',
  shortestQueueProposal = 'shortestQueueProposal',
  notification = 'notification',
  returnToLobby = 'returnToLobby'
}

export enum EmitEventType {
  login = 'login',
  restoreConnection = 'restoreConnection',
  buy = 'buy',
  init = 'init',
  openFire = 'openFire',
  ceaseFire = 'ceaseFire',
  setAngle = 'setAngle',
  enableAutoplay = 'enableAutoplay',
  disableAutoplay = 'disableAutoplay',
  enableBetBehind = 'enableBetBehind',
  disableBetBehind = 'disableBetBehind',
  setSwingMode = 'setSwingMode',
  balance = 'balance',
  voucher = 'voucher',
  cancelStacks = 'cancelStacks',
  listbets = 'listbets',
  quit = 'quit',
  leaveQueue = 'leaveQueue',
  readyForNextRound = 'readyForNextRound'
}

export enum PubSubUserEventNotification {
  orientationChanged = 'orientationChanged',
  menuClicked = 'menuClicked',
  menuClosed = 'menuClosed',
  settingsUpdate = 'settingsUpdate',
  lostFocus = 'lostFocus',
  regainedFocus = 'regainedFocus',
  video = 'video'
}
