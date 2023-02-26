import { Module } from '@nestjs/common';
import { SessionDataManager } from './sessionDataManager';

@Module({
  providers: [SessionDataManager],
  exports: [SessionDataManager],
})
export class SessionDataManagerModule {
}
