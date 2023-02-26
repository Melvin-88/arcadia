import { MachineStatus } from 'arcadia-dal';

export const seedingStrategyOnIdleMachineMock = {
  getAllowedChipTypes: () => [],
  id: 1,
  status: MachineStatus.PREPARING,
  serial: '<serial>',
  group: { id: 11 },
  configuration: {
    dispensers: {
      d1: { chip_type: 'a', capacity: 100 },
    },
  },
};

export function shouldSendChipMapStartSeeding(spyTargets: any): void {
  // @ts-ignore
  jest.spyOn(spyTargets.machineRepository, 'findOneOrFail').mockResolvedValueOnce(seedingStrategyOnIdleMachineMock);
  // @ts-ignore
  jest.spyOn(spyTargets.chipRepository, 'getChipMapForEmul').mockResolvedValue([{ rfid: '<rfid>', value: 5, type: { name: 'a' } }]);
  jest.spyOn(spyTargets.chipRepository, 'find').mockResolvedValue([]);
}