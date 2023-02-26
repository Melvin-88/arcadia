import { HttpService, Injectable } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { AuthData } from './dto/authData';
import { BalanceData } from './dto/balanceData';
import { BetData } from './dto/betData';

@Injectable()
export class OperatorApiClientService {
  constructor(private readonly apiClient: HttpService) {
  }

  public auth(correlationId: string, operatorId: string, authToken: string): Promise<AuthData> {
    const body = {
      authToken,
    };
    return this.apiClient.post<AuthData>(`operator/${operatorId}/auth`, body,
      { headers: { correlation: correlationId } })
      .pipe(map(value => value.data)).toPromise();
  }

  public balance(
    correlationId: string, operatorId: string, cid: string, sessionToken: string,
  ): Promise<BalanceData> {
    return this.apiClient.post<BalanceData>(`operator/${operatorId}/balance`,
      { cid, sessionToken },
      { headers: { correlation: correlationId } })
      .pipe(map(value => value.data)).toPromise();
  }

  public async bet(
    operatorId: string, cid: string, amount: number, sessionToken: string,
    roundId: number | string, correlationId: string,
  ): Promise<BetData> {
    return this.apiClient.post<BetData>(`operator/${operatorId}/bet`, {
      cid, amount, sessionToken, roundId: `${roundId}`,
    }, { headers: { correlation: correlationId } })
      .pipe(map(value => value.data)).toPromise();
  }

  public cancelBet(
    operatorId: string, cid: string, amount: number, sessionToken: string,
    roundId: number | string, transactionId: string, correlationId: string,
    isRoundFinish = true,
  ): Promise<BalanceData> {
    return this.apiClient.post<BalanceData>(`operator/${operatorId}/cancelBet`, {
      cid, sessionToken, amount, roundId: `${roundId}`, transactionId, isRoundFinish,
    }, { headers: { correlation: correlationId } })
      .pipe(map(value => value.data)).toPromise();
  }

  public payout(
    correlationId: string, operatorId: string, cid: string, amount: number, sessionToken: string,
    roundId: number | string, transactionId: string, isRoundFinish = true,
  ): Promise<BalanceData> {
    return this.apiClient.post<BalanceData>(`operator/${operatorId}/payout`, {
      cid, amount, sessionToken, roundId: `${roundId}`, transactionId, isRoundFinish,
    }, { headers: { correlation: correlationId } })
      .pipe(map(value => value.data)).toPromise();
  }
}
