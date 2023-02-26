import {
  connectionNames,
  getRepositoryToken,
  GroupEntity,
  RoundArchiveEntity,
  RoundArchiveRepository,
  RoundEntity,
  RoundRepository,
} from 'arcadia-dal';
import { makeTestModule } from './mocks/beforeAll.rngHelper.mock';
import { RngClientService } from './rng.client.service';
import { RngHelper } from './rng.helper';

const mockMath = Object.create(global.Math);
mockMath.random = () => 0.5;
global.Math = mockMath;

describe('Rng Helper (Unit)', () => {
  let rngHelper: RngHelper;
  let roundRepository: RoundRepository;
  let roundArchiveRepository: RoundArchiveRepository;
  let rngClientService: RngClientService;

  beforeAll(async () => {
    const moduleFixture = await makeTestModule();
    rngHelper = moduleFixture.get<RngHelper>(RngHelper);
    roundRepository = moduleFixture.get<RoundRepository>(getRepositoryToken(RoundRepository, connectionNames.DATA));
    roundArchiveRepository = moduleFixture.get<RoundArchiveRepository>(getRepositoryToken(RoundArchiveRepository, connectionNames.DATA));
    rngClientService = moduleFixture.get<RngClientService>(RngClientService);
  });

  describe('calcRtp', () => {
    it('should calculate rtp data', async () => {
      jest.spyOn(roundRepository, 'find').mockResolvedValue([new RoundEntity()]);
      jest.spyOn(roundArchiveRepository, 'find').mockResolvedValue([new RoundArchiveEntity()]);
      jest.spyOn(rngClientService, 'rtp').mockResolvedValue([['a', 5]]);
      const groupMock = new GroupEntity();
      groupMock.stackSize = 3;
      const machineMock = {
        id: 3,
        serial: '<serial>',
        configuration: {
          rtpSegment: '<rtp>',
        },
      };
      // @ts-ignore
      const result = await rngHelper.calcRtp(groupMock, machineMock);
      expect(result).toStrictEqual([{ afterCoin: 2, types: ['a', 'a', 'a', 'a', 'a'] }]);
    });
  });
});
