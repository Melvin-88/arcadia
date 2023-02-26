import { Test } from '@nestjs/testing';
import {
  NotAcceptableException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  connectionNames,
  CurrencyConversionRepository,
  getRepositoryToken,
  GroupRepository,
  MachineRepository,
  OperatorRepository,
  PlayerRepository, RngChipPrizeRepository,
  SessionRepository,
  SessionStatus,
} from 'arcadia-dal';
import * as jwt from 'jsonwebtoken';
import * as CacheManager from 'cache-manager';
import { AuthService } from './auth.service';
import { SessionService } from '../session/session.service';
import { OperatorApiClientService } from '../operator.api.client/operator.api.client.service';
import { VideoApiClientService } from '../video.api.client/video.api.client.service';
import {
  operatorAuthFailedMock,
  operatorNotFoundMock,
  shouldReturnTokenMocks,
} from './mocks/authPlayer.mocks';
import { makeTestModule } from './mocks/authPlayerBeforeAll.mock';
import {
  noMachinesExceptionMock,
  shouldReturnSessionDataMock,
} from './mocks/exchangeValidationToken.mocks';

import {
  noSessionDataExceptionMock,
  shouldReturnSessionDataMock as verifyReconnectSessionDataMock,
} from './mocks/verifyReconnect.mocks';
import { shouldReturnGroupIdNoMachines, shouldReturnGroupIdSuccess } from './mocks/groupHardReset.mocks';
import { shouldThrowExceptionNoSession } from './mocks/videoStreamAuth.mocks';
import { IpChecker } from '../ip.checker/ip.checker';
import { REDIS_CACHE } from '../global.cache/redis.cache.module';
import { ConfigValidator } from '../config.validator/configValidator';

jest.mock('../logger/logger.service');
jest.mock('../config/config.service');

describe('Auth service (unit)', () => {
  let authService: AuthService;
  let operatorRepository: OperatorRepository;
  let groupRepository: GroupRepository;
  let machineRepository: MachineRepository;
  let sessionRepository: SessionRepository;
  let operatorApiClientService: OperatorApiClientService;
  let playerRepository: PlayerRepository;
  let cacheManager: CacheManager.Cache;
  let currencyConversionRepository: CurrencyConversionRepository;
  let videoApiClientService: VideoApiClientService;
  let sessionService: SessionService;
  let ipChecker: IpChecker;
  let configValidator: ConfigValidator;
  let rngPrizeRepository: RngChipPrizeRepository;

  beforeAll(
    async (): Promise<void> => {
      const moduleFixture = await makeTestModule();
      authService = moduleFixture.get<AuthService>(AuthService);
      operatorRepository = moduleFixture.get<OperatorRepository>(getRepositoryToken(OperatorRepository, connectionNames.DATA));
      groupRepository = moduleFixture.get<GroupRepository>(getRepositoryToken(GroupRepository, connectionNames.DATA));
      machineRepository = moduleFixture.get<MachineRepository>(getRepositoryToken(MachineRepository, connectionNames.DATA));
      playerRepository = moduleFixture.get<PlayerRepository>(getRepositoryToken(PlayerRepository, connectionNames.DATA));
      sessionRepository = moduleFixture.get<SessionRepository>(getRepositoryToken(SessionRepository, connectionNames.DATA));
      rngPrizeRepository = moduleFixture.get<RngChipPrizeRepository>(getRepositoryToken(RngChipPrizeRepository, connectionNames.DATA));
      operatorApiClientService = moduleFixture.get<OperatorApiClientService>(OperatorApiClientService);
      cacheManager = moduleFixture.get<CacheManager.Cache>(REDIS_CACHE);
      currencyConversionRepository = moduleFixture.get<CurrencyConversionRepository>(getRepositoryToken(CurrencyConversionRepository, connectionNames.DATA));
      videoApiClientService = moduleFixture.get<VideoApiClientService>(VideoApiClientService);
      sessionService = moduleFixture.get<SessionService>(SessionService);
      ipChecker = moduleFixture.get<IpChecker>(IpChecker);
      configValidator = moduleFixture.get<ConfigValidator>(ConfigValidator);
    });

  describe(
    'exchangeValidationToken',
    () => {
      it('should return session data', async () => {
        shouldReturnSessionDataMock({
          playerRepository,
          groupRepository,
          machineRepository,
          authService,
          currencyConversionRepository,
          videoApiClientService,
          sessionService,
          configValidator,
          sessionRepository,
          rngPrizeRepository,
        });
        const payload = {
          operatorId: 1,
          cid: '1',
          sid: '1',
          groupId: 1,
        };
        const token = await jwt.sign(payload, 'muchsecret');
        const result = await authService.exchangeValidationToken(token, 1, '<footprint>');
        expect(result).not.toBe(null);
        expect(result.playerId).toEqual('1');
        expect(result.sessionId).toBe('1');
        expect(result.sessionStatus).toBe(SessionStatus.PLAYING);
        // TODO: More expectation
        expect(result.currency).toBe('usd');
        expect(result.locale).toBe('ru');
        expect(result.stackSize).toBe(1);
        expect(result.stackBuyLimit).toBe(1);
        expect(result.playerDirectRoomId).toBe('room');
        expect(result.robotDirectRoomId).toBe('room');
        expect(result.robotQueueRoomId).toBe('room');
        expect(result.robotQueueRoomId).toBe('room');
        expect(result.video).toMatchObject({
          recorded: true,
        });
        expect(result.machineId).toBe(1);
        expect(result.idleTimeoutSec).toBe(1);
        expect(result.autoplayConfig).toMatchObject({});
        expect(result.wheelAnimationDuration).toBe(1);
        expect(result.machineName).toBe('<machine>');
        expect(result.groupName).toBe('<group>');
        expect(result.betInCash).toBe(10);
      });
      it('should throw exception if no machines in group', async () => {
        noMachinesExceptionMock({ groupRepository, machineRepository });
        try {
          const payload = {
            operatorId: 1,
            cid: '1',
            sid: '1',
            groupId: 1,
          };
          const token = await jwt.sign(payload, 'muchsecret');
          const result = await authService.exchangeValidationToken(token, 1, '<footprint>');
          expect(true).toBe(false);
        } catch (e) {
          expect(e).toBeInstanceOf(NotAcceptableException);
        }
      });
    },
  );

  describe(
    'authPlayer',
    () => {
      it('should return validation token', async (): Promise<void> => {
        shouldReturnTokenMocks({
          operatorRepository,
          groupRepository,
          machineRepository,
          operatorApiClientService,
          playerRepository,
        });
        const result = await authService.authPlayer('<correlationId>', {
          operatorId: 1,
          accessToken: '<token>',
          gameCode: '<code>',
          language: 'en',
          isReal: true,
          partnerId: '<id>',
          playerIP: '1.1.1.1',
          clientVersion: '<ver>',
          os: '<os>',
          deviceType: '<device>',
          browser: '<browser>',
          footprint: '<footprint>',
        });

        expect(result).not.toBe(null);
        expect(result.token).not.toBe(null);
        const payload: any = jwt.decode(result.token);
        expect(payload.operatorId).toEqual(1);
        expect(payload.cid).toEqual('1');
      });
      it('should throw exception if operator is not found or disabled', async () => {
        operatorNotFoundMock({ operatorRepository });
        try {
          await authService.authPlayer('<correlationId>', {
            operatorId: 1,
            accessToken: '<token>',
            gameCode: '<code>',
            language: 'en',
            isReal: true,
            partnerId: '<id>',
            playerIP: '1.1.1.1',
            clientVersion: '<ver>',
            os: '<os>',
            deviceType: '<device>',
            browser: '<browser>',
            footprint: '<footprint>',
          });
          expect(true).toBe(false);
        } catch (e) {
          expect(e).toBeInstanceOf(NotAcceptableException);
        }
      });
      it('should throw exception if operator side auth failed', async () => {
        operatorAuthFailedMock({ operatorRepository, operatorApiClientService });
        try {
          await authService.authPlayer('<correlationId>', {
            operatorId: 1,
            accessToken: '<token>',
            gameCode: '<code>',
            language: 'en',
            isReal: true,
            partnerId: '<id>',
            playerIP: '1.1.1.1',
            clientVersion: '<ver>',
            os: '<os>',
            deviceType: '<device>',
            browser: '<browser>',
            footprint: '<footprint>',
          });
          expect(true).toBe(false);
        } catch (e) {
          expect(e).toBeInstanceOf(UnauthorizedException);
        }
      });
    },
  );

  describe('verifyReconnect', () => {
    it('should return session data', async () => {
      verifyReconnectSessionDataMock({ sessionRepository, videoApiClientService, sessionService, rngPrizeRepository, authService });
      const result = await authService.verifyReconnect(1, '<footprint>');
      expect(result).not.toBe(null);
      expect(result.playerId).toBe('1');
      expect(result.sessionId).toBe('1');
      expect(result.sessionStatus).toBe(SessionStatus.PLAYING);
      expect(result.currency).toBe('usd');
      expect(result.locale).toBe('ru');
      expect(result.stackSize).toBe(1);
      expect(result.stackBuyLimit).toBe(1);
      expect(result.playerDirectRoomId).toBe('room');
      expect(result.robotDirectRoomId).toBe('room');
      expect(result.robotQueueRoomId).toBe('room');
      expect(result.robotQueueRoomId).toBe('room');
      expect(result.video).toBeDefined();
      expect(result.machineId).toBe(1);
      expect(result.idleTimeoutSec).toBe(1);
      expect(result.autoplayConfig).toBeDefined();
      expect(result.wheelAnimationDuration).toBe(1);
      expect(result.machineName).toBe('<machine>');
      expect(result.groupName).toBe('<group>');
      expect(result.betInCash).toBe(322);
    });
    it('should throw exception if session is not found', async () => {
      noSessionDataExceptionMock({ sessionRepository });
      try {
        const result = await authService.verifyReconnect(1, '<footprint>');
        expect(true).toBe(false);
      } catch (e) {
        expect(e).toBeInstanceOf(NotAcceptableException);
      }
    });
  });

  describe('groupHardReset', () => {
    it('should return groupId if there are no machines in group', async () => {
      shouldReturnGroupIdNoMachines({ machineRepository });
      const result = await authService.groupHardReset(1);
      expect(result).toEqual({ groupId: 1 });
    });
    it('should return groupId after successful run', async () => {
      shouldReturnGroupIdSuccess({ machineRepository });
      const result = await authService.groupHardReset(1);
      expect(result).toEqual({ groupId: 1 });
    });
  });

  describe('videoStreamAuth', () => {
    it('should throw exception if token is not found', async () => {
      shouldThrowExceptionNoSession({ sessionRepository });
      try {
        await authService.videoStreamAuth('');
        expect(true).toBe(false);
      } catch (e) {
        expect(e).toBeInstanceOf(UnauthorizedException);
      }
    });
    it('should return 201', async () => {
      await authService.videoStreamAuth('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.iN2pjHBufCB5HR7M4Dbk7Eh4x9c2agL7LZ5DTPt9xE8');
    });
  });
});
