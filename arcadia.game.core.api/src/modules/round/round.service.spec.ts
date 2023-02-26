import {
  RoundRepository, getRepositoryToken, connectionNames, RoundEntity, RoundType, RoundStatus,
} from 'arcadia-dal';
import { RoundService } from './round.service';
import { makeTestModule } from './mocks/beforeAll.mock';
import { RngHelper } from '../rng.service.client/rng.helper';

describe('Round Service (Unit)', () => {
  let roundService: RoundService;
  let rngHelper: RngHelper;
  let roundRepository: RoundRepository;

  beforeAll(async () => {
    const moduleFixture = await makeTestModule();
    roundService = moduleFixture.get<RoundService>(RoundService);
    rngHelper = moduleFixture.get<RngHelper>(RngHelper);
    roundRepository = moduleFixture.get<RoundRepository>(getRepositoryToken(RoundRepository, connectionNames.DATA));
  });

  describe('createRound', () => {
    it('should create round', async () => {
      const roundMock = new RoundEntity();
      const groupMock = { stackSize: 5, denominator: 55 };
      const machineMock = { id: 12 };
      jest.spyOn(rngHelper, 'calcRtp').mockResolvedValue(null);
      // @ts-ignore
      const createSpy = jest.spyOn(roundRepository, 'create').mockReturnValue(roundMock);
      const saveSpy = jest.spyOn(roundRepository, 'save');
      // @ts-ignore
      await roundService.createRound({}, machineMock, groupMock);
      expect(saveSpy).toBeCalledWith(roundMock);
      expect(createSpy).toBeCalledWith({
        type: RoundType.REGULAR,
        status: RoundStatus.ACTIVE,
        coins: groupMock.stackSize,
        bet: groupMock.denominator,
        session: {},
        rtp: null,
        machineId: machineMock.id,
        isAutoplay: false,
      });
    });
  });
});