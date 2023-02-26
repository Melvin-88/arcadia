export enum VideoPlayerType {
  CSRTCPlayer = 'CSRTCPlayer',
  HLSPlayer = 'HLSPlayer'
}

export enum HLSVideoPlayerStatus { // https://docs.videojs.com/player
  waiting = 'waiting',
  abort = 'abort',
  canplay = 'canplay',
  canplaythrough = 'canplaythrough',
  emptied = 'emptied',
  ended = 'ended',
  error = 'error',
  firstplay = 'firstplay',
  loadstart = 'loadstart',
  pause = 'pause',
  play = 'play',
  playing = 'playing',
  progress = 'progress',
  stalled = 'stalled',
  suspend = 'suspend',
}

export enum CSRTCVideoPlayerStatus {
  FAILED = 'FAILED',
  NEW = 'NEW',
  NOT_ENOUGH_BANDWIDTH = 'NOT_ENOUGH_BANDWIDTH',
  PAUSED = 'PAUSED',
  PENDING = 'PENDING',
  PLAYBACK_PROBLEM = 'PLAYBACK_PROBLEM',
  PLAYING = 'PLAYING',
  PUBLISHING = 'PUBLISHING',
  RESIZE = 'RESIZE',
  SNAPSHOT_COMPLETE = 'SNAPSHOT_COMPLETE',
  STOPPED = 'STOPPED',
  UNPUBLISHED = 'UNPUBLISHED',
}

export interface CSRTCVideoPlayerStatusChangeEvent {
  type: VideoPlayerType.CSRTCPlayer;
  status: CSRTCVideoPlayerStatus;
}

export interface HLSVideoPlayerStatusChangeEvent {
  type: VideoPlayerType.HLSPlayer;
  status: HLSVideoPlayerStatus;
}

export type IVideoStreamStatusChangeEvent =
  CSRTCVideoPlayerStatusChangeEvent |
  HLSVideoPlayerStatusChangeEvent;
