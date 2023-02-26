import {
  Controller, Get, HttpCode, HttpStatus, UsePipes, ValidationPipe,
} from '@nestjs/common';
import {
  Ctx, MessagePattern, Payload, RmqContext,
} from '@nestjs/microservices';
import { AppService } from './app.service';
import { RoundEndDelayDto } from './modules/dto/round.end.delay.dto';
import { SessionAwareDto } from './modules/dto/session.aware.dto';
import { AppLogger } from './modules/logger/logger.service';

@Controller()
@UsePipes(new ValidationPipe({
  transform: true,
  whitelist: true,
  // exceptionFactory: rpcValidationExceptionFactory,
}))
export class AppController {
  constructor(
    private readonly logger: AppLogger,
    private readonly appService: AppService,
  ) {
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/health')
  @HttpCode(HttpStatus.OK)
  public getHealth(): any {
    return {};
  }

  @MessagePattern('Core.playeridlestart')
  public async playerIdleStart(@Payload() data: SessionAwareDto, @Ctx() context: RmqContext): Promise<void> {
    this.logger.log(`Pattern=${context.getPattern()}, data=${JSON.stringify(data)}`);
    await this.appService.playerIdleStart(data.sessionId);
  }

  @MessagePattern('Core.playeridlestop')
  public async handlePlayerIdleStop(@Payload() data: SessionAwareDto, @Ctx() context: RmqContext): Promise<void> {
    this.logger.log(`Pattern=${context.getPattern()}, data=${JSON.stringify(data)}`);
    await this.appService.handlePlayerIdleStop(data.sessionId);
  }

  @MessagePattern('Core.playergracestart')
  public async playerGraceStart(@Payload() data: SessionAwareDto, @Ctx() context: RmqContext): Promise<void> {
    this.logger.log(`Pattern=${context.getPattern()}, data=${JSON.stringify(data)}`);
    await this.appService.playerGraceStart(data.sessionId);
  }

  @MessagePattern('Core.playergracestop')
  public async handlePlayerGraceStop(@Payload() data: SessionAwareDto, @Ctx() context: RmqContext): Promise<void> {
    this.logger.log(`Pattern=${context.getPattern()}, data=${JSON.stringify(data)}`);
    await this.appService.handlePlayerGraceStop(data.sessionId);
  }

  @MessagePattern('Core.playerengagestart')
  public async handleStartEngage(@Payload() data: SessionAwareDto, @Ctx() context: RmqContext): Promise<void> {
    this.logger.log(`Pattern=${context.getPattern()}, data=${JSON.stringify(data)}`);
    await this.appService.handleStartEngage(data.sessionId);
  }

  @MessagePattern('Core.playerengagestop')
  public async handleStopEngage(@Payload() data: SessionAwareDto, @Ctx() context: RmqContext): Promise<void> {
    this.logger.log(`Pattern=${context.getPattern()}, data=${JSON.stringify(data)}`);
    await this.appService.handleStopEngage(data.sessionId);
  }

  @MessagePattern('Core.jackpotreloginstart')
  public async handleStartJackpotRelogin(@Ctx() context: RmqContext): Promise<void> {
    this.logger.log(`Pattern=${context.getPattern()}`);
    await this.appService.handleStartJackpotRelogin();
  }

  @MessagePattern('Core.jackpotreloginstop')
  public async handleStopJackpotRelogin(@Ctx() context: RmqContext): Promise<void> {
    this.logger.log(`Pattern=${context.getPattern()}`);
    await this.appService.handleStopJackpotRelogin();
  }

  @MessagePattern('Core.roundenddelaystart')
  public async roundEndDelayStart(@Payload() data: RoundEndDelayDto, @Ctx() context: RmqContext): Promise<void> {
    this.logger.log(`Pattern=${context.getPattern()}`);
    await this.appService.roundEndDelayStart(data);
  }

  @MessagePattern('Core.roundenddelaystop')
  public async roundEndDelayStop(@Payload() data: SessionAwareDto): Promise<void> {
    await this.appService.roundEndDelayStop(data);
  }
}
