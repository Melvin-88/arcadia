import { Test } from '@nestjs/testing';
import {
  CacheModule, INestApplication, ValidationPipe,
} from '@nestjs/common';
import * as request from 'supertest';
import { AppLogger } from '../logger/logger.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

jest.mock('./auth.service');
jest.mock('../logger/logger.service');

describe('Auth Controller (unit)', () => {
  let app: INestApplication;
  let authService: AuthService;
  let authController: AuthController;

  beforeAll(
    async (): Promise<void> => {
      const moduleFixture = await Test.createTestingModule({
        imports: [CacheModule.register()],
        controllers: [AuthController],
        providers: [
          AuthService,
          AppLogger,
        ],
      }).compile();
      app = moduleFixture.createNestApplication();
      app.useGlobalPipes(
        new ValidationPipe({
          whitelist: true,
        }),
      );
      await app.init();
      authService = moduleFixture.get<AuthService>(AuthService);
      authController = moduleFixture.get<AuthController>(AuthController);
    });

  beforeEach(
    () => {
      jest.restoreAllMocks();
    },
  );

  describe(
    'createValidationToken',
    () => {
      it('should return error', (): void => request(app.getHttpServer())
        .post('/v1/auth/')
        .send({})
        .expect(400)
        .then(response => {
          expect(authService.authPlayer).toBeCalledTimes(0);
        }));

      it('should return 201', (): void => request(app.getHttpServer())
        .post('/v1/auth/')
        .send({
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
        })
        .expect(201)
        .then(response => {
          expect(authService.authPlayer).toBeCalledTimes(1);
        }));
    },
  );

  describe('exchangeValidationToken', () => {
    it('should return error', (): void => request(app.getHttpServer())
      .post('/v1/auth/verify/')
      .send({})
      .expect(400)
      .then(response => {
        expect(authService.exchangeValidationToken).toBeCalledTimes(0);
      }));

    it('should return 201', (): void => request(app.getHttpServer())
      .post('/v1/auth/verify/')
      .send({
        groupId: 1,
        token: '<token>',
        footprint: '<footprint>',
      })
      .expect(201)
      .then(response => {
        expect(authService.exchangeValidationToken).toBeCalledTimes(1);
      }));
  });

  describe('verifyReconnect', () => {
    it('should return error', (): void => request(app.getHttpServer())
      .post('/v1/auth/reconnect/')
      .send({})
      .expect(400)
      .then(response => {
        expect(authService.verifyReconnect).toBeCalledTimes(0);
      }));

    it('should return 201', (): void => request(app.getHttpServer())
      .post('/v1/auth/reconnect/')
      .send({
        sessionId: 1,
        footprint: '<footprint>',
      })
      .expect(201)
      .then(response => {
        expect(authService.verifyReconnect).toBeCalledTimes(1);
      }));
  });

  describe('groupHardReset', () => {
    it('should return error', () => request(app.getHttpServer())
      .post('/v1/auth/groupHardReset/')
      .send({})
      .expect(400)
      .then(response => {
        expect(authService.groupHardReset).toBeCalledTimes(0);
      }));

    it('should return 201', () => request(app.getHttpServer())
      .post('/v1/auth/groupHardReset/')
      .send({
        groupId: 1,
      })
      .expect(201)
      .then(response => {
        expect(authService.groupHardReset).toBeCalledTimes(1);
      }));
  });

  describe('videoStreamAuth', () => {
    it('should return error', () => request(app.getHttpServer())
      .post('/v1/auth/videoStreamAuth/')
      .send({})
      .expect(400)
      .then(response => {
        expect(authService.videoStreamAuth).toBeCalledTimes(0);
      }));

    it('should return 201', () => request(app.getHttpServer())
      .post('/v1/auth/videoStreamAuth/')
      .send({
        token: '<token>',
      })
      .expect(201)
      .then(response => {
        expect(authService.videoStreamAuth).toBeCalledTimes(1);
      }));
  });
});
