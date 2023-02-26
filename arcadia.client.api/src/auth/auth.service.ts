import { HttpService, Inject, Injectable } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { UAParser } from 'ua-parser-js';
import { ConfigService } from '../config/config.service';
import { UserLogin } from './auth';
import { LobbyChangeBetDto } from './dto/lobby.change.bet.dto';

@Injectable()
export class AuthService {
  private readonly uaParser: UAParser;

  constructor(
    private readonly httpService: HttpService,
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {
    this.uaParser = new UAParser();
  }

  public clientLogin(
    correlationId: string,
    playerIP: string,
    userAgent: string,
    data: UserLogin,
  ): Promise<any> {
    const body = {
      ...data,
      playerIP,
      ...this.parseUA(userAgent),
    };

    return this.httpService.post('/auth', body,
      { headers: { correlation: correlationId } }).toPromise()
      .then(value => value.data);
  }

  public async videoStreamAuth(correlationId: string, token: string): Promise<void> {
    await this.httpService.post('/auth/videoStreamAuth', { token },
      { headers: { correlation: correlationId } }).toPromise();
  }

  private parseUA(userAgent: string) {
    this.uaParser.setUA(userAgent);
    return {
      clientVersion: Object.values(this.uaParser.getEngine()).map(value => (value ? value.toString() : '')).join('_'),
      os: Object.values(this.uaParser.getOS()).map(value => (value ? value.toString() : '')).join('_'),
      deviceType: this.uaParser.getDevice().type || '-',
      browser: Object.values(this.uaParser.getBrowser()).map(value => (value ? value.toString() : '')).join('_'),
    };
  }

  public loginAnonymous(token: string, correlationId?: string): Promise<any> {
    return this.httpService.post('/jackpots/loginAnonymous', {
      token,
    },
    {
      headers: correlationId ? { correlation: correlationId } : undefined,
    },
    ).pipe(map(value => value.data))
      .toPromise();
  }

  public loginPlayer(token: string, correlationId?: string): Promise<any> {
    return this.httpService.post('/jackpots/loginPlayer', {
      token,
    },
    {
      headers: correlationId ? { correlation: correlationId } : undefined,
    },
    ).pipe(map(value => value.data))
      .toPromise();
  }

  public getLobby(token: string, correlationId?: string): Promise<LobbyChangeBetDto> {
    return this.httpService.get('/auth/lobby', {
      params: { token },
      headers: correlationId ? { correlation: correlationId } : undefined,
    },
    ).pipe(map(value => value.data))
      .toPromise();
  }
}
