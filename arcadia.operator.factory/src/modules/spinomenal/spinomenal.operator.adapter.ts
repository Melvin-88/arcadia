/* eslint-disable max-lines */
import {
  HttpException, HttpService, HttpStatus, Injectable,
} from '@nestjs/common';
import { createHash } from 'crypto';
import { map, retryWhen } from 'rxjs/operators';
import { SPINOMENAL } from '../../constants/operator.tags';
import { OperatorAdapter } from '../../decorators/operatorAdapter';
import { BaseOperatorAdapter } from '../common/base.operator.adapter';
import { AuthRequestDto } from '../game.server.connector/dto/auth.request.dto';
import { AuthResponse } from '../game.server.connector/dto/auth.response.dto';
import { BalanceResponse } from '../game.server.connector/dto/balance.response.dto';
import { BalanceRequestDto } from '../game.server.connector/dto/balanceRequestDto';
import { BetResponse } from '../game.server.connector/dto/bet.response.dto';
import { BetRequestDto } from '../game.server.connector/dto/betRequestDto';
import { genericRetryStrategy } from '../util/generic.retry.strategy';
import { AuthResponseMapper } from './authResponseMapper';
import { BalanceResponseMapper } from './balanceResponseMapper';
import { BetResponseMapper } from './betResponseMapper';
import { createTimestamp } from './date.to.timestamp.mapping';
import { TransactionType } from './dto/transactionType';
import { SpinomenalConfig } from './spinomenalConfig';

@Injectable()
@OperatorAdapter(SPINOMENAL)
export class SpinomenalOperatorAdapter extends BaseOperatorAdapter<SpinomenalConfig> {
  constructor(config: SpinomenalConfig,
              private readonly client: HttpService,
              private readonly authMapper: AuthResponseMapper,
              private readonly balanceMapper: BalanceResponseMapper,
              private readonly betMapper: BetResponseMapper) {
    super(config);
  }

  public getID(): string {
    return SPINOMENAL;
  }

  public async authenticate(data: AuthRequestDto): Promise<AuthResponse> {
    const { authToken } = data;
    const timestamp = createTimestamp(new Date());
    const body = {
      GameToken: authToken,
      PartnerId: this.config.SPINOMENAL_PARTNER_ID,
      GameCode: this.config.SPINOMENAL_GAME_CODE,
      ProviderCode: this.config.SPINOMENAL_PROVIDER_CODE,
      TimeStamp: timestamp,
      Sig: this.getSignature(timestamp, authToken),
    };
    const result = await this.client.post('/Authenticate', body)
      .pipe(
        retryWhen(genericRetryStrategy()),
        map(value => value.data),
      )
      .toPromise();
    this.errorCheck(result);
    result.authToken = authToken;
    return this.authMapper.map(result);
  }

  public async balance(data: BalanceRequestDto): Promise<BalanceResponse> {
    const { cid, sessionToken } = data;
    const timestamp = createTimestamp(new Date());
    const body = {
      GameToken: sessionToken,
      ExternalId: cid,
      PartnerId: this.config.SPINOMENAL_PARTNER_ID,
      GameCode: this.config.SPINOMENAL_GAME_CODE,
      ProviderCode: this.config.SPINOMENAL_PROVIDER_CODE,
      TimeStamp: timestamp,
      Sig: this.getSignature(timestamp, sessionToken),
    };
    const result = await this.client.post('/GetBalance', body)
      .pipe(
        retryWhen(genericRetryStrategy()),
        map(value => value.data),
      )
      .toPromise();
    this.errorCheck(result);
    return this.balanceMapper.map(result);
  }

  public async bet(data: BetRequestDto): Promise<BetResponse> {
    const {
      cid, amount, sessionToken, roundId,
    } = data;
    const timestamp = createTimestamp(new Date());
    const body = {
      GameToken: sessionToken,
      PartnerId: this.config.SPINOMENAL_PARTNER_ID,
      GameCode: this.config.SPINOMENAL_GAME_CODE,
      ProviderCode: this.config.SPINOMENAL_PROVIDER_CODE,
      ExternalId: cid,
      TicketId: this.getTicketId(roundId, TransactionType.BET, cid),
      RoundId: roundId,
      BetAmount: amount,
      TransactionType: TransactionType.BET,
      TimeStamp: timestamp,
      Sig: this.getSignature(timestamp, sessionToken),
    };
    const result = await this.client.post('/DebitAndCredit', body)
      .pipe(
        retryWhen(genericRetryStrategy()),
        map(value => value.data),
      )
      .toPromise();
    this.errorCheck(result);
    return this.betMapper.map(result);
  }

  public async cancelBet(data: BetRequestDto): Promise<BetResponse> {
    const {
      cid, amount, sessionToken, roundId, isRoundFinish,
    } = data;
    const timestamp = createTimestamp(new Date());
    const body = {
      GameToken: sessionToken,
      PartnerId: this.config.SPINOMENAL_PARTNER_ID,
      GameCode: this.config.SPINOMENAL_GAME_CODE,
      ProviderCode: this.config.SPINOMENAL_PROVIDER_CODE,
      ExternalId: cid,
      TicketId: this.getTicketId(roundId, TransactionType.CANCELED_BET, cid),
      RoundId: roundId,
      RefTicketId: this.getTicketId(roundId, TransactionType.BET, cid),
      WinAmount: amount,
      TransactionType: TransactionType.CANCELED_BET,
      IsRoundFinish: (typeof isRoundFinish === 'undefined') ? true : isRoundFinish,
      TimeStamp: timestamp,
      Sig: this.getSignature(timestamp, sessionToken),
    };
    const result = await this.client.post('/DebitAndCredit', body)
      .pipe(
        retryWhen(genericRetryStrategy()),
        map(value => value.data),
      )
      .toPromise();
    this.errorCheck(result);
    return this.betMapper.map(result);
  }

  public async payout(data: BetRequestDto): Promise<BetResponse> {
    const {
      cid, amount, roundId, sessionToken, isRoundFinish,
    } = data;
    const timestamp = createTimestamp(new Date());
    const body = {
      GameToken: sessionToken,
      PartnerId: this.config.SPINOMENAL_PARTNER_ID,
      GameCode: this.config.SPINOMENAL_GAME_CODE,
      ProviderCode: this.config.SPINOMENAL_PROVIDER_CODE,
      ExternalId: cid,
      TicketId: this.getTicketId(roundId, TransactionType.WIN, cid),
      RoundId: roundId,
      WinAmount: amount,
      TransactionType: TransactionType.WIN,
      IsRoundFinish: (typeof isRoundFinish === 'undefined') ? true : isRoundFinish,
      TimeStamp: timestamp,
      Sig: this.getSignature(timestamp, sessionToken),
    };
    const result = await this.client.post('/DebitAndCredit', body)
      .pipe(
        retryWhen(genericRetryStrategy()),
        map(value => value.data),
      )
      .toPromise();
    this.errorCheck(result);
    return this.betMapper.map(result);
  }

  private getSignature(timestamp: string, gameToken: string): string {
    const data = `${timestamp}${gameToken}${this.config.SPINOMENAL_PARTNER_ID}${this.config.SPINOMENAL_SECRET_KEY}`;
    return createHash('md5')
      .update(data)
      .digest('hex');
  }

  private errorCheck(response: any): void {
    const { ErrorCode, ErrorMessage }: { ErrorCode: number; ErrorMessage: string } = response;
    if (ErrorCode !== 0) {
      throw new HttpException({ errorCode: ErrorCode, errorMessage: ErrorMessage },
        HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  private getTicketId(roundId: string, type: TransactionType, cid: string): string {
    const data = `${roundId}-${type}-${cid}`;
    return createHash('md5')
      .update(data)
      .digest('hex');
  }
}
