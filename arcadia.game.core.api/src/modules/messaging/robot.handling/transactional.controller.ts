import {
  Controller,
  Scope,
  UseFilters,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ChipRepository, connectionNames, InjectRepository } from 'arcadia-dal';
import { MainAppInterceptor } from '../../../interceptors/app';
import { BaseEvent } from '../../event.bus/dto/base.event';
import { BetBehindWinEvent } from '../../event.bus/dto/bet.behind.win.event';
import { AppLogger } from '../../logger/logger.service';
import { rpcValidationExceptionFactory } from '../../rpc.exception.handler/exceptions/rpc.validation.exception.factory';
import { RpcMainExceptionFilter } from '../../rpc.exception.handler/filters/rpc.main.exception.filter';
import { SessionInjectorPipe } from '../player.handling/session.injector.pipe';
import { BbRoundEndHandler } from './bb.round.end.handler';
import { BbRoundStartHandler } from './bb.round.start.handler';
import { BbWinHandler } from './bb.win.handler';
import { ChipDetectionHandler } from './chip.detection.handler';
import { ChipDropHandler } from './chip.drop.handler';
import { CoinShotHandler } from './coin.shot.handler';
import { RobotChipDropDto, RobotCoinDto, RobotToCoreBaseMessage } from './dto';
import { RoundEndHandler } from './round.end.handler';

@Controller({ path: 'v1/transactional', scope: Scope.REQUEST })
@UseInterceptors(MainAppInterceptor)
@UseFilters(RpcMainExceptionFilter)
@UsePipes(new ValidationPipe({
  transform: true,
  whitelist: true,
  exceptionFactory: rpcValidationExceptionFactory,
}), SessionInjectorPipe)
export class TransactionalController {
  constructor(
    private readonly logger: AppLogger,
    private readonly coinShotHandler: CoinShotHandler,
    private readonly chipDropHandler: ChipDropHandler,
    private readonly chipDetectionHandler: ChipDetectionHandler,
    private readonly bbRoundEndHandler: BbRoundEndHandler,
    private readonly bbRoundStartHandler: BbRoundStartHandler,
    private readonly bbWinHandler: BbWinHandler,
    private readonly roundEndHandler: RoundEndHandler,
    @InjectRepository(ChipRepository, connectionNames.DATA)
    private readonly chipRepo: ChipRepository,
  ) {
  }

  @MessagePattern('Robot.coin')
  async coinShot(@Payload() data: RobotCoinDto): Promise<void> {
    await this.coinShotHandler.handle(data);
  }

  @MessagePattern('Robot.chipdrop')
  async chipDrop(@Payload() data: RobotChipDropDto): Promise<void> {
    // just unregister those dropped out of session
    if (!data.sessionId) {
      this.logger.log(`Chip drop out of session. Unregistering chip, rfid=${data.rfid}, machineSerial=${data.serial}`);
      await this.chipRepo.update(data.rfid, { machine: null, value: 0, isScatter: false });
      return;
    }
    await this.chipDropHandler.handle(data);
  }

  @MessagePattern('Robot.chipdetection')
  async chipDetection(@Payload() data: RobotToCoreBaseMessage): Promise<void> {
    if (!data.sessionId) {
      this.logger.log(`Chip detection out of session, machineSerial=${data.serial}`);
      return;
    }
    await this.chipDetectionHandler.handle(data);
  }

  @MessagePattern('EventBus.betbehindroundend')
  async bbRoundEnd(@Payload() data: BaseEvent): Promise<void> {
    await this.bbRoundEndHandler.handle(data);
  }

  @MessagePattern('EventBus.betbehindroundstart')
  async bbRoundStart(@Payload() data: BaseEvent): Promise<void> {
    await this.bbRoundStartHandler.handle(data);
  }

  @MessagePattern('EventBus.betbehindwin')
  async bbWin(@Payload() data: BetBehindWinEvent): Promise<void> {
    await this.bbWinHandler.handle(data);
  }

  @MessagePattern('EventBus.roundend')
  async roundEnd(@Payload() data: BaseEvent): Promise<void> {
    await this.roundEndHandler.handle(data);
  }
}
