import { EventType } from '../modules/coreClient/enum';
import { groupPushDropByRfid } from './groupPushDropEventsByRfid';
import { EventLog } from '../modules/schemas';

const testSequence = [
  {
    parameters: { rfid: 'junk1' },
    createdDate: 1608814672,
    type: EventType.CHIP_DROP,
  },
  {
    parameters: { rfid: 'junk2' },
    createdDate: 1608814775,
    type: EventType.CHIP_DROP,
  },
  {
    parameters: { rfid: 'test' },
    createdDate: 1608814789,
    type: EventType.CHIP_ADDED,
  },
  {
    parameters: { rfid: 'junk3' },
    createdDate: 1608814855,
    type: EventType.CHIP_DROP,
  },
  {
    parameters: { rfid: 'junk4' },
    createdDate: 1608814865,
    type: EventType.CHIP_ADDED,
  },
  {
    parameters: { rfid: 'test' },
    createdDate: 1608814895,
    type: EventType.CHIP_DROP,
  },
  {
    parameters: { rfid: 'junk5' },
    createdDate: 1608814902,
    type: EventType.CHIP_ADDED,
  },
  {
    parameters: { rfid: 'test2' },
    createdDate: 1608815897,
    type: EventType.CHIP_ADDED,
  },
  {
    parameters: { rfid: 'junk6' },
    createdDate: 1608816009,
    type: EventType.CHIP_DROP,
  },
  {
    parameters: { rfid: 'junk7' },
    createdDate: 1608816016,
    type: EventType.CHIP_ADDED,
  },
  {
    parameters: { rfid: 'test2' },
    createdDate: 1608816108,
    type: EventType.CHIP_DROP,
  },
];

describe('groupPushDropEventsByRfid', () => {
  it('should group data correctly', () => {
    // @ts-ignore
    const result = groupPushDropByRfid(testSequence.filter(e => e.type === EventType.CHIP_DROP),
      testSequence.filter(e => e.type === EventType.CHIP_ADDED));
    const expectedResult = [
      { rfid: 'test', pushedAt: 1608814789, droppedAt: 1608814895 },
      { rfid: 'test2', pushedAt: 1608815897, droppedAt: 1608816108 },
    ];
    expect(result).toMatchObject(expectedResult);
  });
  it('should not fail with empty array', () => {
    const result = groupPushDropByRfid([], []);
    expect(result).toMatchObject([]);
  });
});
