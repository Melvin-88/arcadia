import {
  BadGatewayException,
  HttpService,
  Injectable,
  Logger,
} from '@nestjs/common';
import { EventLogsResponse } from './monitoring.client.interface';

@Injectable()
export class MonitoringClientService {
  private readonly logger: Logger = new Logger(MonitoringClientService.name);

  constructor(
    private readonly monitoringApi: HttpService,
  ) {
  }

  public async getEventLogs(sessionId: number, filters: any): Promise<EventLogsResponse> {
    try {
      const logs = await this.monitoringApi.get(`/api/eventLogs/${sessionId}`, {
        params: filters,
        timeout: 5000,
      }).toPromise();
      return logs.data;
    } catch (err) {
      this.logger.error(err);
      throw new BadGatewayException('Monitoring service error');
    }
  }
}
