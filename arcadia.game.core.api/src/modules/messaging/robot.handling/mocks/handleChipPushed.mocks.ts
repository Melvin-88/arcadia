import { PHANTOM_CHIP_TYPE_NAME } from '../../../../constants/phantom.type';

export const handleChipPushedMachineMock = {
  id: 1,
  serial: '<serial>',
  site: {
    id: 5,
  },
  configuration: {
    rtpSegment: '<rtpSegment>',
  },
  group: {
    getChipConfig: () => [{ type: 'a', value: 10 }],
  },
  getAllowedChipTypes: () => ['a'],
  dispensers: [{
    id: 'x',
    chipType: {
      id: 'a',
    },
    level: 12,
  }],
};

export const handleChipPushedChipMock = {
  value: 10,
  rfid: '<rfid>',
  site: {
    id: 5,
  },
  type: {
    id: 'a',
    name: '<name>',
  },
};

export const handleChipPushedPhantomSeedMock = {
  value: 12,
  type: 'scatter',
};

export function shouldSetChipMachine(spyTargets: any): void {
  jest.spyOn(spyTargets.machineRepository, 'findOneOrFail').mockResolvedValue(handleChipPushedMachineMock);
  jest.spyOn(spyTargets.chipRepository, 'findOneOrFail').mockResolvedValue(handleChipPushedChipMock);
}

export function shouldHandlePhantomChip(spyTargets: any): void {
  const phantomChipMock = { ...handleChipPushedChipMock };
  phantomChipMock.type.name = PHANTOM_CHIP_TYPE_NAME;
  jest.spyOn(spyTargets.machineRepository, 'findOneOrFail').mockResolvedValue(handleChipPushedMachineMock);
  jest.spyOn(spyTargets.chipRepository, 'findOneOrFail').mockResolvedValue(phantomChipMock);
  jest.spyOn(spyTargets.rngService, 'phantom').mockResolvedValue(handleChipPushedPhantomSeedMock);
}