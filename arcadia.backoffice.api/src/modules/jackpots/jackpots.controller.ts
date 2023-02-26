import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  Inject,
  Optional,
  Param,
  Post,
  Put,
  Query,
  Scope,
  SetMetadata, UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiImplicitQuery } from '@nestjs/swagger/dist/decorators/api-implicit-query.decorator';
import { ApiImplicitParam } from '@nestjs/swagger/dist/decorators/api-implicit-param.decorator';
import { REQUEST } from '@nestjs/core';
import { REQUEST_CONTEXT_ID } from '@nestjs/core/router/request/request-constants';
import { AuthGuard } from '@nestjs/passport';
import { MainAppInterceptor } from '../../interceptors/app';
import { JackpotsService } from './jackpots.service';
import { JackpotsResponse } from './jackpots.interface';
import { ModuleAccessGuard } from '../../guards';
import { ModuleTags } from '../../enums';
import { PasswordRequiredDto } from '../../dtos/password.required.dto';
import { CreateJackpotDto, EditJackpotDto } from './jackpots.dto';

@ApiTags('jackpots')
@UseGuards(AuthGuard('bearer'), ModuleAccessGuard)
@Controller({ path: 'jackpots', scope: Scope.REQUEST })
@UseInterceptors(MainAppInterceptor)
export class JackpotsController {
  private readonly contextId: number;

  constructor(
    @Inject(JackpotsService) private readonly jackpotsService: JackpotsService,
    @Optional() @Inject(REQUEST) private request,
  ) {
    this.contextId = this.request[REQUEST_CONTEXT_ID];
  }

  @Get('/')
  @SetMetadata('tag', ModuleTags.JACKPOTS)
  @ApiOkResponse({ description: 'Returns jackpots data', type: JackpotsResponse })
  @ApiImplicitQuery({ required: false, name: 'id', description: 'Filter for jackpot\'s id' })
  @ApiImplicitQuery({
    required: false, name: 'status', description: 'Filter for jackpot\'s status', type: [String],
  })
  @ApiImplicitQuery({ required: false, name: 'jackpotName', description: 'Filter for jackpot\'s name' })
  @ApiImplicitQuery({ required: false, name: 'prizeFrom', description: 'Filter for jackpot\'s prize' })
  @ApiImplicitQuery({ required: false, name: 'prizeTo', description: 'Filter for jackpot\'s prize' })
  @ApiImplicitQuery({ required: false, name: 'contributionFrom', description: 'Filter for jackpot\'s contribution' })
  @ApiImplicitQuery({ required: false, name: 'contributionTo', description: 'Filter for jackpot\'s contribution' })
  @ApiImplicitQuery({ required: false, name: 'seedFrom', description: 'Filter for jackpot\'s seed' })
  @ApiImplicitQuery({ required: false, name: 'seedTo', description: 'Filter for jackpot\'s seed' })
  @ApiImplicitQuery({
    required: false, name: 'autoReseed', description: 'Filter for jackpot\'s auto reseed', type: [Boolean],
  })
  @ApiImplicitQuery({
    required: false,
    name: 'precedingJackpotId',
    description: 'Filter for jackpot\'s preceding jackpot id',
    type: [String],
  })
  @ApiImplicitQuery({ required: false, name: 'take', description: 'Number of items to take' })
  @ApiImplicitQuery({ required: false, name: 'offset', description: 'Take offset (page number)' })
  public getJackpots(@Query() query: any): Promise<JackpotsResponse> {
    return this.jackpotsService.getJackpots(query);
  }

  @Post('/')
  @SetMetadata('tag', ModuleTags.JACKPOTS)
  public createJackpot(@Body() data: CreateJackpotDto): Promise<void> {
    return this.jackpotsService.createJackpot(data, this.contextId);
  }

  @Put('/:id')
  @SetMetadata('tag', ModuleTags.JACKPOTS)
  @ApiImplicitParam({ name: 'id' })
  public editJackpot(@Body() data: EditJackpotDto): Promise<void> {
    return this.jackpotsService.editJackpot(data, this.contextId);
  }

  @Post('/:id/activate')
  @SetMetadata('tag', ModuleTags.JACKPOTS)
  @ApiImplicitParam({ name: 'id' })
  public activateJackpot(@Param() params: any, @Body() data: PasswordRequiredDto): Promise<void> {
    return this.jackpotsService.activateJackpot(params.id, data.password, this.contextId);
  }

  @Post('/:id/stop')
  @SetMetadata('tag', ModuleTags.JACKPOTS)
  @ApiImplicitParam({ name: 'id' })
  public stopJackpot(@Param() params: any, @Body() data: PasswordRequiredDto): Promise<void> {
    return this.jackpotsService.stopJackpot(params.id, data.password, this.contextId);
  }
}
