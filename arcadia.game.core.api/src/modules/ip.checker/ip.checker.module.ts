import { HttpModule, Module } from '@nestjs/common';
import { GeoIpClient } from './geo.ip.client';
import { IpChecker } from './ip.checker';

@Module({
  imports: [
    HttpModule.register({
      baseURL: 'https://get.geojs.io/v1/ip',
      timeout: 3000,
    }),
  ],
  providers: [IpChecker, GeoIpClient],
  exports: [IpChecker],
})
export class IpCheckerModule {

}