import {
  connectionNames,
  getRepositoryToken,
  QueueEntity,
  QueueRepository,
  SessionEntity,
  SessionRepository,
  SessionStatus,
} from 'arcadia-dal';
import { makeTestModule } from './mocks/beforeAll.mock';
import { QueueManagerService } from './queue.manager.service';
import { queueManagerSessionsMock, shouldForceChangeMachine } from './mocks/forceChangeMachine.mocks';
import { VideoApiClientService } from '../video.api.client/video.api.client.service';
import { MonitoringWorkerClientService } from '../monitoring.worker.client/monitoring.worker.client.service';
import { PlayerClientService } from '../player.client/player.client.service';
import { EventSource, EventType } from '../monitoring.worker.client/enum';
import { getRobotDirectRoom, getRobotQueueRoom } from '../messaging/room.name.template';
import { getSessionHash } from '../session/session.hash';

describe('Queue Manager Service (Unit)', () => {
  let queueManagerService: QueueManagerService;
  let sessionRepository: SessionRepository;
  let videoApiClient: VideoApiClientService;
  let monitoringsService: MonitoringWorkerClientService;
  let playerClientService: PlayerClientService;
  let queueRepository: QueueRepository;

  beforeAll(async () => {
    const moduleFixture = await makeTestModule();
    queueManagerService = moduleFixture.get<QueueManagerService>(QueueManagerService);
    sessionRepository = moduleFixture.get<SessionRepository>(getRepositoryToken(SessionRepository, connectionNames.DATA));
    videoApiClient = moduleFixture.get<VideoApiClientService>(VideoApiClientService);
    monitoringsService = moduleFixture.get<MonitoringWorkerClientService>(MonitoringWorkerClientService);
    playerClientService = moduleFixture.get<PlayerClientService>(PlayerClientService);
    queueRepository = moduleFixture.get<QueueRepository>(getRepositoryToken(QueueRepository, connectionNames.DATA));
  });

  describe('getNextSession', () => {
    it('should return next session', async () => {
      const sessionMock = new SessionEntity();
      jest.spyOn(sessionRepository, 'getNextSessionForQueue').mockResolvedValue(sessionMock);
      const session = await queueManagerService.getNextSession(32);
      expect(session).toMatchObject(sessionMock);
    });
  });

  describe('assignSessionToQueue', () => {
    it('should assign session to queue', async () => {
      const sessionMock = new SessionEntity();
      const queueMock = new QueueEntity();
      const saveSpy = jest.spyOn(sessionRepository, 'save');
      await queueManagerService.assignSessionToQueue(queueMock, sessionMock);
      expect(saveSpy).toBeCalledWith(sessionMock, { transaction: false });
      expect(sessionMock.queue).toMatchObject(queueMock);
    });
  });

  describe('forceChangeMachine', () => {
    it('should change machine on sessions', async () => {
      shouldForceChangeMachine({ sessionRepository, queueManagerService });
      const sessionMock = queueManagerSessionsMock[0];
      const sendNewDataSpy = jest.spyOn(queueManagerService, 'sendNewQueueData');
      const sessionRepoUpdateSpy = jest.spyOn(sessionRepository, 'update');
      await queueManagerService.forceChangeMachine([1], 10, [4]);
      expect(sendNewDataSpy).toBeCalledWith(sessionMock, sessionMock.machine.queue.id);
    });
  });

  describe('sendNewQueueData', () => {
    it('should send new queue data', async () => {
      jest.spyOn(videoApiClient, 'getCameraStreams').mockResolvedValue({
        serverUrl: '<url>',
        lowQualityRTSP: '<low>',
        highQualityRTSP: '<high>',
      });
      const sendEventLogSpy = jest.spyOn(monitoringsService, 'sendEventLogMessage');
      const notifyQueueChangeDataSpy = jest.spyOn(playerClientService, 'notifyQueueChangeData');
      const notifyQueueUpdateSpy = jest.spyOn(queueManagerService, 'notifyQueueUpdate');
      // .mockImplementation(() => null);
      const playingSession = new SessionEntity();
      playingSession.status = SessionStatus.PLAYING;
      // @ts-ignore
      jest.spyOn(queueRepository, 'findOne').mockResolvedValue({ machine: { serial: '<serial>' }, sessions: [playingSession] });
      const sessionMock = {
        id: 1,
        machine: {
          cameraID: 15,
          serial: '<serial>',
        },
        player: {
          cid: '<cid>',
        },
        queue: {
          id: 82,
        },
      };
      // @ts-ignore
      await queueManagerService.sendNewQueueData(sessionMock, 5);
      expect(sendEventLogSpy).toBeCalledWith(sessionMock, {
        eventType: EventType.SWITCH_QUEUE,
        source: EventSource.GAME,
        params: {},
      });
      expect(notifyQueueChangeDataSpy).toBeCalledWith(sessionMock.player.cid, {
        robotDirectRoomId: getRobotDirectRoom(`${sessionMock.machine.serial}`, `${sessionMock.id}`),
        robotQueueRoomId: getRobotQueueRoom(`${sessionMock.machine.serial}`),
        video: {
          serverUrl: '<url>',
          lowQualityRTSP: '<low>',
          highQualityRTSP: '<high>',
        },
      });
      expect(notifyQueueUpdateSpy).toBeCalledWith(5);
      expect(notifyQueueUpdateSpy).toBeCalledWith(sessionMock.queue.id);
    });
  });

  describe('notifyQueueUpdate', () => {
    it('should send notify queue message', async () => {
      const notifyQueueUpdateSpy = jest.spyOn(playerClientService, 'notifyQueueUpdate');
      jest.spyOn(queueManagerService, 'notifyQueueUpdate').mockClear();
      const viewerSesssion = new SessionEntity();
      viewerSesssion.status = SessionStatus.VIEWER;
      const playingSession = new SessionEntity();
      playingSession.status = SessionStatus.PLAYING;
      // @ts-ignore
      jest.spyOn(queueRepository, 'findOne').mockResolvedValue({ machine: { serial: '<serial>' }, sessions: [viewerSesssion, playingSession] });
      await queueManagerService.notifyQueueUpdate(5);
      expect(notifyQueueUpdateSpy).toBeCalledWith('<serial>', {
        queue: [{
          queueToken: getSessionHash(playingSession),
          stacks: playingSession.roundsLeft,
          status: playingSession.status,
        }],
        viewers: 1,
      });
    });
  });
});
