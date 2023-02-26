import { HttpService } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import { of } from 'rxjs';
import { VideoApiClientService } from './video.api.client.service';
import { makeTestModule } from './mocks/beforeAll.mock';
import { dataToAxiosResponse } from '../../util/dataToAxiosResponse';
import { VideoStreamQuality } from './enums/video.stream.quality';

describe('Video Api Client Service (Unit)', () => {
  let videoApiClientService: VideoApiClientService;
  let httpService: HttpService;

  beforeAll(async () => {
    const moduleFixture = await makeTestModule();
    videoApiClientService = moduleFixture.get<VideoApiClientService>(VideoApiClientService);
    httpService = moduleFixture.get<HttpService>(HttpService);
  });

  describe('getStreams', () => {
    it('should return streams for provided camera id', async () => {
      const streamsDataMock = [{
        cameraID: '<cameraId>',
        streamID: '<streamId>',
        webrtc: '<webrtc>',
        hlsUrl: '<hlsUrl>',
        status: {
          isOn: true,
          isRecording: false,
        },
        quality: VideoStreamQuality.HIGH,
      }];
      jest.spyOn(httpService, 'request').mockImplementation((config: AxiosRequestConfig) => {
        if (config.url === '/common/login') {
          return of(dataToAxiosResponse({ token: '<token>' }));
        }
        return of(dataToAxiosResponse({
          streams: streamsDataMock,
        }));
      });
      const result = await videoApiClientService.getStreams('<cameraId>');
      expect(result).toMatchObject({
        streams: [{
          cameraId: streamsDataMock[0].cameraID,
          id: streamsDataMock[0].streamID,
          server: streamsDataMock[0].webrtc,
          hlsUrl: streamsDataMock[0].hlsUrl,
          status: {
            isOn: streamsDataMock[0].status.isOn,
            isRecorded: streamsDataMock[0].status.isRecording,
          },
          rtsp: streamsDataMock[0].streamID,
          quality: streamsDataMock[0].quality,
        }],
        total: streamsDataMock.length,
      });
    });
  });

  describe('getCameraStreamsFormatted', () => {
    it('should return formatted streams data', async () => {
      jest.spyOn(videoApiClientService, 'getStreams')
        // @ts-ignore
        .mockResolvedValue({ streams: [{ server: '<server>', quality: VideoStreamQuality.LOW, rtsp: '<lowRtsp>' }, { quality: VideoStreamQuality.HIGH, rtsp: '<highRtsp>' }] });
      const result = await videoApiClientService.getCameraStreams('<cameraId>');
      expect(result).toMatchObject({ serverUrl: '<server>', lowQualityRTSP: '<lowRtsp>', highQualityRTSP: '<highRtsp>' });
    });
  });
});
