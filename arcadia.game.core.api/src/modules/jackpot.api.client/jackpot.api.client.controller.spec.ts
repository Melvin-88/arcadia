import { CacheModule, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { JackpotApiClientService } from './jackpot.api.client.service';
import { JackpotApiClientController } from './jackpot.api.client.controller';
import { AppLogger } from '../logger/logger.service';
import { PlayerClientService } from '../player.client/player.client.service';
import { RobotClientService } from '../robot.client/robot.client.service';
import { SessionService } from '../session/session.service';

jest.mock('./jackpot.api.client.service');
jest.mock('../logger/logger.service');

describe('Jackpot Client Controller (Unit)', () => {
  let app: INestApplication;
  let jackpotApiClientService: JackpotApiClientService;
  let jackpotApiClientController: JackpotApiClientController;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [CacheModule.register()],
      controllers: [JackpotApiClientController],
      providers: [
        JackpotApiClientService,
        AppLogger,
        {
          useValue: {},
          provide: PlayerClientService,
        },
        {
          useValue: {},
          provide: RobotClientService,
        },
        {
          useValue: {},
          provide: SessionService,
        },
      ],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();

    jackpotApiClientController = moduleFixture.get<JackpotApiClientController>(JackpotApiClientController);
    jackpotApiClientService = moduleFixture.get<JackpotApiClientService>(JackpotApiClientService);
  });

  beforeEach(
    () => {
      jest.restoreAllMocks();
    },
  );

  describe('win', () => {
    it('should return error', (): void => request(app.getHttpServer())
      .post('/v1/jackpots/win')
      .send({})
      .expect(400)
      .then(response => {
        expect(jackpotApiClientService.jackpotWinCallback).toBeCalledTimes(0);
      }));
    it('should return 201', (): void => request(app.getHttpServer())
      .post('/v1/jackpots/win')
      .send({
        winnerDetails: {
          gameId: '<id>',
          hasExtraPayments: false,
          eventId: '<id>',
          jackpotType: '<type>',
          operatorId: '<id>',
          playerCurrency: 'usd',
          jackpotGameId: '<id>',
          playerId: '<id>',
          potId: '<id>',
          seed: '<seed>',
          name: '<name>',
          amountInCurrency: [{ amount: '1', currency: 'usd', rate: '1' }],
          segments: ['s'],
          winTimestamp: '2020-09-10T09:00:00',
          extraFields: {},
        },
      })
      .expect(201)
      .then(response => {
        expect(jackpotApiClientService.jackpotWinCallback).toBeCalledTimes(1);
      }));
  });
});
