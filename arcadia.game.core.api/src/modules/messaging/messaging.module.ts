/* eslint-disable max-lines */
import { Module } from '@nestjs/common';
import {
  ChipRepository,
  ChipTypeRepository,
  connectionNames,
  getConnectionToken,
  getRepositoryToken,
  GroupRepository,
  MachineDispenserRepository,
  MachineRepository,
  PlayerRepository,
  QueueRepository,
  RngChipPrizeRepository,
  RoundArchiveRepository,
  RoundRepository,
  SeedHistoryRepository,
  SessionRepository,
  VoucherRepository,
} from 'arcadia-dal';
import { BalanceNotifierModule } from '../balance.notifier/balance.notifier.module';
import { ConfigValidatorModule } from '../config.validator/configValidatorModule';
import { GroupTerminatorModule } from '../group.terminator/group.terminator.module';
import { JackpotApiClientModule } from '../jackpot.api.client/jackpot.api.client.module';
import { MonitoringWorkerClientModule } from '../monitoring.worker.client/monitoring.worker.client.module';
import { OperatorApiClientModule } from '../operator.api.client/operator.api.client.module';
import { QueueManagerModule } from '../queue.manager/queue.manager.module';
import { RngServiceClientModule } from '../rng.service.client/rng.service.client.module';
import { RobotClientModule } from '../robot.client/robot.client.module';
import { RoundModule } from '../round/round.module';
import { SessionDataManagerModule } from '../session.data.manager/session.data.manager.module';
import { SessionModule } from '../session/session.module';
import { VideoApiClientModule } from '../video.api.client/video.api.client.module';
import { WorkerClientModule } from '../worker.client/worker.client.module';
import { PlayerMessageController } from './player.handling/player.message.controller';
import { PlayerMessageService } from './player.handling/player.message.service';
import { SessionInjectorPipe } from './player.handling/session.injector.pipe';
import { BbRoundEndHandler } from './robot.handling/bb.round.end.handler';
import { BbRoundStartHandler } from './robot.handling/bb.round.start.handler';
import { BbWinHandler } from './robot.handling/bb.win.handler';
import { ChipDetectionHandler } from './robot.handling/chip.detection.handler';
import { ChipDropHandler } from './robot.handling/chip.drop.handler';
import { CoinShotHandler } from './robot.handling/coin.shot.handler';
import { RobotMessageController } from './robot.handling/robot.message.controller';
import { RobotMessageService } from './robot.handling/robot.message.service';
import { RoundEndHandler } from './robot.handling/round.end.handler';
import { TransactionalController } from './robot.handling/transactional.controller';

@Module({
  imports: [
    SessionModule,
    QueueManagerModule,
    OperatorApiClientModule,
    JackpotApiClientModule,
    RngServiceClientModule,
    VideoApiClientModule,
    MonitoringWorkerClientModule,
    WorkerClientModule,
    RobotClientModule,
    RoundModule,
    SessionDataManagerModule,
    BalanceNotifierModule,
    GroupTerminatorModule,
    ConfigValidatorModule,
  ],
  providers: [
    SessionInjectorPipe,
    PlayerMessageService,
    RobotMessageService,
    CoinShotHandler,
    ChipDropHandler,
    BbRoundEndHandler,
    BbRoundStartHandler,
    BbWinHandler,
    ChipDetectionHandler,
    RoundEndHandler,
    {
      provide: getRepositoryToken(SessionRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(SessionRepository),
      inject: [getConnectionToken(connectionNames.DATA)],
    },
    {
      provide: getRepositoryToken(ChipRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(ChipRepository),
      inject: [getConnectionToken(connectionNames.DATA)],
    },
    {
      provide: getRepositoryToken(MachineRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(MachineRepository),
      inject: [getConnectionToken(connectionNames.DATA)],
    },
    {
      provide: getRepositoryToken(QueueRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(QueueRepository),
      inject: [getConnectionToken(connectionNames.DATA)],
    },
    {
      provide: getRepositoryToken(PlayerRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(PlayerRepository),
      inject: [getConnectionToken(connectionNames.DATA)],
    },
    {
      provide: getRepositoryToken(MachineDispenserRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(MachineDispenserRepository),
      inject: [getConnectionToken(connectionNames.DATA)],
    },
    {
      provide: getRepositoryToken(ChipTypeRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(ChipTypeRepository),
      inject: [getConnectionToken(connectionNames.DATA)],
    },
    {
      provide: getRepositoryToken(RoundRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(RoundRepository),
      inject: [getConnectionToken(connectionNames.DATA)],
    },
    {
      provide: getRepositoryToken(RoundArchiveRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(RoundArchiveRepository),
      inject: [getConnectionToken(connectionNames.DATA)],
    },
    {
      provide: getRepositoryToken(SeedHistoryRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(SeedHistoryRepository),
      inject: [getConnectionToken(connectionNames.DATA)],
    },
    {
      provide: getRepositoryToken(GroupRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(GroupRepository),
      inject: [getConnectionToken(connectionNames.DATA)],
    },
    {
      provide: getRepositoryToken(RngChipPrizeRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(RngChipPrizeRepository),
      inject: [getConnectionToken(connectionNames.DATA)],
    },
    {
      provide: getRepositoryToken(VoucherRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(VoucherRepository),
      inject: [getConnectionToken(connectionNames.DATA)],
    },
  ],
  controllers: [RobotMessageController, PlayerMessageController, TransactionalController],
  exports: [
    SessionInjectorPipe,
    PlayerMessageService,
    RobotMessageService,
  ],
})
export class MessagingModule {
}
