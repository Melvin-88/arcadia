import { Module } from '@nestjs/common';
import { CoreClientService } from './coreClient.service';

@Module({
  imports: [],
  providers: [CoreClientService],
  exports: [CoreClientService],
})
export class CoreClientModule {}
