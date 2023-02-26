import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Optional,
  Param,
  Post,
  Query,
  Scope,
  SetMetadata,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiImplicitQuery } from '@nestjs/swagger/dist/decorators/api-implicit-query.decorator';
import { ApiImplicitParam } from '@nestjs/swagger/dist/decorators/api-implicit-param.decorator';
import { ContextId, REQUEST } from '@nestjs/core';
import { REQUEST_CONTEXT_ID } from '@nestjs/core/router/request/request-constants';
import { AuthGuard } from '@nestjs/passport';
import { MainAppInterceptor } from '../../interceptors/app';
import { PlayersService } from './players.service';
import { BlockReasonsResponse, PlayerResponse, PlayersResponse } from './players.interface';
import { BlockPlayerDto } from './players.dto';
import { ModuleTags } from '../../enums';
import { ModuleAccessGuard } from '../../guards';

@ApiTags('players')
@UseGuards(AuthGuard('bearer'), ModuleAccessGuard)
@ApiBearerAuth()
@Controller({ path: 'players', scope: Scope.REQUEST })
@UseInterceptors(MainAppInterceptor)
export class PlayersController {
  private readonly contextId: ContextId;

  constructor(
    @Inject(PlayersService) private readonly playersService: PlayersService,
    @Optional() @Inject(REQUEST) private readonly request,
  ) {
    this.contextId = request[REQUEST_CONTEXT_ID];
  }

  @Get('/')
  @SetMetadata('tag', ModuleTags.PLAYERS)
  @ApiOkResponse({ description: 'Returns players data', type: PlayersResponse })
  @ApiImplicitQuery({ required: false, name: 'cid', description: 'Filter for player\'s cid' })
  @ApiImplicitQuery({
    required: false, name: 'status', description: 'Filter for player\'s status', type: [String],
  })
  @ApiImplicitQuery({
    required: false, name: 'operatorName', description: 'Filter for player\'s operator name', type: [String],
  })
  @ApiImplicitQuery({ required: false, name: 'betsFrom', description: 'Filter for player\'s bets count' })
  @ApiImplicitQuery({ required: false, name: 'betsTo', description: 'Filter for player\'s bets count' })
  @ApiImplicitQuery({ required: false, name: 'winsFrom', description: 'Filter for player\'s wins count' })
  @ApiImplicitQuery({ required: false, name: 'winsTo', description: 'Filter for player\'s wins count' })
  @ApiImplicitQuery({ required: false, name: 'netCashFrom', description: 'Filter for player\'s net cash count' })
  @ApiImplicitQuery({ required: false, name: 'netCashTo', description: 'Filter for player\'s net cash count' })
  @ApiImplicitQuery({ required: false, name: 'createdDateFrom', description: 'Filter for player\'s creation date' })
  @ApiImplicitQuery({ required: false, name: 'createdDateTo', description: 'Filter for player\'s creation date' })
  @ApiImplicitQuery({ required: false, name: 'lastSessionDateFrom', description: 'Filter for player\'s last session' })
  @ApiImplicitQuery({ required: false, name: 'lastSessionDateTo', description: 'Filter for player\'s last session' })
  @ApiImplicitQuery({ required: false, name: 'take', description: 'Number of items to take' })
  @ApiImplicitQuery({ required: false, name: 'offset', description: 'Take offset (page number)' })
  @ApiImplicitQuery({ required: false, name: 'sortBy', description: 'Sort by column with provided name' })
  @ApiImplicitQuery({ required: false, name: 'sortOrder', description: 'Sort order, ascending by default' })
  public getPlayers(@Query() query: any): Promise<PlayersResponse> {
    return this.playersService.getPlayers(query, this.contextId);
  }

  @Get('/blockReasons')
  @SetMetadata('tag', ModuleTags.PLAYERS)
  @ApiOkResponse({ description: 'Returns all blocking reasons', type: BlockReasonsResponse })
  public getBlockReasons(): Promise<BlockReasonsResponse> {
    return this.playersService.getBlockReasons(this.contextId);
  }

  @Post('/:id/block')
  @SetMetadata('tag', ModuleTags.PLAYERS)
  @ApiImplicitParam({ name: 'id' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Returns updated players data', type: PlayerResponse })
  public blockPlayer(@Param() params: any, @Body() data: BlockPlayerDto): Promise<PlayerResponse> {
    return this.playersService.blockPlayer(params.id, data.reason, this.contextId);
  }

  @Post('/:id/unblock')
  @SetMetadata('tag', ModuleTags.PLAYERS)
  @ApiImplicitParam({ name: 'id' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Returns updated players data', type: PlayerResponse })
  public unblockPlayer(@Param() params: any): Promise<PlayerResponse> {
    return this.playersService.unblockPlayer(params.id, this.contextId);
  }
}
