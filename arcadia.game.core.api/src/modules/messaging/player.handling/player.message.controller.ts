/* eslint-disable max-lines */
import {
  Controller, UseFilters, UseInterceptors, UsePipes, ValidationPipe,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MainAppInterceptor } from '../../../interceptors/app';
import { IdsDto } from '../../common/idsDto';
import { SessionAwareDto } from '../../dto/session.aware.dto';
import { AppLogger } from '../../logger/logger.service';
import { Route } from '../../rmq.server/route';
import { rpcValidationExceptionFactory } from '../../rpc.exception.handler/exceptions/rpc.validation.exception.factory';
import { RpcMainExceptionFilter } from '../../rpc.exception.handler/filters/rpc.main.exception.filter';
import { QueueChangeOfferDto } from '../../worker.client/dto';
import { WorkerMessage } from '../robot.handling/enum/worker.message';
import { BbEnableMessageDto } from './dto/bb.enable.message.dto';
import { BuyMessageDto } from './dto/buy.message.dto';
import { EnableAutoplayMessageDto } from './dto/enable.autoplay.message.dto';
import { OrientationChangedMessageDto } from './dto/orientation.changed.message.dto';
import { PlayerJoinedMessageDto } from './dto/player.joined.message.dto';
import { QueueBalanceDto } from './dto/queueBalanceDto';
import { QuitDto } from './dto/quit.dto';
import { SetAngleMessageDto } from './dto/set.angle.message.dto';
import { SettingsUpdateMessageDto } from './dto/settings.update.message.dto';
import { VideoMessageDto } from './dto/video.message.dto';
import { PlayerMessageType } from './enum/player.message.type';
import { PlayerMessageService } from './player.message.service';
import { SessionInjectorPipe } from './session.injector.pipe';

@Controller('v1/player')
@UseInterceptors(MainAppInterceptor)
@UseFilters(RpcMainExceptionFilter)
@UsePipes(new ValidationPipe({
  transform: true,
  whitelist: true,
  exceptionFactory: rpcValidationExceptionFactory,
}))
export class PlayerMessageController {
  constructor(
    private readonly logger: AppLogger,
    private readonly messageHandler: PlayerMessageService,
  ) {
  }

  @UsePipes(SessionInjectorPipe)
  @MessagePattern(`${Route.PLAYER}.userjoined`)
  public userJoinedHandler(
    @Payload() data: PlayerJoinedMessageDto): Promise<void> {
    return this.messageHandler.userJoinedHandler(data, data.correlationId);
  }

  @UsePipes(SessionInjectorPipe)
  @MessagePattern(`${Route.PLAYER}.${PlayerMessageType.BUY.toLowerCase()}`)
  public async buyStacksHandler(@Payload() data: BuyMessageDto): Promise<void> {
    await this.messageHandler.buyStacksHandler(data.session, data.stacks,
      data.voucherId, data.correlationId);
  }

  @UsePipes(SessionInjectorPipe)
  @MessagePattern(`${Route.PLAYER}.userleft`)
  public async userDisconnectHandler(@Payload() data: SessionAwareDto): Promise<void> {
    await this.messageHandler.userDisconnectHandler(data);
  }

  @UsePipes(SessionInjectorPipe)
  @MessagePattern(`${Route.PLAYER}.quit`)
  public async playerQuit(@Payload() data: QuitDto): Promise<void> {
    await this.messageHandler.playerQuit(data);
  }

  @UsePipes(SessionInjectorPipe)
  @MessagePattern(`${Route.PLAYER}.armswing`)
  public async armSwing(@Payload() data: SessionAwareDto): Promise<void> {
    await this.messageHandler.armSwing(data);
  }

  @UsePipes(SessionInjectorPipe)
  @MessagePattern(`${Route.PLAYER}.leavequeue`)
  public async playerLeaveQueue(@Payload() data: SessionAwareDto): Promise<void> {
    await this.messageHandler.leaveQueue(data.session);
  }

  @UsePipes(SessionInjectorPipe)
  @MessagePattern(`${Route.PLAYER}.cancelstacks`)
  public async playerCancelStacks(@Payload() data: SessionAwareDto): Promise<void> {
    await this.messageHandler.cancelStacks(data.session);
  }

  @UsePipes(SessionInjectorPipe)
  @MessagePattern(`${Route.PLAYER}.openfire`)
  public async userFireHandler(@Payload() data: SessionAwareDto): Promise<void> {
    await this.messageHandler.userFireHandler(data.session);
  }

  @UsePipes(SessionInjectorPipe)
  @MessagePattern(`${Route.PLAYER}.enableautoplay`)
  public async enableAutoplayHandler(@Payload() data: EnableAutoplayMessageDto): Promise<void> {
    await this.messageHandler.enableAutoplayHandler(data.session, data.autoplay);
  }

  @UsePipes(SessionInjectorPipe)
  @MessagePattern(`${Route.PLAYER}.balance`)
  public async balanceHandler(@Payload() data: SessionAwareDto): Promise<void> {
    const { operator, player } = data.session;
    await this.messageHandler.balanceHandler(data.sessionId, operator.apiConnectorId,
      player.cid, data.correlationId);
  }

  @UsePipes(SessionInjectorPipe)
  @MessagePattern(`${Route.PLAYER}.${PlayerMessageType.DISABLE_AUTOPLAY.toLowerCase()}`)
  public async disableAutoplayHandler(@Payload() data: SessionAwareDto): Promise<void> {
    await this.messageHandler.disableAutoplayHandler(data);
  }

  @MessagePattern(`${Route.PLAYER}.enablebetbehind`)
  public async enableBBHandler(@Payload() data: BbEnableMessageDto): Promise<void> {
    await this.messageHandler.enableBetBehindHandler(data.sessionId, data.betBehind);
  }

  @MessagePattern(`${Route.PLAYER}.${PlayerMessageType.DISABLE_BET_BEHIND.toLowerCase()}`)
  public async disableBBHandler(@Payload() data: SessionAwareDto): Promise<void> {
    await this.messageHandler.disableBetBehindHandler(data.sessionId);
  }

  @UsePipes(SessionInjectorPipe)
  @MessagePattern(`${Route.PLAYER}.ceasefire`)
  public async userCeaseFireHandler(@Payload() data: SessionAwareDto): Promise<void> {
    await this.messageHandler.userCeaseFireHandler(data.session);
  }

  @UsePipes(SessionInjectorPipe)
  @MessagePattern(`${Route.WORKER}.idletimeout`)
  async idleTimeoutHandler(
    @Payload() data: SessionAwareDto): Promise<void> {
    await this.messageHandler.handleIdleTimeout(data);
  }

  @UsePipes(SessionInjectorPipe)
  @MessagePattern(`${Route.WORKER}.gracetimeout`)
  async graceTimeoutHandler(
    @Payload() data: SessionAwareDto): Promise<void> {
    await this.messageHandler.handleGraceTimeout(data.session);
  }

  @UsePipes(SessionInjectorPipe)
  @MessagePattern(`${Route.WORKER}.engagetimeout`)
  async engageTimeoutHandler(
    @Payload() data: SessionAwareDto): Promise<void> {
    await this.messageHandler.handleEngageTimeout(data.session);
  }

  @MessagePattern(`${Route.WORKER}.terminateviewers`)
  public async terminateViewers(@Payload() data: IdsDto): Promise<void> {
    await this.messageHandler.terminateViewers(data.ids);
  }

  @UsePipes(SessionInjectorPipe)
  @MessagePattern(`${Route.WORKER}.${WorkerMessage.QUEUE_CHANGE_OFFERS.toLowerCase()}`)
  public async queueChangeOffersHandler(@Payload() data: QueueChangeOfferDto): Promise<void> {
    await this.messageHandler.handleQueueChangeOffer(data);
  }

  @UsePipes(SessionInjectorPipe)
  @MessagePattern(`${Route.PLAYER}.${PlayerMessageType.QUEUE_BALANCE.toLowerCase()}`)
  public async queueChangeDecision(@Payload() data: QueueBalanceDto): Promise<void> {
    await this.messageHandler.handleQueueBalanceDecision(data);
  }

  @UsePipes(SessionInjectorPipe)
  @MessagePattern(`${Route.PLAYER}.listbets`)
  public async listBets(@Payload() data: SessionAwareDto): Promise<void> {
    await this.messageHandler.handleListBets(data.session);
  }

  @UsePipes(SessionInjectorPipe)
  @MessagePattern(`${Route.PLAYER}.voucher`)
  public async getVoucher(@Payload() data: SessionAwareDto): Promise<void> {
    await this.messageHandler.sendVoucher(data.session);
  }

  @UsePipes(SessionInjectorPipe)
  @MessagePattern(`${Route.PLAYER}.video`)
  public async video(@Payload() data: VideoMessageDto): Promise<void> {
    await this.messageHandler.video(data);
  }

  @UsePipes(SessionInjectorPipe)
  @MessagePattern(`${Route.PLAYER}.settingsupdate`)
  public async settingsUpdate(@Payload() data: SettingsUpdateMessageDto): Promise<void> {
    await this.messageHandler.settingsUpdate(data);
  }

  @UsePipes(SessionInjectorPipe)
  @MessagePattern(`${Route.PLAYER}.setangle`)
  public async setAngle(@Payload() data: SetAngleMessageDto): Promise<void> {
    await this.messageHandler.setAngle(data);
  }

  @UsePipes(SessionInjectorPipe)
  @MessagePattern(`${Route.PLAYER}.orientationchanged`)
  public async orientationChanged(@Payload() data: OrientationChangedMessageDto): Promise<void> {
    await this.messageHandler.orientationChanged(data);
  }

  @UsePipes(SessionInjectorPipe)
  @MessagePattern('Player.menuclicked')
  public async menuClicked(@Payload() data: SessionAwareDto): Promise<void> {
    await this.messageHandler.menuClicked(data);
  }

  @UsePipes(SessionInjectorPipe)
  @MessagePattern('Player.menuclosed')
  public async menuClosed(@Payload() data: SessionAwareDto): Promise<void> {
    await this.messageHandler.menuClosed(data);
  }

  @UsePipes(SessionInjectorPipe)
  @MessagePattern('Player.lostfocus')
  public async lostFocus(@Payload() data: SessionAwareDto): Promise<void> {
    await this.messageHandler.lostFocus(data);
  }

  @UsePipes(SessionInjectorPipe)
  @MessagePattern('Player.regainedfocus')
  public async regainedFocus(@Payload() data: SessionAwareDto): Promise<void> {
    await this.messageHandler.regainedFocus(data);
  }

  @UsePipes(SessionInjectorPipe)
  @MessagePattern('Player.init')
  public async init(@Payload() data: SessionAwareDto): Promise<void> {
    await this.messageHandler.init(data);
  }

  @MessagePattern(`${Route.WORKER}.roundenddelay`)
  public async roundEndDelay(@Payload() data: SessionAwareDto): Promise<void> {
    await this.messageHandler.roundEndDelay(data);
  }

  @MessagePattern(`${Route.PLAYER}.${PlayerMessageType.READY_FOR_NEXT_ROUND.toLowerCase()}`)
  public async readyForRound(@Payload() data: SessionAwareDto): Promise<void> {
    await this.messageHandler.readyForRound(data);
  }
}
