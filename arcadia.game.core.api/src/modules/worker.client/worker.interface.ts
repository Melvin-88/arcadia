import { SessionStatus, TiltMode } from 'arcadia-dal';
import { WorkerMessage } from '../messaging/robot.handling/enum/worker.message';

export interface CoreToWorkerMessage {
  type: WorkerMessage;
  sessionId?: number;
  correlationId?: string;
  timeout?: number;
  data?: Record<string, any>;
  autoplay?: SessionStatus.AUTOPLAY | SessionStatus.FORCED_AUTOPLAY;
  tiltMode?: TiltMode;
}
