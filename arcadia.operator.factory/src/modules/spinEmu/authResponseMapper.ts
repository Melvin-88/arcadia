import { Injectable } from '@nestjs/common';
import { Mapper } from '../common/mapper';
import { AuthResponse } from '../game.server.connector/dto/auth.response.dto';
import { parseTimestamp } from '../spinomenal/date.to.timestamp.mapping';
import { TOKEN_SPLITTER } from './constants';

@Injectable()
export class AuthResponseMapper extends Mapper<Record<string, any>, AuthResponse> {
  map(data: Record<string, any>): AuthResponse {
    const {
      ExternalId, CurrencyCode, Name, AffiliateId, PlayerIP, CountryCode,
      TypeId, Balance, originalToken, TimeStamp,
    } = data;
    const cid = originalToken.slice(originalToken.indexOf('_') + 1);
    return {
      balance: Balance,
      cid,
      currencyCode: CurrencyCode,
      timestamp: TimeStamp ? parseTimestamp(TimeStamp) : new Date(),
      type: `${TypeId || 0}`,
      countryCode: CountryCode || null,
      name: Name || null,
      affiliateId: AffiliateId || null,
      playerIp: PlayerIP || '0.0.0.0',
      playerToken: `${originalToken}${TOKEN_SPLITTER}${ExternalId}`,
    };
  }
}
