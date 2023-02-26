export const handleDisengagedSessionMock = {
  id: 1,
  createDate: '2020-09-10T10:00:00',
  player: {
    cid: '<cid>',
  },
  queue: {
    id: 5,
  },
  machine: {
    id: 11,
    queue: {
      id: 5,
    },
    serial: '<serial>',
    configuration: {
      rtpSegment: '<rtpSegment>',
    },
    chips: [],
    group: {
      id: 45,
      configuration: {
        minimal_hold: {
          value: 1,
        },
      },
    },
  },
};

export function shouldDisengagePlayer(spyTargets: any): void {
  jest.spyOn(spyTargets.sessionRepository, 'findOne').mockResolvedValue(handleDisengagedSessionMock);
  jest.spyOn(spyTargets.machineRepository, 'findOne').mockResolvedValue(handleDisengagedSessionMock.machine);
  jest.spyOn(spyTargets.robotMessageService, 'startSeeding').mockImplementationOnce(() => Promise.resolve());
}
