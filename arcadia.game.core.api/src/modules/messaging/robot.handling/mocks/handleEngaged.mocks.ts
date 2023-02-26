import { RoundStatus } from 'arcadia-dal';

export const handleEngagedSessionMock = {
  id: 51,
  rounds: [{
    status: RoundStatus.ACTIVE,
    coins: 10,
  }],
  machine: {
    serial: '<serial>',
  },
  player: {
    cid: '<cid>',
  },
  queue: {
    id: 75,
  },
};

export function shouldSendAutoplaySessionDisconnected(spyTargets: any): void {
  jest.spyOn(spyTargets.sessionRepository, 'findOne').mockResolvedValue({ ...handleEngagedSessionMock, isDisconnected: true });
}

export function shouldStartIdleNotifyQueue(spyTargets: any): void {
  jest.spyOn(spyTargets.sessionRepository, 'findOne').mockResolvedValue(handleEngagedSessionMock);
}