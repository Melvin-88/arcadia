import { v4 as uuidv4 } from 'uuid';
import { SessionStorageKeys } from '../constants';
import { SessionStatus } from '../types/session';

const generateAndSaveFootprint = () => {
  const footprint = uuidv4();

  sessionStorage.setItem(SessionStorageKeys.footprint, footprint);

  return footprint;
};

export const getFootprint = () => sessionStorage.getItem(SessionStorageKeys.footprint);

export const getOrGenerateFootprint = () => (
  getFootprint() || generateAndSaveFootprint()
);

export const isPlayingSessionStatus = (sessionStatus: SessionStatus) => (
  [SessionStatus.playing, SessionStatus.autoplay, SessionStatus.forcedAutoplay].includes(sessionStatus)
);

export const isBetBehindSessionStatus = (sessionStatus: SessionStatus) => (
  [SessionStatus.viewerBetBehind, SessionStatus.queueBetBehind].includes(sessionStatus)
);

export const isPassiveSessionStatus = (sessionStatus: SessionStatus) => (
  [SessionStatus.queue, SessionStatus.viewer].includes(sessionStatus)
);

export const isAutoplaySessionStatus = (sessionStatus: SessionStatus) => (
  [SessionStatus.autoplay, SessionStatus.forcedAutoplay].includes(sessionStatus)
);
