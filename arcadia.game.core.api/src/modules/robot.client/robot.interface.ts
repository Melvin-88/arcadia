import { TiltMode } from 'arcadia-dal';
import { CoreMessage } from '../messaging/robot.handling/enum/core.message';

export interface CoreToRobotMessage {
  action: CoreMessage;
  client?: string;
  mode?: TiltMode;
  rfid?: string;
  status?: string;
  map?: Record<string, any>;
  session?: number;
  coins?: number;
  table?: string[];
  dispenser?: string;
  dispensers?: string[];
  reshuffleCoins?: number;
}
