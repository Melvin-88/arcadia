import { Module } from '@nestjs/common';
import { WorkerClient } from './worker.client';

@Module({
  providers: [WorkerClient],
  exports: [WorkerClient],
})
export class WorkerClientModule {

}