import { Injectable } from '@nestjs/common';
import { AppLogger } from '../logger/logger.service';
import { GeoIpClient } from './geo.ip.client';

@Injectable()
export class IpChecker {
  constructor(private readonly logger: AppLogger,
              private readonly geoClient: GeoIpClient) {
  }

  public async verifyIp(ipAddress: string, countryWhitelist: string[]): Promise<boolean> {
    try {
      const geoData = await this.geoClient.getGeoByIp(ipAddress);
      this.logger.log(`IP address=${ipAddress}, geoData=${JSON.stringify(geoData)}`);
      return countryWhitelist.includes(geoData.countryCode); // ISO 3166 Country Codes
    } catch (err) {
      this.logger.error(err);
      return false;
    }
  }
}