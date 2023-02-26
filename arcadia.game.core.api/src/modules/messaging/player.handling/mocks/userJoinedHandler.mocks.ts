import { SessionStatus } from 'arcadia-dal';

export function shouldNotifyQueueUpdate(spyTargets: any): void {
  jest.spyOn(spyTargets.sessionRepository, 'findOne').mockReturnValue(Promise.resolve({ status: SessionStatus.PLAYING }));
}


export function shouldHandleReconnect(spyTargets: any): void {
  jest.spyOn(spyTargets.sessionRepository, 'findOne').mockReturnValue(Promise.resolve({ status: SessionStatus.FORCED_AUTOPLAY }));
}
