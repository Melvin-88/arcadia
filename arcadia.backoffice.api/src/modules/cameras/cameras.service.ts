/* eslint-disable max-lines */
import {
  InjectRepository,
  connectionNames,
  MachineRepository,
  MachineEntity,
  In, SiteRepository,
} from 'arcadia-dal';
import {
  BadGatewayException,
  BadRequestException,
  HttpService,
  Injectable,
  Logger, OnModuleInit,
} from '@nestjs/common';
import * as moment from 'moment';
import * as jwt from 'jsonwebtoken';
import {
  CameraResponse,
  CamerasResponse, StreamAuthTokenResponse,
  StreamsResponse,
} from './cameras.interface';
import { AddCameraDto, EditCameraDto } from './cameras.dto';
import { CAMERAS_API_CALL_FAILED, DATE_NOT_IN_PAST } from '../../messages/messages';
import { ConfigService } from '../config/config.service';
import { SitesResponse } from '../players/players.interface';
import { GameCoreClientService } from '../game.core.client/game.core.client.service';

@Injectable()
export class CamerasService implements OnModuleInit {
  private readonly apisConfig: Record<string, any>;
  private readonly logger: Logger = new Logger(CamerasService.name);
  private readonly streamAuthSecret: string;
  constructor(
      @InjectRepository(MachineRepository, connectionNames.DATA) private readonly machineRepository: MachineRepository,
      @InjectRepository(SiteRepository, connectionNames.DATA) private readonly siteRepository: SiteRepository,
      private readonly httpService: HttpService,
      private readonly config: ConfigService,
      private readonly coreClient: GameCoreClientService,
  ) {
    this.apisConfig = {};
    this.streamAuthSecret = config.get(['core', 'STREAM_AUTH_SECRET']) as string;
  }

  async onModuleInit(): Promise<void> {
    const sites = await this.siteRepository.find();
    sites.forEach(s => this.apisConfig[s.name] = {
      baseUrl: s.cameraApiBaseUrl, id: s.id, user: s.cameraApiUser, configKey: s.cameraApiPasswordConfigKey,
    });
  }

  private async makeApiGetRequestPipe(site: string, path: string, res: any): Promise<void> {
    const { baseUrl, id: siteId } = this.apisConfig[site];
    const apiToken = await this.coreClient.getVideoToken(siteId);
    try {
      const responseStream = await this.httpService.request({
        method: 'GET',
        baseURL: baseUrl,
        url: path,
        headers: { Authorization: `Bearer ${apiToken}` },
        responseType: 'stream',
      }).toPromise();

      responseStream.data.pipe(res);
    } catch (err) {
      let message = 'api unreachable';
      this.logger.error(JSON.stringify(err));
      if (err.response) {
        const errBody = JSON.parse(await err.response.data.read());
        message = errBody.message;
        this.logger.error(JSON.stringify(errBody));
      }
      throw new BadGatewayException(`${CAMERAS_API_CALL_FAILED.en}: ${message}`);
    }
  }

  private async makeApiRequest(site: string, path: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', withAuth: boolean, body?: object): Promise<any> {
    const { baseUrl, id: siteId } = this.apisConfig[site];
    const apiToken = await this.coreClient.getVideoToken(siteId);
    try {
      const response = await this.httpService.request({
        method,
        baseURL: baseUrl,
        url: path,
        data: body,
        headers: withAuth ? { Authorization: `Bearer ${apiToken}` } : null,
      }).toPromise();

      return response.data;
    } catch (err) {
      this.logger.error(JSON.stringify(err));
      const message = err.response ? err.response.data.message : 'api unreachable';
      throw new BadGatewayException(`${CAMERAS_API_CALL_FAILED.en}: ${message}`);
    }
  }

  private async makeApiRequestWithAuth(site: string, path: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', body?: object): Promise<any> {
    return this.makeApiRequest(site, path, method, true, body);
  }

  private sortCameras(cameras: any[], sortBy: string, sortOrder: 'ASC' | 'DESC'): any[] {
    if (!sortOrder) {
      sortOrder = 'ASC';
    }
    return cameras.sort((a, b) => {
      if (a[sortBy] > b[sortBy]) {
        return sortOrder === 'ASC' ? 1 : -1;
      }
      return sortOrder === 'ASC' ? -1 : 1;
    });
  }

  private filterCameras(cameras: any[], streams: any, machines: MachineEntity[], filters: any): { cameras: any[]; total: number } {
    let filteredCameras = cameras;
    if (filters.id) {
      filteredCameras = filteredCameras.filter(c => c.id.indexOf(filters.id) > -1);
    }
    if (filters.type) {
      filteredCameras = filteredCameras.filter(c => c.type.indexOf(filters.type) > -1);
    }
    if (filters.recordingStatus) {
      filteredCameras = filteredCameras.filter(c => {
        const camerasStream = streams.find(s => s.cameraId === c.id);
        const condition = parseInt(filters.recordingStatus, 10) === 1;
        return camerasStream.status.isRecorded === condition;
      });
    }
    if (filters.cameraIp) {
      filteredCameras = filteredCameras.filter(c => c.ip === filters.cameraIp);
    }
    if (filters.machine) {
      filteredCameras = filteredCameras.filter(c => c.machine).filter(c => c.machine.indexOf(filters.machine) > -1);
    }
    const take = filters.take ? parseInt(filters.take, 10) : 20;
    const offset = filters.offset ? parseInt(filters.offset, 10) : 0;
    const start = offset;
    const end = take + start;

    if (filters.sortBy) {
      filteredCameras = this.sortCameras(filteredCameras, filters.sortBy, filters.sortOrder.toUpperCase());
    }

    return {
      cameras: filteredCameras.slice(start, end),
      total: filteredCameras.length,
    };
  }

  public async getSites(): Promise<SitesResponse> {
    const sites = await this.siteRepository.find({ select: ['name'] });
    return {
      sites: sites.map(s => s.name),
    };
  }

  private async getCamerasFromSite(site: string): Promise<any> {
    return this.makeApiRequestWithAuth(site, '/mng/camera', 'GET');
  }

  public async getCameras(filters: any, site: string): Promise<CamerasResponse> {
    const camerasRaw = await this.getCamerasFromSite(site);
    const { streams } = await this.getStreams('', '-1');
    const machines = await this.machineRepository.find({ where: { cameraID: In(camerasRaw.map(camera => parseInt(camera.id, 10))) }, relations: ['site'] });

    const camerasMapped = camerasRaw.map(camera => {
      const machine = machines.find(machine => machine.cameraID === camera.id);
      const cameraStreams = streams.filter(stream => stream.cameraId === camera.id);

      return {
        id: camera.id,
        type: camera.type,
        machine: machine?.name || null,
        ip: camera.ip,
        adminUrl: camera.adminUrl,
        adminUser: camera.adminUser,
        adminPassword: camera.adminPasw,
        site: machine?.site?.name || null,
        comments: camera.comments,
        status: cameraStreams.reduce((acc, s) => s.status.isOn && acc, true) ? 'online' : 'offline',
        isRecorded: cameraStreams[0]?.status.isRecorded,
        liveStreamUrl: cameraStreams[0]?.server,
        consoleUrl: camera.consoleUrl,
        rtsp: cameraStreams[0]?.id,
      };
    });

    const { cameras, total } = this.filterCameras(camerasMapped, streams, machines, filters);

    return {
      total,
      cameras,
    };
  }

  private async getStreamsFromSite(site: string, cameraId: string): Promise<any> {
    const response = await this.makeApiRequestWithAuth(site, `/streams/${cameraId}`, 'GET');
    return response.cameras;
  }

  public async getStreams(site: string, cameraId: string): Promise<StreamsResponse> {
    let streams;
    if (site) {
      streams = await this.getStreamsFromSite(site, cameraId);
    } else {
      const streamsPromises = Object.keys(this.apisConfig).map(l => this.getStreamsFromSite(l, cameraId));
      streams = (await Promise.all(streamsPromises)).flat();
    }

    const streamsMapped = streams.map(s => ({
      cameraId: s.cameraID,
      id: s.streamID,
      server: s.webrtc,
      hlsUrl: s.hls,
      status: {
        isOn: s.status.isOn,
        isRecorded: s.status.isRecording,
      },
      rtsp: s.streamID,
      quality: s.quality,
    }));

    return {
      streams: streamsMapped,
      total: streamsMapped.length,
    };
  }

  public async addCamera(site: string, data: AddCameraDto): Promise<CameraResponse> {
    const body = {
      ...data,
      adminPasw: data.adminPassword,
    };
    const response = (await this.makeApiRequestWithAuth(site, '/mng/camera', 'POST', body)).message;
    const { streams } = await this.getStreams(site, response.id);
    return {
      id: response.id,
      type: response.type,
      ip: response.ip,
      adminUrl: response.adminUrl,
      adminUser: response.adminUser,
      adminPassword: response.adminPasw,
      site: response.site,
      comments: response.comments,
      status: response.status,
      isRecorded: streams[0].status.isRecorded,
      liveStreamUrl: streams[0].server,
      consoleUrl: response.consoleUrl,
      rtsp: response.rtsp,
    };
  }

  // eslint-disable-next-line no-unused-vars
  public async editCamera(site: string, id: string, data: EditCameraDto): Promise<CameraResponse> {
    const body = {
      ...data,
      id,
      adminPasw: data.adminPassword,
    };
    const response = await this.makeApiRequestWithAuth(site, '/mng/camera', 'PUT', body);
    const { streams } = await this.getStreams(site, response.id);
    return {
      id: response.id,
      type: response.type,
      ip: response.ip,
      adminUrl: response.adminUrl,
      adminUser: response.adminUser,
      adminPassword: response.adminPasw,
      site: response.site,
      comments: response.comments,
      status: response.status,
      isRecorded: streams[0].status.isRecorded,
      liveStreamUrl: streams[0].server,
      consoleUrl: response.consoleUrl,
      rtsp: response.rtsp,
    };
  }

  public async deleteCamera(site: string, cameraId: string): Promise<void> {
    await this.makeApiRequestWithAuth(site, `/mng/camera?id=${cameraId}`, 'DELETE');
  }

  public async resetCamera(site: string, cameraId: string): Promise<CameraResponse> {
    const response = await this.makeApiRequestWithAuth(site, `/mng/camera/reset/${cameraId}`, 'POST');
    const { streams } = await this.getStreams(site, response.id);
    return {
      id: response.id,
      type: response.type,
      ip: response.ip,
      adminUrl: response.adminUrl,
      adminUser: response.adminUser,
      adminPassword: response.adminPasw,
      site: response.site,
      comments: response.comments,
      status: response.status,
      isRecorded: streams[0].status.isRecorded,
      liveStreamUrl: streams[0].server,
      consoleUrl: response.consoleUrl,
      rtsp: response.rtsp,
    };
  }

  public async toggleStreamRecording(site: string, cameraId: string, isRecorded: boolean): Promise<CameraResponse> {
    const { streams } = await this.getStreams(site, cameraId);
    const operation = isRecorded ? 'start' : 'stop';
    const body = { operation };
    const hqStream = streams.find(s => s.quality === 'high');
    await this.makeApiRequestWithAuth(site, `/vod/${cameraId}/${hqStream.id}`, 'POST', body);
    const camera = await this.getCameras({ id: cameraId }, site);
    return camera.cameras[0];
  }

  public async getRecording(site: string, cameraId: string, fromDateTime: Date, toDateTime: Date, res: any): Promise<void> {
    if (moment(fromDateTime).isAfter() || moment(toDateTime).isAfter()) {
      throw new BadRequestException(DATE_NOT_IN_PAST.en);
    }
    const { streams } = await this.getStreams(site, cameraId);

    await this.makeApiGetRequestPipe(site, `/vod/mp4/${cameraId}/${streams[0].id}?start=${fromDateTime}&end=${toDateTime}`, res);
  }

  public async getAuthStreamToken(): Promise<StreamAuthTokenResponse> {
    const token = jwt.sign({}, this.streamAuthSecret, { expiresIn: '2h' });
    return { token };
  }
}