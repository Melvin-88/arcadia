import { HttpModule, Module } from '@nestjs/common';
import { VideoApiClientService } from './video.api.client.service';

@Module({
  imports: [
    HttpModule,
  ],
  providers: [VideoApiClientService],
  exports: [VideoApiClientService],
})
export class VideoApiClientModule {}
