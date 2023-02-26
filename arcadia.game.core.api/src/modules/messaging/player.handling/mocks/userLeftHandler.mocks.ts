import { SessionStatus } from 'arcadia-dal';

export function shouldMarkDisconnected(spyTargets: any): void {
  jest.spyOn(spyTargets.sessionRepository, 'findOne').mockReturnValue(Promise.resolve({ id: 1, status: SessionStatus.PLAYING }));
}