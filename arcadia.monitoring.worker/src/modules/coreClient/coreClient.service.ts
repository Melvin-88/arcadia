import {
  HttpException, HttpService, Injectable, Logger, OnModuleInit,
} from '@nestjs/common';
import { ServerRMQ } from '../../rabbitMQ.strategy';

@Injectable()
export class CoreClientService implements OnModuleInit {
  private server: ServerRMQ;
  private logger: Logger = new Logger(CoreClientService.name);

  constructor(
      private readonly httpService: HttpService,
  ) {
  }

  public async onModuleInit() {
    this.server = ServerRMQ.getInstance();
  }

  public groupHardStop(groupId: number, correlationId: string, machineIds: number[] = []): Promise<any> {
    return this.httpService.post(`/group/${groupId}/hardStop`, { machineIds },
      { headers: { correlation: correlationId } })
      .toPromise()
      .then(value => value.data)
      .catch(reason => {
        throw new HttpException(reason.response.data.data, reason.response.status);
      });
  }
}
