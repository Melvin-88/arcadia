import * as CacheManager from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/common';
import {
  connectionNames,
  SessionEntity,
  SessionRepository,
  getRepositoryToken,
  PlayerEntity,
  GroupEntity,
  MachineEntity,
  QueueEntity,
  SessionStatus,
  OperatorEntity,
  SessionArchiveRepository,
  RoundArchiveRepository, RoundRepository,
} from 'arcadia-dal';
import { doc } from 'prettier';
import { PlayerClientService } from '../player.client/player.client.service';
import { makeTestModule } from './mocks/beforeAll.mock';
import { SessionService } from './session.service';
import { saveAndArchiveSessionMock, shouldSaveAndArchiveSession } from './mocks/saveAndArchive.mocks';
import group = doc.builders.group;

type CacheType = ReturnType<typeof CacheManager.caching>;

describe('Session Service (Unit)', () => {
  let sessionService: SessionService;
  let cacheManager: CacheType;
  let sessionRepository: SessionRepository;
  let playerClientService: PlayerClientService;
  let sessionArchiveRepository: SessionArchiveRepository;
  let roundArchiveRepository: RoundArchiveRepository;
  let roundRepository: RoundRepository;

  beforeAll(async () => {
    const moduleFixture = await makeTestModule();
    sessionService = moduleFixture.get<SessionService>(SessionService);
    cacheManager = moduleFixture.get<CacheType>(CACHE_MANAGER);
    sessionRepository = moduleFixture.get<SessionRepository>(getRepositoryToken(SessionRepository, connectionNames.DATA));
    sessionArchiveRepository = moduleFixture.get<SessionArchiveRepository>(getRepositoryToken(SessionArchiveRepository, connectionNames.DATA));
    roundArchiveRepository = moduleFixture.get<RoundArchiveRepository>(getRepositoryToken(RoundArchiveRepository, connectionNames.DATA));
    roundRepository = moduleFixture.get<RoundRepository>(getRepositoryToken(RoundRepository, connectionNames.DATA));

    playerClientService = moduleFixture.get<PlayerClientService>(PlayerClientService);
  });

  describe('findByIdCached', () => {
    it('should return session from cache', async () => {
      const sessionMock = new SessionEntity();
      jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(sessionMock);
      const result = await sessionService.findByIdCached(1);
      expect(result).toMatchObject(sessionMock);
    });
    it('should return session from db', async () => {
      const sessionMock = new SessionEntity();
      jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(null);
      jest.spyOn(sessionRepository, 'findOne').mockResolvedValue(sessionMock);
      const result = await sessionService.findByIdCached(1);
      expect(result).toMatchObject(sessionMock);
    });
  });

  describe('create', () => {
    it('should create session', async () => {
      const playerMock = new PlayerEntity();
      const groupMock = new GroupEntity();
      const machineMock = new MachineEntity();
      const queueMock = {};
      // @ts-ignore
      machineMock.queue = queueMock;
      const expectedSession: any = {
        os: '<os>',
        sessionDescription: {},
        configuration: {},
        player: playerMock,
        group: groupMock,
        machine: machineMock,
        queue: queueMock,
      };
      jest.spyOn(sessionRepository, 'create').mockImplementation((e: SessionEntity) => e);
      const saveSpy = jest.spyOn(sessionRepository, 'save').mockImplementation((e: SessionEntity) => Promise.resolve(e));
      const savedSession = await sessionService.create({ os: '<os>', playerIP: '1.1.1.1' }, playerMock, groupMock, machineMock);
      expect(savedSession).toMatchObject(expect.objectContaining(expectedSession));
      expect(saveSpy).toBeCalledWith(expect.objectContaining(expectedSession), { transaction: false });
    });
  });

  describe('saveAndArchive', () => {
    it('should save and archive session', async () => {
      shouldSaveAndArchiveSession({
        sessionRepository, sessionArchiveRepository, roundRepository, roundArchiveRepository,
      });
      const sessionArchiveSaveSpy = jest.spyOn(sessionArchiveRepository, 'save');
      const roundsArchiveSaveSpy = jest.spyOn(roundArchiveRepository, 'save');
      const roundsDeleteSpy = jest.spyOn(roundRepository, 'delete');
      const sessionDelete = jest.spyOn(sessionRepository, 'delete');
      await sessionService.saveAndArchive(saveAndArchiveSessionMock, false);
      expect(sessionArchiveSaveSpy)
        .toBeCalledWith(expect.objectContaining({ id: saveAndArchiveSessionMock.id }), { reload: false, transaction: false });
      expect(roundsArchiveSaveSpy).toBeCalledWith([expect.objectContaining({ id: 21 })], { reload: false, transaction: false });
      expect(roundsDeleteSpy).toBeCalledWith([saveAndArchiveSessionMock.rounds[0].id]);
      expect(sessionDelete).toBeCalledWith({ id: saveAndArchiveSessionMock.id });
    });
  });

  describe('finalizeSessions', () => {
    it('should archive sessions and return players to lobby', async done => {
      const sessionMock = new SessionEntity();
      sessionMock.id = 5;
      sessionMock.player = new PlayerEntity();
      sessionMock.player.cid = '12';
      jest.spyOn(sessionRepository, 'findByIds').mockResolvedValue([sessionMock]);
      const updateSpy = jest.spyOn(sessionRepository, 'update');
      const saveAndArchiveSpy = jest.spyOn(sessionService, 'saveAndArchive').mockImplementationOnce(() => null);
      const notifyReturnToLobbySpy = jest.spyOn(playerClientService, 'notifyReturnToLobby');
      await sessionService.finalizeSession(1, true);
      setTimeout(() => {
        expect(updateSpy).toBeCalledWith(sessionMock.id, { status: SessionStatus.TERMINATED });
        expect(saveAndArchiveSpy).toBeCalledWith(sessionMock, true);
        expect(notifyReturnToLobbySpy).toBeCalledWith(sessionMock.player.cid);
        done();
      }, 2000);
    });
  });

  describe('getAutoplayConfig', () => {
    it('should return autoplay config from operator', async () => {
      const operatorMock = new OperatorEntity();
      operatorMock.configuration = { autoplay: { test: 'test' } };
      const result = SessionService.getAutoplayConfig(null, operatorMock);
      expect(result).toMatchObject(operatorMock.configuration.autoplay);
    });
    it('should return autoplay config from group', async () => {
      const operatorMock = new OperatorEntity();
      const groupMock = new GroupEntity();
      groupMock.configuration = { autoplay: { test1: 'test1' } };
      const result = SessionService.getAutoplayConfig(groupMock, operatorMock);
      expect(result).toMatchObject(groupMock.configuration.autoplay);
    });
  });
});
