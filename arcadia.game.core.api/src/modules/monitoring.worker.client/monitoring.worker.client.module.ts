import { Module } from '@nestjs/common';
import { MonitoringWorkerClientService } from './monitoring.worker.client.service';

@Module({
  providers: [MonitoringWorkerClientService],
  exports: [MonitoringWorkerClientService],
})
export class MonitoringWorkerClientModule {
}
