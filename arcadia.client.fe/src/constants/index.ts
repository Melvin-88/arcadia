export const { API_ENDPOINT } = process.env;

export enum SessionStorageKeys {
  accessToken = 'accessToken',
  socketURL = 'socketURL',
  sessionId = 'sessionId',
  footprint = 'footprint',
  playerId = 'playerId',
  blueRibbonAccessToken = 'blueRibbonAccessToken',
  sessionStatus = 'sessionStatus',
  autoplayConfig = 'autoplayConfig',
  betBehindConfig = 'betBehindConfig',
  soundsConfig = 'soundsConfig',
  idleTimeoutStartTimestamp = 'idleTimeoutStartTimestamp',
  homeUrl = 'homeUrl'
}

export const NOTIFICATION_OVERLAY_AUTO_HIDE_DELAY = 1500;

export const PHANTOM_CHIP_TYPE = 'phantom';

export const PHANTOM_CHIP_SCATTER_ROUND_VALUE = -1;
