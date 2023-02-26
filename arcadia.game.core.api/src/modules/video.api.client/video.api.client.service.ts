import {
  BadRequestException,
  HttpService,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { MachineEntity, SiteEntity } from 'arcadia-dal';
import * as CacheManager from 'cache-manager';
import { map, retryWhen } from 'rxjs/operators';
import { genericRetryStrategy } from '../../util/generic.retry.strategy';
import { ConfigService } from '../config/config.service';
import { REDIS_CACHE } from '../global.cache/redis.cache.module';
import { VideoStreamQuality } from './enums/video.stream.quality';
import { CameraStreamsData, StreamsResponse } from './interfaces';

@Injectable()
export class VideoApiClientService {
  private readonly logger: Logger = new Logger(VideoApiClientService.name);
  private readonly cameraApiTokenTtlSeconds: number;

  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
    @Inject(REDIS_CACHE) private readonly cacheManager: CacheManager.Cache,
  ) {
    this.cameraApiTokenTtlSeconds = Number(config.get(['core', 'CAMERA_API_TOKEN_TTL_SECONDS']));
  }

  public async getApiToken(site: SiteEntity): Promise<string> {
    const apiToken: string = await this.cacheManager
      .get<string>(this.getCameraApiTokenKeyNameBySiteId(site.id));
    if (!apiToken) {
      return this.authorize(site);
    }
    return apiToken;
  }

  private async makeCamerasRequest(machine: MachineEntity): Promise<any[]> {
    try {
      return await this.httpService.get(`${machine.site.cameraApiBaseUrl}/streams/${machine.cameraID}`, {
        headers: { Authorization: `Bearer ${await this.getApiToken(machine.site)}` },
      }).pipe(
        retryWhen(genericRetryStrategy(undefined, undefined, [HttpStatus.UNAUTHORIZED])),
        map(value => value.data.cameras),
      ).toPromise();
    } catch (err) {
      if (err?.response?.status === HttpStatus.UNAUTHORIZED) {
        const token = await this.authorize(machine.site);
        return this.httpService.get(`${machine.site.cameraApiBaseUrl}/streams/${machine.cameraID}`, {
          headers: { Authorization: `Bearer ${token}` },
        }).pipe(
          map(value => value.data.cameras),
        ).toPromise();
      }
      throw err;
    }
  }

  private async authorize(site: SiteEntity): Promise<string> {
    const apiPassword = await ConfigService.getSecret(site.cameraApiPasswordConfigKey);

    if (!apiPassword) {
      throw new NotFoundException(`Camera API password not found: ${site.cameraApiPasswordConfigKey}`);
    }

    const { token } = await this.httpService.post(`${site.cameraApiBaseUrl}/common/login`,
      {
        user: site.cameraApiUser,
        password: apiPassword,
      }).pipe(
      retryWhen(genericRetryStrategy()),
      map(value => value.data),
    )
      .toPromise();

    await this.cacheManager.set<string>(this.getCameraApiTokenKeyNameBySiteId(site.id), token, { ttl: this.cameraApiTokenTtlSeconds });

    return token;
  }

  private async getStreams(machine: MachineEntity): Promise<StreamsResponse> {
    const streams = await this.makeCamerasRequest(machine).catch(e => {
      this.logger.error(e?.response?.data || 'Video API call failed', e?.stack);
      throw new BadRequestException('Failed to call video api');
    });

    return {
      streams: streams.map(stream => ({
        cameraId: stream.cameraID,
        id: stream.streamID,
        server: stream.webrtc,
        hlsUrl: stream.hls,
        status: {
          isOn: stream.status.isOn,
          isRecorded: stream.status.isRecording,
        },
        rtsp: stream.streamID,
        quality: stream.quality,
      })),
      total: streams.length,
    };
  }

  public async getCameraStreams(machine: MachineEntity): Promise<CameraStreamsData> {
    const streamsData = await this.getStreams(machine);
    const lowQualityStream = streamsData?.streams?.find(s => s.quality === VideoStreamQuality.LOW);
    const highQualityStream = streamsData?.streams?.find(s => s.quality === VideoStreamQuality.HIGH);

    if (!lowQualityStream || !highQualityStream) {
      throw new ServiceUnavailableException('Video stream is not available');
    }

    return {
      serverUrl: highQualityStream.server || lowQualityStream.server,
      lowQualityRTSP: lowQualityStream.rtsp,
      highQualityRTSP: highQualityStream.rtsp,
      recorded: highQualityStream.status.isRecorded || lowQualityStream.status.isRecorded,
      hlsUrlHighQuality: highQualityStream.hlsUrl,
      hlsUrlLowQuality: lowQualityStream.hlsUrl,
    };
  }

  private getCameraApiTokenKeyNameBySiteId(siteId: number): string {
    return `camera-api-token-${siteId}`;
  }
}
