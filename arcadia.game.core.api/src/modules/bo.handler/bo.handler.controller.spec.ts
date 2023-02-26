import { CacheModule, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppLogger } from '../logger/logger.service';
import { BoHandlerService } from './bo.handler.service';
import { BoHandlerController } from './bo.handler.controller';

jest.mock('./bo.handler.service');
jest.mock('../logger/logger.service');

describe('BO Handler Controller (Unit)', () => {
  let app: INestApplication;
  let boHandlerService: BoHandlerService;
  let boHandlerController: BoHandlerController;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [CacheModule.register()],
      controllers: [BoHandlerController],
      providers: [
        BoHandlerService,
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
    boHandlerController = moduleFixture.get<BoHandlerController>(BoHandlerController);
    boHandlerService = moduleFixture.get<BoHandlerService>(BoHandlerService);
  });

  beforeEach(
    () => {
      jest.restoreAllMocks();
    },
  );

  describe('groupSoftStop', () => {
    it('should return error if group id is not number', () => request(app.getHttpServer())
      .post('/v1/backoffice/group/notanumber/softStop')
      .send({})
      .expect(400)
      .then(response => {
        expect(boHandlerService.groupSoftStopHandler).toBeCalledTimes(0);
      }));

    it('should return error if GroupStopDto validation fails', () => request(app.getHttpServer())
      .post('/v1/backoffice/group/1/softStop')
      .send({ machineIds: ['a', 'b'] })
      .expect(400)
      .then(response => {
        expect(boHandlerService.groupSoftStopHandler).toBeCalledTimes(0);
      }));

    it('should return 201', () => request(app.getHttpServer())
      .post('/v1/backoffice/group/1/softStop')
      .send({})
      .expect(201)
      .then(response => {
        expect(boHandlerService.groupSoftStopHandler).toBeCalledTimes(1);
      }));
  });

  describe('groupHardStop', () => {
    it('should return error if group id is not number', () => request(app.getHttpServer())
      .post('/v1/backoffice/group/notanumber/hardStop')
      .send({})
      .expect(400)
      .then(response => {
        expect(boHandlerService.groupHardStopHandler).toBeCalledTimes(0);
      }));

    it('should return error if GroupStopDto validation fails', () => request(app.getHttpServer())
      .post('/v1/backoffice/group/1/hardStop')
      .send({ machineIds: ['a', 'b'] })
      .expect(400)
      .then(response => {
        expect(boHandlerService.groupHardStopHandler).toBeCalledTimes(0);
      }));

    it('should return 201', () => request(app.getHttpServer())
      .post('/v1/backoffice/group/1/hardStop')
      .send({})
      .expect(201)
      .then(response => {
        expect(boHandlerService.groupHardStopHandler).toBeCalledTimes(1);
      }));
  });
});
