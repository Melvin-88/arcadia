import { Test } from '@nestjs/testing';
import {
  ChipRepository, ChipTypeRepository,
  connectionNames,
  getRepositoryToken,
  MachineDispenserRepository,
  MachineRepository,
  QueueRepository,
} from 'arcadia-dal';
import { ServerRMQ } from '../../rmq.server/rmq.server';
import { robotRmqServerMock } from '../../robot.client/mocks/beforeAll.mock';
import { StatusHandlerService } from '../status.handler.service';
import { repoMockFactory } from '../../../util/repoMockFactory';
import { StatusStrategyFactory } from '../strategy/status.strategy.factory';
import { AppLogger } from '../../logger/logger.service';
import { StartupStatusStrategy } from '../strategy/startup.status.strategy';
import { ShutdownStatusStrategy } from '../strategy/shutdown.status.strategy';
import { ErrorStatusStrategy } from '../strategy/error.status.strategy';
import { GameplayStatusStrategy } from '../strategy/gameplay.status.strategy';
import { BoHandlerService } from '../../bo.handler/bo.handler.service';
import { RobotClientService } from '../../robot.client/robot.client.service';
import { RobotMessageService } from '../../messaging/robot.handling/robot.message.service';
import { MonitoringWorkerClientService } from '../../monitoring.worker.client/monitoring.worker.client.service';

export async function makeTestModule() {
  const moduleFixture = await Test.createTestingModule({
    imports: [],
    providers: [
      StatusHandlerService,
      {
        useValue: robotRmqServerMock,
        provide: ServerRMQ,
      },
      {
        useValue: repoMockFactory(),
        provide: getRepositoryToken(MachineRepository, connectionNames.DATA),
      },
      StatusStrategyFactory,
      AppLogger,
      ErrorStatusStrategy,
      GameplayStatusStrategy,
      ShutdownStatusStrategy,
      StartupStatusStrategy,
      {
        useValue: {
          groupHardStopHandler: () => null,
        },
        provide: BoHandlerService,
      },
      {
        useValue: repoMockFactory(),
        provide: getRepositoryToken(QueueRepository, connectionNames.DATA),
      },
      {
        useValue: { ...repoMockFactory(), findChipsByType: () => null },
        provide: getRepositoryToken(ChipRepository, connectionNames.DATA),
      },
      {
        useValue: repoMockFactory(),
        provide: getRepositoryToken(MachineDispenserRepository, connectionNames.DATA),
      },
      {
        useValue: repoMockFactory(),
        provide: getRepositoryToken(ChipTypeRepository, connectionNames.DATA),
      },
      {
        useValue: {
          sendRobotMessage: () => null,
        },
        provide: RobotClientService,
      },
      {
        useValue: {
          startSeeding: () => null,
        },
        provide: RobotMessageService,
      },
      {
        useValue: { sendOutOfSessionEventLogMessage: () => null },
        provide: MonitoringWorkerClientService,
      },
    ],
  }).compile();
  // @ts-ignore
  jest.spyOn(ServerRMQ, 'getInstance').mockReturnValue(robotRmqServerMock);
  return moduleFixture;
}