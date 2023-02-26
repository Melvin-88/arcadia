/* eslint-disable max-lines */
import {
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  connectionNames,
  CurrencyConversionRepository,
  getManager,
  GroupEntity,
  GroupRepository,
  InjectRepository,
  MachineEntity,
  MachineRepository,
  OperatorEntity,
  OperatorRepository,
  OperatorStatus,
  PlayerEntity,
  PlayerRepository,
  RngChipPrizeRepository,
  RoundEntity,
  SessionEndReason,
  SessionEntity,
  SessionRepository,
  SessionStatus,
} from 'arcadia-dal';
import * as CacheManager from 'cache-manager';
import * as jwt from 'jsonwebtoken';
import * as _ from 'lodash';
import { from, of } from 'rxjs';
import {
  concatMap, mergeMap, repeat, take, toArray,
} from 'rxjs/operators';
import { promisify } from 'util';
import { Cache } from '../../decorators/cache';
import { CacheClear } from '../../decorators/cache.clear';
import { envToVideoEnv } from '../../util/envToVideoEnvMapper';
import { toCash } from '../../util/toCash';
import { ConfigValidator } from '../config.validator/configValidator';
import { ConfigService } from '../config/config.service';
import { REDIS_CACHE } from '../global.cache/redis.cache.module';
import { IpChecker } from '../ip.checker/ip.checker';
import { BlueRibbonTokenPayload } from '../jackpot.api.client/dto/blue.ribbon.token.payload';
import { AppLogger } from '../logger/logger.service';
import {
  getRobotDirectRoom,
  getRobotQueueRoom,
  sessionRoomNameFactory,
} from '../messaging/room.name.template';
import { EventSource, EventType } from '../monitoring.worker.client/enum';
import { MonitoringWorkerClientService } from '../monitoring.worker.client/monitoring.worker.client.service';
import { OperatorApiClientService } from '../operator.api.client/operator.api.client.service';
import { RobotClientService } from '../robot.client/robot.client.service';
import { SessionDataManager } from '../session.data.manager/sessionDataManager';
import { sessionCacheKeyFactory } from '../session/session.cache.key.factory';
import { getSessionHash } from '../session/session.hash';
import { SessionService } from '../session/session.service';
import { CameraStreamsData } from '../video.api.client/interfaces';
import { VideoApiClientService } from '../video.api.client/video.api.client.service';
import { AuthTokenPayload } from './auth.token.payload';
import { AuthPlayerDto } from './dto/auth.player.dto';
import { AuthResponseDto } from './dto/auth.player.response.dto';
import { CreateUrlDto } from './dto/create.url.dto';
import { LobbyChangeBetDto } from './dto/lobby.change.bet.dto';
import { ReconnectVerifyResponseDto } from './dto/reconnect.verify.response.dto';
import { TokenVerifyRespDto } from './dto/token.verify.resp.dto';

@Injectable()
export class AuthService {
  private readonly tokenSigner: (
    payload: Record<string, any>,
    secret: string,
    options: Record<string, any>,) =>
    Promise<string> = promisify<Record<string, any>, string, Record<string, any>, string>(jwt.sign);
  private readonly tokenVerifier: (token: string, secret: string, options: Record<string, any>) =>
    Promise<any> = promisify<string, string, Record<string, any>>(jwt.verify);

  private readonly robotSecret: string;
  private readonly blueRibbonSecret: string;
  private readonly jackpotOperatorBaseUrl: string;
  private readonly streamAuthSecret: string;
  private readonly testAlwaysOkToken: string;
  private readonly testAlwaysBadToken: string;
  private readonly currencyWhitelist: Set<string>;
  private readonly clientIoHaproxyUrl: string;
  private readonly allowParallelSessions: boolean;

  constructor(
    @InjectRepository(MachineRepository, connectionNames.DATA)
    private readonly machineRepository: MachineRepository,
    @InjectRepository(GroupRepository, connectionNames.DATA)
    private readonly groupRepo: GroupRepository,
    @InjectRepository(PlayerRepository, connectionNames.DATA)
    private readonly playerRepo: PlayerRepository,
    @InjectRepository(OperatorRepository, connectionNames.DATA)
    private readonly operatorRepo: OperatorRepository,
    @InjectRepository(SessionRepository, connectionNames.DATA)
    private readonly sessionRepo: SessionRepository,
    @InjectRepository(CurrencyConversionRepository, connectionNames.DATA)
    private readonly currencyConversionRepo: CurrencyConversionRepository,
    @InjectRepository(RngChipPrizeRepository, connectionNames.DATA)
    private readonly rngChipPrizeRepo: RngChipPrizeRepository,
    private readonly sessionService: SessionService,
    private readonly logger: AppLogger,
    private readonly configService: ConfigService,
    private readonly operatorClient: OperatorApiClientService,
    @Inject(REDIS_CACHE) private readonly cacheManager: CacheManager.Cache,
    private readonly robotClient: RobotClientService,
    private readonly monitoringService: MonitoringWorkerClientService,
    private readonly videoApiClient: VideoApiClientService,
    private readonly tokenManager: SessionDataManager,
    private readonly ipChecker: IpChecker,
    private readonly configValidator: ConfigValidator,
  ) {
    this.robotSecret = configService.get(['core', 'ROBOTS_AUTH_SECRET']) as string;
    this.streamAuthSecret = configService.get(['core', 'STREAM_AUTH_SECRET']) as string;
    this.testAlwaysOkToken = configService.get(['core', 'STREAM_AUTH_TEST_TOKEN_OK']) as string;
    this.testAlwaysBadToken = configService.get(['core', 'STREAM_AUTH_TEST_TOKEN_BAD']) as string;
    this.currencyWhitelist = new Set((configService.get(['core', 'GC_CURRENCY_WHITELIST']) as string)
      .split(',')
      .map(value => value.toLowerCase()));
    this.blueRibbonSecret = configService.get(['core', 'BLUE_RIBBON_AUTHENTICATION_SECRET']) as string;
    this.jackpotOperatorBaseUrl = (this.configService.get(['core', 'BLUE_RIBBON_API_URL']) as string)
      .replace(/(\/[\w.]{4,})$/, '');
    this.clientIoHaproxyUrl = this.configService.get(['core', 'CLIENT_IO_HAPROXY_URL']) as string;
    this.allowParallelSessions = this.configService.get(['core', 'ALLOW_PARALLEL_SESSIONS']) as any;
  }

  public async authPlayer(correlationId: string, data: AuthPlayerDto): Promise<AuthResponseDto> {
    const {
      operatorId, accessToken, playerIP, clientVersion, os, deviceType, browser,
      // gameCode, isReal, partnerId,
    } = data;
    const language = data.language || 'en-US';

    const operator = await this.operatorRepo.findOne(operatorId);
    if (!operator || operator.status !== OperatorStatus.ENABLED) {
      throw new NotAcceptableException('Operator not found or disabled!');
    }

    const {
      cid, playerToken, currencyCode, name,
      // balance,
    } = await this.operatorClient.auth(correlationId, operator.apiConnectorId, accessToken)
      .catch(() => {
        throw new UnauthorizedException('Player auth failed!');
      });

    let player = await this.playerRepo.findOne({ cid });
    if (!player) {
      player = this.playerRepo.create({
        cid,
        name: name || null,
        bets: 0,
        wins: 0,
        lastSessionDate: new Date(),
        settings: {},
        operator,
      });
      player = await this.playerRepo.save(player, { transaction: false });
    }

    if (!this.allowParallelSessions) {
      const existingSessions = await this.sessionRepo.find({ player });
      if (existingSessions?.length) {
        throw new NotAcceptableException('Player already has a session, parallel sessions are not allowed!');
      }
    }

    const payload: AuthTokenPayload = {
      operatorId: operator.id, cid: player.cid,
    };
    const streamAuthToken = await this.tokenSigner(payload, this.streamAuthSecret, { expiresIn: '2h' });
    const sessionOptions: Record<string, any> = {
      playerIP,
      currency: currencyCode,
      clientVersion,
      os,
      deviceType,
      browser,
      locale: language,
      streamAuthToken,
      playerToken,
    };
    const token = await this.tokenSigner(payload, this.robotSecret, { expiresIn: '5m' });
    const brTokenPayload: BlueRibbonTokenPayload = { playerId: player.cid };
    const blueRibbonToken = await this.tokenSigner(brTokenPayload,
      this.blueRibbonSecret, { expiresIn: '1h' });
    await this.cacheManager.set<Partial<SessionEntity>>(token, sessionOptions, { ttl: 310 }); // 5m ttl
    return {
      url: this.clientIoHaproxyUrl,
      token,
      currency: currencyCode,
      blueRibbonToken,
      blueRibbonOperatorId: operator.blueRibbonId,
      blueRibbonBaseServiceUrl: this.jackpotOperatorBaseUrl,
      playerId: player.cid,
    };
  }

  private verifyToken(token: string, ignoreExp = false): Promise<AuthTokenPayload> {
    return this.tokenVerifier(token, this.robotSecret, {
      clockTolerance: 1,
      maxAge: '5m',
      ignoreExpiration: ignoreExp,
    }).catch(reason => {
      throw new UnauthorizedException('Token verification failed!', reason.message);
    });
  }

  @Cache({ ttl: 10 }, args => (`lobby-request-${args[0]}`))
  public async handleLobby(token: string): Promise<LobbyChangeBetDto> {
    const { operatorId } = await this.verifyToken(token);
    const operator = await this.operatorRepo.findOneOrFail(operatorId)
      .catch(() => {
        throw new NotFoundException(`Operator id=${operatorId} not found!`);
      });
    const { sessionOptions } = await this.getSessionOptions(token)
      .catch(() => {
        throw new UnauthorizedException('Token is stale or not valid!');
      });
    const convRate = await this.currencyConversionRepo.getCurrencyConversion(sessionOptions.currency);
    const groups = await this.machineRepository.getLobbyAndChangeBetGroupData(operator.id);
    const groupsMapped = await from(groups).pipe(mergeMap(async group => {
      const payTable = await this.rngChipPrizeRepo
        .getPayTable(convRate.rate, group.prizeGroup, group.config.rtpSegment);
      return {
        groupId: group.groupId,
        groupName: group.groupName,
        jackpotGameId: group.jackpotGameId,
        queueLength: group.queueLength,
        betInCash: toCash(group.denominator, convRate.rate),
        currency: convRate.currency,
        color: group.color,
        payTable,
      };
    }), toArray()).toPromise();
    return {
      jackpotOperatorId: operator.blueRibbonId,
      groups: groupsMapped,
    };
  }

  @CacheClear(args => sessionCacheKeyFactory(args[0]))
  public async verifyReconnect(sessionId: number, footprint: string): Promise<ReconnectVerifyResponseDto> {
    const session = await this.sessionRepo.findOne({
      id: sessionId,
      footprint,
    }, {
      relations: ['machine', 'machine.dispensers', 'machine.dispensers.chipType',
        'group', 'operator', 'player', 'rounds', 'machine.site'],
    });
    if (!session || session.status === SessionStatus.TERMINATED
      || session.status === SessionStatus.COMPLETED) {
      throw new NotAcceptableException('Session not found or completed/terminated!');
    }

    const {
      group, machine, player, operator,
    } = session;
    const activeRound = session.getActiveRound();
    const video = await this.videoApiClient.getCameraStreams(machine);
    return this.loginReconnectDataMapper<ReconnectVerifyResponseDto>(
      session, player, machine, group, operator, video, activeRound, true,
    );
  }

  private async loginReconnectDataMapper<T extends TokenVerifyRespDto | ReconnectVerifyResponseDto>(
    session: SessionEntity, player: PlayerEntity, machine: MachineEntity,
    group: GroupEntity, operator: OperatorEntity, video: CameraStreamsData,
    activeRound?: RoundEntity, isReconnect = false,
  ): Promise<T> {
    const { configuration: config } = session;

    let result: TokenVerifyRespDto | ReconnectVerifyResponseDto = {
      playerId: player.cid,
      sessionId: session.id,
      streamAuthToken: session.streamAuthToken,
      videoServiceEnv: envToVideoEnv(this.configService.get(['core', 'NODE_ENV']) as string, this.logger),
      sessionStatus: (isReconnect && session.status === SessionStatus.FORCED_AUTOPLAY) // workaround to fix client state transition blinking
        ? SessionStatus.PLAYING
        : session.status,
      currency: session.currency,
      locale: session.locale,
      stackSize: group.stackSize,
      stackBuyLimit: group.stackBuyLimit,
      playerDirectRoomId: sessionRoomNameFactory(session.id),
      robotDirectRoomId: getRobotDirectRoom(machine.serial, `${session.id}`),
      robotQueueRoomId: getRobotQueueRoom(machine.serial),
      video,
      machineId: machine.id,
      idleTimeoutSec: group.idleTimeout,
      graceTimeoutSec: group.graceTimeout,
      autoplayConfig: config.autoplay,
      betBehindConfig: config.betBehind,
      scatterType: config.scatterType,
      slotConfig: config.slot,
      payTable: (await this.rngChipPrizeRepo
        .getPayTable(session.currencyConversionRate, group.prizeGroup, config.rtpSegment)),
      machineName: machine.name,
      groupName: group.name,
      betInCash: toCash(group.denominator, session.currencyConversionRate),
      wheel: (await this.getWheelData(group.prizeGroup, session.currencyConversionRate, config.rtpSegment)),
      blueRibbonOperatorId: operator.blueRibbonId,
      blueRibbonBaseServiceUrl: this.jackpotOperatorBaseUrl,
      jackpotGameId: group.blueRibbonGameId,
      activeRound: activeRound && _.pick(activeRound, 'type', 'coins', 'voucherId', 'wins'),
      groupColor: group.color,
      phantomWidgetAnimationDurationMS: Number(this.configService
        .get(['core', 'PHANTOM_WIDGET_ANIMATION_DURATION_MS'])),
    };
    if (isReconnect) {
      result = {
        ...result,
        rounds: session.roundsLeft,
        coins: activeRound?.coins || 0,
        queueToken: getSessionHash(session),
        joinRobotDirectRoom: (session.status !== SessionStatus.VIEWER_BET_BEHIND),
        totalWin: toCash(session.totalWinning, session.currencyConversionRate),
      };
    }
    return result as T;
  }

  public async getSessionOptions(
    token: string, existingSession?: SessionEntity,
  ): Promise<{ sessionOptions: Partial<SessionEntity>, sessionToken: string }> {
    if (existingSession) {
      const sessionToken = await this.tokenManager
        .getSessionToken(existingSession.id, existingSession.player.cid);
      return {
        sessionOptions: {
          totalStacksUsed: existingSession.totalStacksUsed,
          playerIP: (existingSession.playerIP as any)?.join('.') || '0.0.0.0',
          currency: existingSession.currency,
          clientVersion: existingSession.clientVersion,
          os: existingSession.os,
          deviceType: existingSession.deviceType,
          browser: existingSession.browser,
          locale: existingSession.locale,
          streamAuthToken: existingSession.streamAuthToken,
        },
        sessionToken,
      };
    }
    const sessionOptions = await this.cacheManager.get<Record<string, any>>(token);
    if (!sessionOptions) {
      throw new NotFoundException('Session options not found!');
    }
    const sessionToken = sessionOptions.playerToken as string;
    delete sessionOptions.playerToken;
    return { sessionOptions, sessionToken };
  }

  public async exchangeValidationToken(token: string, groupId: number, footprint: string): Promise<TokenVerifyRespDto> {
    const existingSession = await this.sessionRepo.findOne({ footprint }, { relations: ['player'] });
    const cid = existingSession?.player?.cid || ((await this.verifyToken(token)).cid);

    this.logger.log(`verifyToken payload data: ${JSON.stringify({ cid, groupId, footprint })}`);

    const [player, group] = await Promise.all([
      this.playerRepo.findOneOrFail({ cid }, { relations: ['operator'] }),
      this.groupRepo.findOneOrFail(groupId),
    ]);
    const machine = await this.machineRepository.getMachineForNewSession(group.id);
    if (!machine) {
      throw new NotAcceptableException('Group does not have available machines!');
    }
    const { operator } = player;
    const sessionConfig = await this.configValidator.getValidatedConfig(machine.serial, operator.id);
    const { sessionOptions, sessionToken } = await this.getSessionOptions(token, existingSession);
    sessionOptions.configuration = sessionConfig;
    sessionOptions.footprint = footprint;

    if (!this.currencyWhitelist.has(sessionOptions.currency.toLowerCase())) {
      throw new NotAcceptableException(`Currency "${sessionOptions.currency}" is not supported!`);
    }
    if (!(await this.ipChecker.verifyIp(sessionOptions.playerIP as string,
      sessionOptions.configuration.countryWhitelist))) {
      throw new NotAcceptableException('Player IP check failed!');
    }
    const convRate = await this.currencyConversionRepo.getCurrencyConversion(sessionOptions.currency);

    await this.terminateParentOnChangeBet(existingSession);
    sessionOptions.currencyConversionRate = Number(convRate.rate);
    const video = await this.videoApiClient.getCameraStreams(machine);
    if (!video.recorded) {
      throw new NotAcceptableException('Video stream is not recorded!');
    }
    const session = await this.sessionService.createSession({
      ...sessionOptions,
      operator,
      player,
      group,
      machine,
      queue: machine.queue,
      denominator: group.denominator,
    });
    await this.playerRepo.update(player.cid, { lastSessionDate: new Date() });
    await this.tokenManager.setSessionToken(sessionToken, session.id, player.cid);
    await this.monitoringService.sendEventLogMessage({
      eventType: EventType.SESSION_CREATED,
      source: EventSource.GAME,
      params: {
        groupId: session.group.id,
        machineSerial: session.machine.serial,
        videoUrl: video.serverUrl,
        sessionId: session.id,
      },
    });
    return this.loginReconnectDataMapper(session, player, machine, group, operator, video);
  }

  private async terminateParentOnChangeBet(session: SessionEntity): Promise<void> {
    if (session) {
      await this.sessionRepo.update(session.id, { isDenominationChanged: true });

      if (!session.isActivePlayingStatus()) {
        await this.sessionService.finalizeSession(session.id, false, SessionEndReason.CHANGE_BET);
      }
    }
  }

  public async videoStreamAuth(streamAuthToken: string): Promise<void> {
    if (streamAuthToken === this.testAlwaysOkToken) {
      return;
    }
    if (streamAuthToken === this.testAlwaysBadToken) {
      throw new UnauthorizedException();
    }
    try {
      await jwt.verify(streamAuthToken, this.streamAuthSecret);
    } catch (err) {
      throw new UnauthorizedException();
    }
  }

  private async getWheelData(prizeGroup: string, currencyConvRate: number, rtpSegment?: string, wheelSize = 30): Promise<number[]> {
    // eslint-disable-next-line camelcase
    type PhantomPrize = { prize_value: number; probability: number; };
    const queryParams = [prizeGroup];
    let query = 'SELECT * FROM rng_phantom_prizes WHERE `group` = ? AND rtp_segment';
    if (rtpSegment) {
      queryParams.push(rtpSegment);
      query += ' = ?';
    } else {
      query += ' IS NULL';
    }
    const queryResult: any[] = await getManager(connectionNames.DATA).query(query, queryParams);
    if (!queryResult?.length) {
      return [];
    }
    const prizes: PhantomPrize[] = queryResult.map(value => ({
      prize_value: value.prize_value ? toCash(value.prize_value, currencyConvRate) : -1,
      probability: Number(value.probability),
    }))
      .sort((a, b) => a.probability - b.probability);
    const result = await from(prizes)
      .pipe(
        concatMap(prize => {
          let quantity = Math.round(prize.probability * wheelSize);
          if (quantity < 1) {
            quantity = 1;
          }
          return of(prize.prize_value).pipe(repeat(quantity));
        }),
        take(wheelSize),
        toArray())
      .toPromise();
    while (result.length < wheelSize) {
      result.push(result[result.length - 1]);
    }
    return result;
  }

  public async createUrl(data: CreateUrlDto): Promise<string> {
    const {
      authToken,
      callerIp,
      homeUrl,
      languageCode,
      gameToken,
      cashierUrl,
      gameCode,
      isReal,
      partnerId,
      jurisdiction,
    } = data;
    const operator = await this.operatorRepo.findOneOrFail({ apiConnectorId: data.operator })
      .catch(() => {
        throw new NotAcceptableException('Operator not found');
      });
    if (authToken) {
      const secret = this.getOperatorSecretKey(operator.apiConnectorId);
      if (!secret) {
        throw new NotAcceptableException('Operator key not found');
      }
      await this.tokenVerifier(authToken, secret, {
        clockTolerance: 2,
        // maxAge: '1h', // fixme: uncomment once integration is stable
        ignoreExpiration: false,
      }).catch(reason => {
        throw new UnauthorizedException('Token verification failed!', reason.message);
      });
    } else {
      const ipWhitelist = (this.configService
        .get(['core', 'URL_CREATOR_IP_WHITELIST']) as string).split(',');
      if (!callerIp || !ipWhitelist.includes(callerIp)) {
        throw new UnauthorizedException('IP address is unknown');
      }
    }
    const baseUrl = this.configService.get(['core', 'CLIENT_FE_BASE_URL']) as string;
    return `${baseUrl}/launchGame?operatorId=${operator.id}`
      + `&accessToken=${gameToken}`
      + `${gameCode ? `&gameCode=${gameCode}` : ''}`
      + `${languageCode ? `&language=${languageCode}` : ''}`
      + `${typeof isReal !== 'undefined' ? `&isReal=${isReal}` : ''}`
      + `${partnerId ? `&partnerId=${partnerId}` : ''}`
      + `${homeUrl ? `&homeUrl=${homeUrl}` : ''}`
      + `${cashierUrl ? `&cashierUrl=${cashierUrl}` : ''}`
      + `${jurisdiction ? `&jurisdiction=${jurisdiction}` : ''}`;
  }

  private getOperatorSecretKey(apiConnectorId: string): string | undefined {
    const pattern = `${apiConnectorId.toUpperCase()}_SECRET_KEY`;
    const config = this.configService.get(['core']);
    return config[Object.keys(config).find(value => value.includes(pattern))] as string;
  }
}
