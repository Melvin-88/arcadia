export const handleChipValidationMachineMock = {
  id: 1,
  serial: '<serial>',
  site: {
    id: 5,
  },
  group: {
    getChipConfig: () => [{ type: 'a', value: 10 }],
  },
  configuration: {
    rtpSegment: '<rtpSegment>',
  },
  getAllowedChipTypes: () => ['a'],
};

export const handleChipValidationChipMock = {
  value: 10,
  site: {
    id: 5,
  },
  type: {
    name: 'a',
  },
};
