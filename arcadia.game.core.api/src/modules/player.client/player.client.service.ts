import { Inject, Injectable } from '@nestjs/common';
import { RoundType, SessionEntity } from 'arcadia-dal';
import { SocketIOEmitter } from 'socket.io-emitter';
import { REDIS_PUBLISHER_CLIENT } from '../../constants/redis.constants';
import { LobbyChangeBetDto } from '../auth/dto/lobby.change.bet.dto';
import { AutoplayDto } from '../messaging/player.handling/dto/autoplay.dto';
import { QueueBalanceDto } from '../messaging/player.handling/dto/queueBalanceDto';
import { PlayerMessageType } from '../messaging/player.handling/enum/player.message.type';
import {
  PhantomMessage,
  PlayerBalanceMessage,
  PlayerRebuyMessage,
  PlayerSessionResultMessage,
  PlayerTotalWinMessage,
  PlayerWinMessage,
} from '../messaging/player.handling/player.interface';
import { VoucherDto } from '../messaging/robot.handling/dto/voucher.dto';
import {
  getRobotDirectRoom,
  getRobotQueueRoom,
  sessionRoomNameFactory,
} from '../messaging/room.name.template';
import { QueueMessageDto } from '../queue.manager/dto/queue.message.dto';
import { PlayerNotification } from './player.notification';

@Injectable()
export class PlayerClientService {
  constructor(
    @Inject(REDIS_PUBLISHER_CLIENT) private readonly emitter: SocketIOEmitter,
  ) {
  }

  public sessionState(sessionId: string | number, data: Partial<SessionEntity>): void {
    this.emitter.to(sessionRoomNameFactory(sessionId)).emit(PlayerMessageType.SESSION_STATE, data);
  }

  public notifySessionResult(sessionId: string | number, data: PlayerSessionResultMessage): void {
    this.emitter.to(sessionRoomNameFactory(sessionId)).emit(PlayerMessageType.SESSION_RESULT, data);
  }

  public notifyWin(sessionId: string | number, data: PlayerWinMessage): void {
    this.emitter.to(sessionRoomNameFactory(sessionId)).emit(PlayerMessageType.WIN, data);
  }

  public notifyTotalWin(sessionId: string | number, data: PlayerTotalWinMessage): void {
    this.emitter.to(sessionRoomNameFactory(sessionId)).emit(PlayerMessageType.TOTAL_WIN, data);
  }

  public notifyQueueUpdate(machineSerial: string, data: QueueMessageDto): void {
    this.emitter.to(getRobotQueueRoom(machineSerial)).emit(PlayerMessageType.QUEUE, data);
  }

  public broadcastRemainingCoins(machineSerial: string, remainingCoins: number): void {
    this.emitter.to(getRobotQueueRoom(machineSerial))
      .emit(PlayerMessageType.REMAINING_COINS, { remainingCoins });
  }

  public notifyBuyResult(sessionId: string | number, queueToken: string, rounds: number): void {
    this.emitter.to(sessionRoomNameFactory(sessionId)).emit(PlayerMessageType.BUY, {
      queueToken,
      rounds,
    });
  }

  public queueBalance(sessionId: string | number, data: QueueBalanceDto): void {
    this.emitter.to(sessionRoomNameFactory(sessionId)).emit(PlayerMessageType.QUEUE_BALANCE, data);
  }

  public notifyRebuy(sessionId: string | number, data: PlayerRebuyMessage): void {
    this.emitter.to(sessionRoomNameFactory(sessionId)).emit(PlayerMessageType.RE_BUY, data);
  }

  public sendNotification(sessionId: string | number, data: PlayerNotification): void {
    this.emitter.to(sessionRoomNameFactory(sessionId)).emit(PlayerMessageType.NOTIFICATION, data);
  }

  public forceInitMessage(machineSerial: string, sessionId: number, correlationId: string): void {
    this.emitter.to(getRobotDirectRoom(machineSerial, `${sessionId}`))
      .emit(PlayerMessageType.PLAYER_TO_ROBOT, { action: 'init', correlationId });
  }

  public notifyAutoplay(sessionId: string | number, data: AutoplayDto): void {
    this.emitter.to(sessionRoomNameFactory(sessionId)).emit(PlayerMessageType.AUTOPLAY, data);
  }

  public notifyPhantom(sessionId: string | number, data: PhantomMessage): void {
    this.emitter.to(sessionRoomNameFactory(sessionId)).emit(PlayerMessageType.PHANTOM, data);
  }

  public sendBets(sessionId: string | number, data: LobbyChangeBetDto): void {
    this.emitter.to(sessionRoomNameFactory(sessionId)).emit(PlayerMessageType.BETS, data);
  }

  public sendVoucher(sessionId: string | number, data: VoucherDto): void {
    this.emitter.to(sessionRoomNameFactory(sessionId)).emit(PlayerMessageType.VOUCHER, data);
  }

  public notifyReturnToLobby(sessionId: string | number): void {
    this.emitter.to(sessionRoomNameFactory(sessionId)).emit(PlayerMessageType.RETURN_TO_LOBBY);
  }

  public notifyIdleTimoutReset(sessionId: string | number): void {
    this.emitter.to(sessionRoomNameFactory(sessionId)).emit(PlayerMessageType.RESET_IDLE_TIMEOUT);
  }

  public notifyBalance(sessionId: string | number, data: PlayerBalanceMessage): void {
    this.emitter.to(sessionRoomNameFactory(sessionId)).emit(PlayerMessageType.BALANCE, data);
  }

  public notifyRoundStart(sessionId: string | number, type: RoundType): void {
    this.emitter.to(sessionRoomNameFactory(sessionId)).emit(PlayerMessageType.ROUND_START, { type });
  }

  public forceReconnect(sessionId: string | number): void {
    this.emitter.to(sessionRoomNameFactory(sessionId)).emit(PlayerMessageType.FORCE_RECONNECT);
  }
}
