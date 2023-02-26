import { SessionLogSource, SessionStatus } from './types';

export const sessionsLabelMap: { [key in SessionStatus]: string } = {
  [SessionStatus.viewer]: 'Viewer',
  [SessionStatus.playing]: 'Playing',
  [SessionStatus.autoplay]: 'Autoplay',
  [SessionStatus.queue]: 'In Queue',
  [SessionStatus.terminating]: 'Terminating',
  [SessionStatus.completed]: 'Completed',
  [SessionStatus.terminated]: 'Terminated',
  [SessionStatus.forcedAutoplay]: 'Forced Autoplay',
  [SessionStatus.viewerBetBehind]: 'Viewer Bet Behind',
  [SessionStatus.queueBetBehind]: 'Queue Bet Behind',
  [SessionStatus.reBuy]: 'reBuy',
};

export const sessionLogSourceLabelMap: { [key in SessionLogSource]: string } = {
  [SessionLogSource.player]: 'Player',
  [SessionLogSource.robot]: 'Robot',
  [SessionLogSource.game]: 'Game',
};
