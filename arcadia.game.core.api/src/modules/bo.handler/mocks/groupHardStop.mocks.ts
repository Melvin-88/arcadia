import { QueueStatus, RoundStatus, SessionStatus } from 'arcadia-dal';

export function shouldThrowExceptionNoGroup(spyTargets: any): void {
  jest.spyOn(spyTargets.groupRepository, 'findOne').mockReturnValue(Promise.resolve(null));
}

export function shouldThrowExceptionNoMachine(spyTargets: any): void {
  jest.spyOn(spyTargets.groupRepository, 'findOne').mockReturnValue(Promise.resolve({
    machines: null,
  }));
}

export function shouldStopMachines(spyTargets: any): void {
  jest.spyOn(spyTargets.groupRepository, 'findOne').mockReturnValue(Promise.resolve({
    machines: [{
      id: 1,
      queue: {
        id: 10,
        status: QueueStatus.IN_PLAY,
        sessions: [{ id: 1, status: SessionStatus.PLAYING, rounds: [{ status: RoundStatus.ACTIVE }] },
          { id: 2, status: SessionStatus.PLAYING, rounds: [{ status: RoundStatus.ACTIVE }] }],
      },
    },
    {
      id: 2,
      queue: {
        id: 20,
        status: QueueStatus.IN_PLAY,
        sessions: [],
      },
    },
    {
      id: 3,
      queue: {
        id: 30,
        status: QueueStatus.IN_PLAY,
        sessions: [
          { id: 3, status: SessionStatus.PLAYING },
          { id: 4, status: SessionStatus.PLAYING, rounds: [{ status: RoundStatus.ACTIVE }] },
        ],
      },
    }],
  }));
}

export function shouldRefundActiveSessions(spyTargets: any): void {
  jest.spyOn(spyTargets.sessionRepository, 'createQueryBuilder').mockImplementation(() => ({
    update: () => ({
      set: () => ({
        where: () => ({
          execute: () => Promise.resolve(),
        }),
      }),
    }),
  }));
}