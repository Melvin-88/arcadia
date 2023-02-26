export const startSeedingMachineMock = {
  id: 1,
  serial: '<serial>',
  group: {
    id: 42,
    configuration: {
      minimal_hold: {
        value: 322,
      },
    },
  },
  chips: [
    {
      rfid: '<rfid>',
      type: {
        id: 1,
        name: 'a',
      },
    },
  ],
  configuration: {
    rtpSegment: '<rtpSegment>',
    dispensers: {
      d1: {
        chip_type: 'a',
        capacity: 100,
      },
      d2: {
        chip_type: 'b',
        capacity: 50,
      },
    },
  },
};

export function shouldPushChips(spyTargets: any): void {
  jest.spyOn(spyTargets.machineRepository, 'findOne').mockResolvedValue(startSeedingMachineMock);
  jest.spyOn(spyTargets.rngService, 'seed').mockResolvedValue([['a', 5], ['b', 10]]);
}
