import { ApiPropertyOptional, ApiResponseProperty } from '@nestjs/swagger';
import {
  AutoplayConfiguration,
  BetBehindConfiguration,
  RoundEntity,
  ScatterType,
  SessionStatus,
} from 'arcadia-dal';
import { Type } from 'class-transformer';
import { PayTableDto } from './paytable.dto';

export class TokenVerifyRespDto {
  @ApiResponseProperty()
  playerId: string;

  @ApiResponseProperty()
  streamAuthToken: string;

  @ApiResponseProperty()
  videoServiceEnv: string;

  @ApiResponseProperty()
  sessionId: number;

  @ApiResponseProperty({ enum: SessionStatus })
  sessionStatus: SessionStatus;

  @ApiResponseProperty()
  currency: string;

  @ApiResponseProperty()
  locale: string;

  @ApiResponseProperty()
  stackSize: number;

  @ApiResponseProperty()
  stackBuyLimit: number;

  @ApiResponseProperty()
  playerDirectRoomId: string;

  @ApiResponseProperty()
  robotDirectRoomId: string;

  @ApiResponseProperty()
  robotQueueRoomId: string;

  @ApiResponseProperty()
  video: Record<string, any>;

  @ApiResponseProperty()
  machineId: number;

  @ApiResponseProperty()
  idleTimeoutSec: number;

  @ApiResponseProperty()
  graceTimeoutSec: number;

  @ApiResponseProperty()
  autoplayConfig?: AutoplayConfiguration;

  @ApiResponseProperty()
  betBehindConfig?: BetBehindConfiguration;

  @ApiResponseProperty()
  slotConfig?: string[];

  @ApiResponseProperty({ enum: ScatterType })
  scatterType?: ScatterType;

  @ApiResponseProperty()
  @Type(() => PayTableDto)
  payTable?: PayTableDto[];

  @ApiResponseProperty()
  machineName: string;

  @ApiResponseProperty()
  groupName: string;

  @ApiResponseProperty()
  betInCash: number;

  @ApiResponseProperty()
  wheel: number[];

  @ApiResponseProperty()
  blueRibbonOperatorId: string;

  @ApiResponseProperty()
  blueRibbonBaseServiceUrl: string;

  @ApiResponseProperty()
  jackpotGameId: string;

  @ApiPropertyOptional()
  activeRound?: Partial<RoundEntity>;

  @ApiResponseProperty()
  groupColor: string;

  @ApiResponseProperty()
  phantomWidgetAnimationDurationMS: number;
}
