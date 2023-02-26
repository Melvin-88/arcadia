import { Test, TestingModule } from '@nestjs/testing';
import {
  ChipRepository, ChipTypeRepository,
  connectionNames,
  getRepositoryToken,
  GroupRepository, MachineDispenserRepository,
  MachineRepository,
  PlayerRepository, QueueRepository, RngChipPrizeRepository, SessionRepository, SiteRepository,
} from 'arcadia-dal';
import { SessionService } from '../../session/session.service';
import { OperatorApiClientService } from '../../operator.api.client/operator.api.client.service';
import { RobotClientService } from '../../robot.client/robot.client.service';
import { AppLogger } from '../../logger/logger.service';
import { repoMockFactory } from '../../../util/repoMockFactory';
import { BoHandlerService } from '../bo.handler.service';
import { WorkerClientService } from '../../worker.client/worker.client.service';
import { QueueManagerService } from '../../queue.manager/queue.manager.service';
import { MonitoringWorkerClientService } from '../../monitoring.worker.client/monitoring.worker.client.service';
import { RobotMessageService } from '../../messaging/robot.handling/robot.message.service';
import {GroupTerminatorService} from "../../group.terminator/group.terminator.service";
import {EventBusPublisher} from "../../event.bus/event.bus.publisher";
import {VideoApiClientService} from "../../video.api.client/video.api.client.service";
import {ConfigValidator} from "../../config.validator/configValidator";

export async function makeTestModule(): Promise<TestingModule> {
  const moduleFixture = await Test.createTestingModule({
    imports: [],
    providers: [
      BoHandlerService,
      {
        useValue: { ...repoMockFactory(), getByGroupAndIds: () => {} },
        provide: getRepositoryToken(MachineRepository, connectionNames.DATA),
      },
      {
        useValue: repoMockFactory(),
        provide: getRepositoryToken(MachineDispenserRepository, connectionNames.DATA),
      },
      {
        useValue: repoMockFactory(),
        provide: getRepositoryToken(ChipRepository, connectionNames.DATA),
      },
      {
        useValue: repoMockFactory(),
        provide: getRepositoryToken(ChipTypeRepository, connectionNames.DATA),
      },
      {
        useValue: { sendEventLogMessage: () => null, sendOutOfSessionEventLogMessage: () => null },
        provide: MonitoringWorkerClientService,
      },
      {
        useValue: repoMockFactory(),
        provide: getRepositoryToken(GroupRepository, connectionNames.DATA),
      },
      {
        useValue: repoMockFactory(),
        provide: getRepositoryToken(PlayerRepository, connectionNames.DATA),
      },
      {
        useValue: repoMockFactory(),
        provide: getRepositoryToken(QueueRepository, connectionNames.DATA),
      },
      {
        useValue: repoMockFactory(),
        provide: getRepositoryToken(SessionRepository, connectionNames.DATA),
      },
      {
        useValue: { ...repoMockFactory(), getAllPrizes: () => {} },
        provide: getRepositoryToken(RngChipPrizeRepository, connectionNames.DATA),
      },
      {
        useValue: repoMockFactory(),
        provide: getRepositoryToken(SiteRepository, connectionNames.DATA),
      },
      {
        useValue: { create: () => {}, getAutoplayConfig: () => {} },
        provide: SessionService,
      },
      {
        useValue: { groupSoftStop: () => {}, groupHardStop: () => {} },
        provide: GroupTerminatorService,
      },
      {
        useValue: { terminateSession: () => null },
        provide: EventBusPublisher,
      },
      {
        useValue: { getApiToken: () => null },
        provide: VideoApiClientService,
      },
      {
        useValue: {
          getBalance: () => null,
          cancelWager: () => null,
        },
        provide: OperatorApiClientService,
      },
      {
        useValue: { stopIdleTimeout: () => {}, stopGraceTimeout: () => {} },
        provide: WorkerClientService,
      },
      {
        useValue: { forceChangeMachine: () => {} },
        provide: QueueManagerService,
      },
      {
        useValue: { create: () => {}, sendStopMessage: () => {}, sendRobotMessage: () => {} },
        provide: RobotClientService,
      },
      {
        useValue: { createQueryBuilder: () => {} },
        provide: SessionRepository,
      },
      {
        useValue: { reassignMachine: () => {} },
        provide: RobotMessageService,
      },
      {
        useValue: {},
        provide: ConfigValidator,
      },
      AppLogger,
    ],
  }).compile();
  return moduleFixture;
}