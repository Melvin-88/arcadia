/* eslint-disable max-lines */
import {
  HttpException, HttpService, HttpStatus, Inject, Injectable,
} from '@nestjs/common';
import { map, retryWhen } from 'rxjs/operators';
import { CONFIG_TAG } from '../../constants/injection.tokens';
import { SPINOMENAL_EMU } from '../../constants/operator.tags';
import { OperatorAdapter } from '../../decorators/operatorAdapter';
import { BaseOperatorAdapter } from '../common/base.operator.adapter';
import { AuthRequestDto } from '../game.server.connector/dto/auth.request.dto';
import { AuthResponse } from '../game.server.connector/dto/auth.response.dto';
import { BalanceResponse } from '../game.server.connector/dto/balance.response.dto';
import { BalanceRequestDto } from '../game.server.connector/dto/balanceRequestDto';
import { BetResponse } from '../game.server.connector/dto/bet.response.dto';
import { BetRequestDto } from '../game.server.connector/dto/betRequestDto';
import { TransactionType } from '../spinomenal/dto/transactionType';
import { genericRetryStrategy } from '../util/generic.retry.strategy';
import { AuthResponseMapper } from './authResponseMapper';
import { BalanceResponseMapper } from './balanceResponseMapper';
import { BetResponseMapper } from './betResponseMapper';
import { TOKEN_SPLITTER } from './constants';

@Injectable()
@OperatorAdapter(SPINOMENAL_EMU)
export class SpinEmuOperatorAdapter extends BaseOperatorAdapter<Record<string, any>> {
  constructor(@Inject(CONFIG_TAG) config: Record<string, any>,
              private readonly client: HttpService,
              private readonly authMapper: AuthResponseMapper,
              private readonly balanceMapper: BalanceResponseMapper,
              private readonly betMapper: BetResponseMapper) {
    super(config);
  }

  public getID(): string {
    return SPINOMENAL_EMU;
  }

  public async authenticate(data: AuthRequestDto): Promise<AuthResponse> {
    const { authToken } = data;
    const body = {
      GameToken: authToken,
    };
    const result = await this.client.post('/authentication', body)
      .pipe(
        retryWhen(genericRetryStrategy()),
        map(value => value.data),
      )
      .toPromise();
    this.errorCheck(result);
    result.originalToken = authToken;
    return this.authMapper.map(result);
  }

  public async balance(data: BalanceRequestDto): Promise<BalanceResponse> {
    const [GameToken, ExternalId] = data.sessionToken.split(TOKEN_SPLITTER);
    const body = {
      GameToken,
      ExternalId,
    };
    const result = await this.client.post('/player_balance', body)
      .pipe(
        retryWhen(genericRetryStrategy()),
        map(value => value.data),
      )
      .toPromise();
    this.errorCheck(result);
    return this.balanceMapper.map(result);
  }

  public async bet(data: BetRequestDto): Promise<BetResponse> {
    const { amount, sessionToken, roundId } = data;
    const [GameToken, ExternalId] = sessionToken.split(TOKEN_SPLITTER);
    const ticket = this.createTicketId(data);
    const body = {
      GameToken,
      ExternalId,
      TransactionType: TransactionType.BET,
      BetAmount: amount,
      TicketId: ticket,
      RoundId: roundId,
    };
    const result = await this.client.post('/process_bet', body)
      .pipe(
        retryWhen(genericRetryStrategy()),
        map(value => value.data),
      )
      .toPromise();
    this.errorCheck(result);
    result.transactionId = ticket;
    return this.betMapper.map(result);
  }

  public async cancelBet(data: BetRequestDto): Promise<BalanceResponse> {
    const {
      amount, sessionToken, transactionId, isRoundFinish,
    } = data;
    const [GameToken, ExternalId] = sessionToken.split(TOKEN_SPLITTER);
    const body = {
      GameToken,
      ExternalId,
      WinAmount: amount,
      TicketId: transactionId || this.createTicketId(data),
      RefTicketId: transactionId || this.createTicketId(data),
      TransactionType: TransactionType.CANCELED_BET,
      IsRoundFinish: (typeof isRoundFinish === 'undefined') ? true : isRoundFinish,
    };
    const result = await this.client.post('/process_bet', body)
      .pipe(
        retryWhen(genericRetryStrategy()),
        map(value => value.data),
      )
      .toPromise();
    this.errorCheck(result);
    return this.balanceMapper.map(result);
  }

  public async payout(data: BetRequestDto): Promise<BalanceResponse> {
    const {
      amount, sessionToken, transactionId, isRoundFinish,
    } = data;
    const [GameToken, ExternalId] = sessionToken.split(TOKEN_SPLITTER);
    const body = {
      GameToken,
      ExternalId,
      TicketId: transactionId || this.createTicketId(data),
      RefTicketId: transactionId || this.createTicketId(data),
      WinAmount: amount,
      TransactionType: TransactionType.WIN,
      IsRoundFinish: (typeof isRoundFinish === 'undefined') ? true : isRoundFinish,
    };
    const result = await this.client.post('/process_bet', body)
      .pipe(
        retryWhen(genericRetryStrategy()),
        map(value => value.data),
      )
      .toPromise();
    this.errorCheck(result);
    return this.balanceMapper.map(result);
  }

  private createTicketId(data: BetRequestDto): string {
    const { roundId, cid } = data;
    return `${roundId}_${cid}`;
  }

  private errorCheck(response: any): void {
    const { ErrorCode, ErrorMessage }: { ErrorCode: number; ErrorMessage: string } = response;
    if (ErrorCode !== 0) {
      throw new HttpException({ errorCode: ErrorCode, errorMessage: ErrorMessage },
        HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
