import { Test } from '@nestjs/testing';
import { CacheModule, INestApplication, ValidationPipe } from '@nestjs/common';
import {
  ClientRMQ, ClientsModule, RmqContext, Transport,
} from '@nestjs/microservices';
import { ValidationError } from 'class-validator';
import { AppLogger } from '../../logger/logger.service';
import { PlayerMessageController } from './player.message.controller';
import { PlayerMessageService } from './player.message.service';
import { SessionService } from '../../session/session.service';
import { RobotMessageService } from '../robot.handling/robot.message.service';
import { PlayerClientService } from '../../player.client/player.client.service';
import { RobotClientService } from '../../robot.client/robot.client.service';
import { ServerRMQ } from '../../rmq.server/rmq.server';
import { PLAYER_TO_CORE_QUEUE } from '../../../constants/rabbit.constants';

jest.mock('./player.message.service');
jest.mock('./player.message.service');
jest.mock('../../logger/logger.service');
jest.mock('../../session/session.service');
jest.mock('../robot.handling/robot.message.service');
jest.mock('../../player.client/player.client.service');
jest.mock('../../robot.client/robot.client.service');

describe('Player Message Controller (Unit)', () => {
  let app: INestApplication;
  let playerMessageController: PlayerMessageController;
  let playerMessageService: PlayerMessageService;
  let rabbitMQStartegy: ServerRMQ;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [CacheModule.register(),
        ClientsModule.register([{ name: 'rmqClient', transport: Transport.RMQ }])],
      controllers: [PlayerMessageController],
      providers: [
        PlayerMessageService,
        PlayerClientService,
        RobotMessageService,
        RobotClientService,
        SessionService,
        AppLogger,
      ],
    }).compile();
    app = moduleFixture.createNestApplication();
    const logger = app.get(AppLogger);
    rabbitMQStartegy = new ServerRMQ({
      queueOptions: {
        durable: true,
      },
    },
    logger);
    app.connectMicroservice({
      strategy: rabbitMQStartegy,
    });
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();

    playerMessageController = moduleFixture.get<PlayerMessageController>(PlayerMessageController);
    playerMessageService = moduleFixture.get<PlayerMessageService>(PlayerMessageService);
  });

  beforeEach(
    () => {
      jest.restoreAllMocks();
    },
  );

  describe('userJoinedHandler', () => {
    it('should throw validation error', async () => {}); // TODO: Implement
  });
});
