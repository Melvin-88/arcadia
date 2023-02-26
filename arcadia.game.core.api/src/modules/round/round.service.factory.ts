import { Injectable } from '@nestjs/common';
import {
  connectionNames,
  EntityManager,
  InjectRepository,
  PlayerRepository,
  RoundRepository,
  SessionRepository,
} from 'arcadia-dal';
import { BalanceNotifier } from '../balance.notifier/balance.notifier';
import { EventBusPublisher } from '../event.bus/event.bus.publisher';
import { AppLogger } from '../logger/logger.service';
import { MonitoringWorkerClientService } from '../monitoring.worker.client/monitoring.worker.client.service';
import { OperatorApiClientService } from '../operator.api.client/operator.api.client.service';
import { SessionDataManager } from '../session.data.manager/sessionDataManager';
import { PlayerClientService } from '../player.client/player.client.service';
import { RngHelper } from '../rng.service.client/rng.helper';
import { RoundContext } from './round.context';
import { RoundService } from './round.service';

@Injectable()
export class RoundServiceFactory {
  constructor(private readonly logger: AppLogger,
              private readonly rngHelper: RngHelper,
              private readonly operatorClient: OperatorApiClientService,
              @InjectRepository(RoundRepository, connectionNames.DATA)
              private readonly roundRepo: RoundRepository,
              @InjectRepository(SessionRepository, connectionNames.DATA)
              private readonly sessionRepo: SessionRepository,
              @InjectRepository(PlayerRepository, connectionNames.DATA)
              private readonly playerRepo: PlayerRepository,
              private readonly playerPublisher: PlayerClientService,
              private readonly balanceNotifier: BalanceNotifier,
              private readonly eventBusPublisher: EventBusPublisher,
              private readonly monitoringService: MonitoringWorkerClientService,
              private readonly tokenManager: SessionDataManager,
  ) {
  }

  public create(context: RoundContext, manager?: EntityManager): RoundService {
    return new RoundService(
      this.logger, this.eventBusPublisher, this.rngHelper, this.operatorClient,
      this.roundRepo, this.sessionRepo, this.playerRepo, this.playerPublisher, this.balanceNotifier,
      this.monitoringService, this.tokenManager, context, manager,
    );
  }
}
