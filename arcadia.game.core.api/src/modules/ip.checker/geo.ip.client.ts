import { HttpService, Injectable } from '@nestjs/common';
import { RuntimeException } from '@nestjs/core/errors/exceptions/runtime.exception';
import * as Joi from 'joi';
import { map } from 'rxjs/operators';
import { AppLogger } from '../logger/logger.service';
import { IpGeoResp } from './ip.geo.resp';

@Injectable()
export class GeoIpClient {
  constructor(private readonly logger: AppLogger,
              private readonly httpClient: HttpService) {
  }

  public async getGeoByIp(ipAddress: string): Promise<IpGeoResp> {
    const result = await this.httpClient.get(`/geo/${ipAddress}.json`)
      .pipe(map(({ data }) => data))
      .toPromise()
      .catch(reason => {
        throw reason;
      });
    const validationSchema: Joi.ObjectSchema = Joi.object({
      region: Joi.string().required(),
      country_code3: Joi.string().length(3).required(),
      ip: Joi.string().required(),
      city: Joi.string().required(),
      country: Joi.string().required(),
      continent_code: Joi.string().length(2).required(),
      country_code: Joi.string().length(2).required(),
    });
    const { error, value } = validationSchema.validate(result, { stripUnknown: true });
    if (error) {
      throw new RuntimeException(`Geo IP validation error: ${error.message}`);
    }
    return {
      ip: value.ip,
      country: value.country,
      region: value.region,
      city: value.city,
      continentCode: value.continent_code,
      countryCode: value.country_code,
      countryCode3: value.country_code3,
    };
  }
}