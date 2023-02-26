import { SessionStatus } from 'arcadia-dal';

export const getActiveGroupsMock = [
  {
    machines: [
      {
        queue: {
          id: 15,
          sessions: [
            { status: SessionStatus.QUEUE },
            { status: SessionStatus.QUEUE },
            { status: SessionStatus.QUEUE },
            {
              status: SessionStatus.QUEUE,
              player: {
                cid: '<cid>',
              },
            },
          ],
        },
      },
      { queue: { id: 1, sessions: [{ status: SessionStatus.QUEUE }] } },
    ],
  },
];

export const getQueueLengthMock = [
  {
    operatorId: 1,
    queueId: 15,
    queueLength: 4,
    denominator: 1,
  },
  {
    operatorId: 1,
    queueId: 1,
    queueLength: 1,
    denominator: 1,
  },
];

export const findQueuesByIdMock = [
  {
    id: 15,
    sessions: [
      { status: SessionStatus.QUEUE, offeredQueueId: 1, buyDate: new Date('2021-01-15T09:30') },
      { status: SessionStatus.QUEUE, offeredQueueId: 1, buyDate: new Date('2021-01-15T09:30') },
      { status: SessionStatus.QUEUE, offeredQueueId: 1, buyDate: new Date('2021-01-15T09:30') },
      {
        status: SessionStatus.QUEUE,
        id: 42,
        player: {
          cid: '<cid>',
        },
        buyDate: new Date('2021-01-15T09:30'),
      },
    ],
  },
  { id: 1, sessions: [{ status: SessionStatus.QUEUE, buyDate: new Date('2021-01-15T09:35') }] },
];

export function shouldSendUpdateQueueStatus(spyTargets: any): void {
  jest.spyOn(spyTargets.groupRepository, 'getActiveGroupsWithActiveQueues').mockResolvedValue(getActiveGroupsMock);
  jest.spyOn(spyTargets.queueRepository, 'getQueueLengthData').mockResolvedValue(getQueueLengthMock);
  jest.spyOn(spyTargets.queueRepository, 'findByIds').mockResolvedValue(findQueuesByIdMock);
}
