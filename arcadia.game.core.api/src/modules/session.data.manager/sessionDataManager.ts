import { Inject, Injectable } from '@nestjs/common';
import * as CacheManager from 'cache-manager';
import { REDIS_CACHE } from '../global.cache/redis.cache.module';
import { JackpotContributionData } from '../jackpot.api.client/dto';
import { SESSION_TOKEN_TTL, TRANSACTION_ID_TTL } from './constants';
import { SessionDynamicData } from './sessionDynamicData';

@Injectable()
export class SessionDataManager {
  private readonly getSessionTokenKey =
    (sessionId: number, playerCid: string) => `session-token-${sessionId}-${playerCid}`;
  private readonly getRoundTransactionIdKey =
    (roundId: number) => `round-transaction-id-${roundId}`;
  private readonly getJackpotTransactionIdKey =
    (roundId: number) => `jackpot-transaction-id-${roundId}`;
  private readonly getSessionDataKey = (sessionId: number) => `session-dynamic-data-key-${sessionId}`;

  constructor(@Inject(REDIS_CACHE) private readonly cacheManager: CacheManager.Cache) {

  }

  public async getSessionToken(sessionId: number, playerCid: string): Promise<string | undefined> {
    const key = this.getSessionTokenKey(sessionId, playerCid);
    return this.cacheManager.get<string>(key);
  }

  public async setSessionToken(token: string, sessionId: number, playerCid: string): Promise<void> {
    const key = this.getSessionTokenKey(sessionId, playerCid);
    await this.cacheManager.set<string>(key, token, { ttl: SESSION_TOKEN_TTL });
  }

  public async deleteSessionToken(sessionId: number, playerCid: string): Promise<void> {
    const key = this.getSessionTokenKey(sessionId, playerCid);
    await this.cacheManager.del(key);
  }

  public async getRoundTransactionId(roundId: number): Promise<string | undefined> {
    const key = this.getRoundTransactionIdKey(roundId);
    return this.cacheManager.get<string>(key);
  }

  public async setRoundTransactionId(roundId: number, transactionId: string): Promise<void> {
    const key = this.getRoundTransactionIdKey(roundId);
    await this.cacheManager.set<string>(key, transactionId, { ttl: TRANSACTION_ID_TTL });
  }

  public async deleteRoundTransactionId(roundId: number): Promise<void> {
    const key = this.getRoundTransactionIdKey(roundId);
    await this.cacheManager.del(key);
  }

  public async getJackpotTransactionId(roundId: number): Promise<string | undefined> {
    const key = this.getJackpotTransactionIdKey(roundId);
    return this.cacheManager.get<string>(key);
  }

  public async setJackpotTransactionId(roundId: number, transactionId: string): Promise<void> {
    const key = this.getJackpotTransactionIdKey(roundId);
    await this.cacheManager.set<string>(key, transactionId, { ttl: TRANSACTION_ID_TTL });
  }

  public async deleteJackpotTransactionId(roundId: number): Promise<void> {
    const key = this.getJackpotTransactionIdKey(roundId);
    await this.cacheManager.del(key);
  }

  public async getJackpotContributionData(eventId: string): Promise<JackpotContributionData | undefined> {
    return this.cacheManager.get(eventId);
  }

  public async setJackpotContributionData(eventId: string, data: JackpotContributionData): Promise<void> {
    await this.cacheManager.set(eventId, data, { ttl: TRANSACTION_ID_TTL });
  }

  public async deleteJackpotContributionData(eventId: string): Promise<void> {
    await this.cacheManager.del(eventId);
  }

  public async getSessionData(sessionId: number): Promise<SessionDynamicData> {
    const key = this.getSessionDataKey(sessionId);
    const data = await this.cacheManager.get<SessionDynamicData>(key);
    return data || {};
  }

  public async dropSessionData(sessionId: number): Promise<void> {
    const key = this.getSessionDataKey(sessionId);
    await this.cacheManager.del(key);
  }

  public async updateSessionData(data: Partial<SessionDynamicData>, sessionId: number): Promise<void> {
    const key = this.getSessionDataKey(sessionId);
    const sessionData = await this.getSessionData(sessionId);
    await this.cacheManager.set<SessionDynamicData>(key, { ...sessionData, ...data },
      { ttl: SESSION_TOKEN_TTL });
  }

  public async removeSessionData(data: Partial<SessionDynamicData>, sessionId: number): Promise<void> {
    const key = this.getSessionDataKey(sessionId);
    const sessionData = await this.getSessionData(sessionId);
    Object.keys(data).forEach(key => {
      delete sessionData[key];
    });
    await this.cacheManager.set<SessionDynamicData>(key, sessionData, { ttl: SESSION_TOKEN_TTL });
  }
}
