import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  Optional,
  Param,
  Post,
  Put,
  Query,
  Res,
  Scope,
  SetMetadata,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiImplicitQuery } from '@nestjs/swagger/dist/decorators/api-implicit-query.decorator';
import { ApiImplicitParam } from '@nestjs/swagger/dist/decorators/api-implicit-param.decorator';
import { ContextId, REQUEST } from '@nestjs/core';
import { REQUEST_CONTEXT_ID } from '@nestjs/core/router/request/request-constants';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { OperatorsService } from './operators.service';
import {
  OperatorLogoResponse,
  OperatorNamesResponse,
  OperatorResponse,
  OperatorsResponse,
} from './operators.interface';
import {
  CreateOperatorDto,
  EditOperatorDto,
} from './operators.dto';
import { MainAppInterceptor } from '../../interceptors/app';
import { ModuleAccessGuard, PasswordRequiredGuard } from '../../guards';
import { OPERATOR_LOGO_REQUIRED } from '../../messages/messages';
import { ModuleTags } from '../../enums';

@ApiTags('operators')
@ApiBearerAuth()
@Controller({ path: 'operators', scope: Scope.REQUEST })
@UseInterceptors(MainAppInterceptor)
export class OperatorsController {
  private readonly contextId: ContextId;

  constructor(
    @Inject(OperatorsService) private readonly operatorsService: OperatorsService,
    @Optional() @Inject(REQUEST) private readonly request,
  ) {
    this.contextId = request[REQUEST_CONTEXT_ID];
  }

  @Get('/')
  @SetMetadata('tag', ModuleTags.OPERATORS)
  @UseGuards(AuthGuard('bearer'), ModuleAccessGuard)
  @ApiOkResponse({ description: 'Returns operators data', type: OperatorsResponse })
  @ApiImplicitQuery({ required: false, name: 'id', description: 'Filter for operator\'s id' })
  @ApiImplicitQuery({
    required: false, name: 'status', description: 'Filter for operator\'s status', type: [String],
  })
  @ApiImplicitQuery({
    required: false, name: 'operatorName', description: 'Filter for operator\'s name', type: [String],
  })
  @ApiImplicitQuery({ required: false, name: 'take', description: 'Number of items to take' })
  @ApiImplicitQuery({ required: false, name: 'offset', description: 'Take offset (page number)' })
  @ApiImplicitQuery({ required: false, name: 'sortBy', description: 'Sort by column with provided name' })
  @ApiImplicitQuery({ required: false, name: 'sortOrder', description: 'Sort order, ascending by default' })
  public getOperators(@Query() query: any): Promise<OperatorsResponse> {
    return this.operatorsService.getOperators(query, this.contextId);
  }

  @Get('/logo')
  @SetMetadata('tag', ModuleTags.OPERATORS)
  @ApiImplicitQuery({
    name: 'id', required: true, description: 'Logo id', type: Number,
  })
  @ApiOkResponse({ description: 'Returns operators logo in binary format', type: Buffer })
  public async getOperatorLogo(@Query('id') id: number, @Res() res: any) {
    const file = await this.operatorsService.getOperatorLogo(id, this.contextId);

    res.writeHead(200, {
      'Content-Type': 'image/jpg',
      'Content-Length': file.length,
    });
    res.end(file);
  }

  @Get('/names')
  @SetMetadata('tag', [
    ModuleTags.OPERATORS,
    ModuleTags.SESSIONS,
    ModuleTags.PLAYERS,
    ModuleTags.VOUCHERS,
    ModuleTags.DISPUTES,
    ModuleTags.MONITORING,
  ])
  @UseGuards(AuthGuard('bearer'), ModuleAccessGuard)
  @ApiOkResponse({ description: 'Returns all operator\'s names and ids', type: OperatorNamesResponse })
  public getOperatorNames(): Promise<OperatorNamesResponse> {
    return this.operatorsService.getOperatorNames(this.contextId);
  }

  @Post('/')
  @SetMetadata('tag', ModuleTags.OPERATORS)
  @UseGuards(AuthGuard('bearer'), ModuleAccessGuard, PasswordRequiredGuard)
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Returns created operators data', type: OperatorResponse })
  public createOperator(@Body() data: CreateOperatorDto): Promise<OperatorResponse> {
    return this.operatorsService.createOperator(data, this.contextId);
  }

  @Put('/:id')
  @SetMetadata('tag', ModuleTags.OPERATORS)
  @ApiImplicitParam({ name: 'id' })
  @UseGuards(AuthGuard('bearer'), ModuleAccessGuard, PasswordRequiredGuard)
  @ApiOkResponse({ description: 'Returns updated operators data', type: OperatorResponse })
  public editOperator(@Param() params: any, @Body() data: EditOperatorDto): Promise<OperatorResponse> {
    return this.operatorsService.editOperator(params.id, data, this.contextId);
  }

  @Post('/:id/enable')
  @SetMetadata('tag', ModuleTags.OPERATORS)
  @ApiImplicitParam({ name: 'id' })
  @UseGuards(AuthGuard('bearer'), ModuleAccessGuard, PasswordRequiredGuard)
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Returns updated operators data', type: OperatorResponse })
  public enableOperator(@Param() params: any): Promise<OperatorResponse> {
    return this.operatorsService.enableOperator(params.id, this.contextId);
  }

  @Post('/:id/disable')
  @SetMetadata('tag', ModuleTags.OPERATORS)
  @ApiImplicitParam({ name: 'id' })
  @UseGuards(AuthGuard('bearer'), ModuleAccessGuard, PasswordRequiredGuard)
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Returns updated operators data', type: OperatorResponse })
  public disableOperator(@Param() params: any): Promise<OperatorResponse> {
    return this.operatorsService.disableOperator(params.id, this.contextId);
  }

  @Delete('/:id')
  @SetMetadata('tag', ModuleTags.OPERATORS)
  @ApiImplicitParam({ name: 'id' })
  @UseGuards(AuthGuard('bearer'), ModuleAccessGuard, PasswordRequiredGuard)
  public removeOperator(@Param() params: any): Promise<void> {
    return this.operatorsService.removeOperator(params.id, this.contextId);
  }

  @Post('/logo')
  @SetMetadata('tag', ModuleTags.OPERATORS)
  @UseGuards(AuthGuard('bearer'), ModuleAccessGuard)
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Logo uploaded', type: OperatorLogoResponse })
  @UseInterceptors(FileInterceptor('file'))
  public uploadLogo(@Param() params: any, @UploadedFile() logo: any): Promise<OperatorLogoResponse> {
    if (!logo) {
      throw new BadRequestException(OPERATOR_LOGO_REQUIRED.en);
    }
    return this.operatorsService.uploadLogo(logo.buffer, this.contextId);
  }
}
