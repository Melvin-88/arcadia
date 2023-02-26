import { Module } from '@nestjs/common';
import {
  AlertRepository, connectionNames, getRepositoryToken, getConnectionToken,
} from 'arcadia-dal';
import { VideoServerService } from './videServer.service';
import { VideoServerController } from './videoServer.controller';

@Module({
  imports: [],
  exports: [],
  providers: [
    VideoServerService,
    {
      provide: getRepositoryToken(AlertRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(AlertRepository),
      inject: [getConnectionToken(connectionNames.DATA)],
    },
  ],
  controllers: [VideoServerController],
})
export class VideoServerModule {}
