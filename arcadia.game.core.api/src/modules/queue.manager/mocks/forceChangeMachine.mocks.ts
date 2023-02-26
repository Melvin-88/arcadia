import { MachineEntity, QueueEntity } from 'arcadia-dal';

export const queueManagerSessionsMock: any[] = [
  {
    id: 1,
    machine: {
      queue: {
        id: 55,
      },
    },
  },
];

export function shouldForceChangeMachine(spyTargets: any): void {
  jest.spyOn(spyTargets.sessionRepository, 'createQueryBuilder').mockReturnValue({
    andWhere: () => ({
      leftJoinAndSelect: () => ({
        leftJoinAndSelect: () => ({
          getMany: async () => queueManagerSessionsMock,
        }),
      }),
    }),
  });
  const machineMock = new MachineEntity();
  machineMock.queue = new QueueEntity();
  machineMock.queue.sessions = [];
  machineMock.sessions = queueManagerSessionsMock;
  machineMock.id = 4;
  jest.spyOn(spyTargets.queueManagerService, 'getAvailableMachines').mockResolvedValue([machineMock]);
  jest.spyOn(spyTargets.queueManagerService, 'sendNewQueueData').mockImplementationOnce(() => null);
}
