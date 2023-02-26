import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { AppLogger } from '../logger/logger.service';
import { OperatorApiClientService } from '../operator.api.client/operator.api.client.service';
import { SessionDataManager } from '../session.data.manager/sessionDataManager';
import { PlayerClientService } from '../player.client/player.client.service';

@Injectable()
export class BalanceNotifier {
  constructor(private readonly logger: AppLogger,
              private readonly operatorClient: OperatorApiClientService,
              private readonly playerPublisher: PlayerClientService,
              private readonly playerTokenManager: SessionDataManager) {
  }

  public notifyBalance(
    sessionId: number, operatorId: string, playerCid: string, correlationId: string,
  ): void {
    this.playerTokenManager.getSessionToken(sessionId, playerCid)
      .then(token => {
        if (!token) {
          throw new RpcException('Player token not found');
        }
        return this.operatorClient.balance(correlationId, operatorId, playerCid, token);
      })
      .then(balance => this.playerPublisher
        .notifyBalance(sessionId, { valueInCash: balance.balance }))
      .catch(reason => {
        this.logger.error(reason, reason.stack);
      });
  }
}
