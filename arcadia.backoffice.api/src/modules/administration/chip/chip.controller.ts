import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  HttpStatus,
  Inject,
  Optional,
  Get,
  Post,
  Put,
  Scope,
  UseGuards,
  UseInterceptors,
  Query,
  SetMetadata,
} from '@nestjs/common';
import { ContextId, REQUEST } from '@nestjs/core';
import { REQUEST_CONTEXT_ID } from '@nestjs/core/router/request/request-constants';
import { ApiImplicitQuery } from '@nestjs/swagger/dist/decorators/api-implicit-query.decorator';
import { AuthGuard } from '@nestjs/passport';
import { ModuleAccessGuard, PasswordRequiredGuard } from '../../../guards';
import { MainAppInterceptor } from '../../../interceptors/app';
import { ChipsResponse, ChipTypesResponse, DisqualifyChipsResponse } from './chip.interface';
import { ChipService } from './chip.service';
import { RegisterChipDto, DisqualifyChipDto } from './chip.dto';
import { ModuleTags } from '../../../enums';

@ApiTags('administration')
@Controller({ path: 'administration/chip', scope: Scope.REQUEST })
@UseGuards(AuthGuard('bearer'), ModuleAccessGuard)
@ApiBearerAuth()
@UseInterceptors(MainAppInterceptor)
export class ChipController {
  private readonly contextId: ContextId;

  constructor(
    @Inject(ChipService) private readonly chipService: ChipService,
    @Optional() @Inject(REQUEST) private readonly request,
  ) {
    this.contextId = request[REQUEST_CONTEXT_ID];
  }

  @Get('search')
  @SetMetadata('tag', ModuleTags.ADMINISTRATION)
  @ApiImplicitQuery({ required: true, name: 'term', description: 'RFID term to search by' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns chips found by term', type: ChipsResponse })
  public searchChips(@Query() query: any): Promise<ChipsResponse> {
    return this.chipService.findChipsByRfidTerm(query.term, this.contextId);
  }

  @Post('/')
  @SetMetadata('tag', ModuleTags.ADMINISTRATION)
  @UseGuards(PasswordRequiredGuard)
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Returns created chip data', type: ChipsResponse })
  public registerChips(@Body() data: RegisterChipDto): Promise<ChipsResponse> {
    return this.chipService.registerChips(data, this.contextId);
  }

  @Put('/disqualify')
  @SetMetadata('tag', ModuleTags.ADMINISTRATION)
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns updated chip data', type: DisqualifyChipsResponse })
  public disqualifyChips(@Body() data: DisqualifyChipDto): Promise<DisqualifyChipsResponse> {
    return this.chipService.disqualifyChips(data, this.contextId);
  }

  @Get('/types')
  @SetMetadata('tag', ModuleTags.ADMINISTRATION)
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns chip typed', type: ChipTypesResponse })
  public getChipTypes(): Promise<ChipTypesResponse> {
    return this.chipService.getChipTypes(this.contextId);
  }
}
