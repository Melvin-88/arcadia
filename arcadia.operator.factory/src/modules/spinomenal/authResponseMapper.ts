import { Injectable } from '@nestjs/common';
import { Mapper } from '../common/mapper';
import { AuthResponse } from '../game.server.connector/dto/auth.response.dto';
import { parseTimestamp } from './date.to.timestamp.mapping';

@Injectable()
export class AuthResponseMapper extends Mapper<Record<string, any>, AuthResponse> {
  map(data: Record<string, any>): AuthResponse {
    const {
      ExternalId, CurrencyCode, Name, AffiliateId, PlayerIP, CountryCode, TypeId, Balance,
      TimeStamp, authToken, //  ErrorCode, ErrorMessage, Email, Birthday, Gender
    } = data;
    return {
      playerToken: authToken,
      balance: Balance,
      cid: ExternalId,
      currencyCode: CurrencyCode,
      timestamp: TimeStamp ? parseTimestamp(TimeStamp) : new Date(),
      type: `${TypeId}`,
      countryCode: CountryCode || null,
      name: Name || null,
      affiliateId: AffiliateId || null,
      playerIp: PlayerIP || null,
    };
  }
}
