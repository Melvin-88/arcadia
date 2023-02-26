import { Injectable, PipeTransform } from '@nestjs/common';
import { SessionService } from '../../session/session.service';

@Injectable()
export class SessionInjectorPipe implements PipeTransform {
  constructor(private readonly sessionService: SessionService) {
  }

  public async transform(value: Record<string, any>): Promise<any> {
    if (value.sessionId) {
      // eslint-disable-next-line no-param-reassign
      value.session = await this.sessionService.findByIdCached(value.sessionId);
    }
    return value;
  }
}
