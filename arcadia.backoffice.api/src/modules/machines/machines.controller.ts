import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Optional,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Scope,
  SetMetadata,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ContextId, REQUEST } from '@nestjs/core';
import { REQUEST_CONTEXT_ID } from '@nestjs/core/router/request/request-constants';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiImplicitParam } from '@nestjs/swagger/dist/decorators/api-implicit-param.decorator';
import { ApiImplicitQuery } from '@nestjs/swagger/dist/decorators/api-implicit-query.decorator';
import { ModuleTags } from '../../enums';
import { ModuleAccessGuard } from '../../guards';
import { MainAppInterceptor } from '../../interceptors/app';
import { ActivateMachineDto } from './dtos/activate.machine.dto';
import { CreateMachineDto } from './dtos/create.machine.dto';
import { EditMachineDto } from './dtos/edit.machine.dto';
import { ReassignMachineDto } from './dtos/reassign.machine.dto';
import { MachinesService } from './machines.service';
import {
  MachineIdResponse,
  MachineNamesResponse,
  MachineResponse,
  MachinesResponse,
  PowerLinesResponse,
  SitesResponse,
} from './responses';

@ApiTags('machines')
@UseGuards(AuthGuard('bearer'), ModuleAccessGuard)
@ApiBearerAuth()
@Controller({ path: 'machines', scope: Scope.REQUEST })
@UseInterceptors(MainAppInterceptor)
export class MachinesController {
  private readonly contextId: ContextId;

  constructor(
    @Inject(MachinesService) private readonly machinesService: MachinesService,
    @Optional() @Inject(REQUEST) private readonly request,
  ) {
    this.contextId = request[REQUEST_CONTEXT_ID];
  }

  @Get('/')
  @SetMetadata('tag', ModuleTags.MACHINES)
  @ApiOkResponse({ description: 'Returns machines data', type: MachinesResponse })
  @ApiImplicitQuery({ required: false, name: 'id', description: 'Filter for machine\'s id' })
  @ApiImplicitQuery({
    required: false, name: 'name', description: 'Filter for machine\'s name', type: [String],
  })
  @ApiImplicitQuery({
    required: false, name: 'status', description: 'Filter for machine\'s status', type: [String],
  })
  @ApiImplicitQuery({
    required: false,
    name: 'groupName',
    description: 'Filter for machine\'s group name',
    type: [String],
  })
  @ApiImplicitQuery({
    required: false,
    name: 'siteName',
    description: 'Filter for machine\'s site name',
    type: [String],
  })
  @ApiImplicitQuery({
    required: false,
    name: 'viewers',
    description: 'Filter for machine\'s viewers count',
  })
  @ApiImplicitQuery({
    required: false,
    name: 'inQueue',
    description: 'Filter for machine\'s in queue user count',
  })
  @ApiImplicitQuery({
    required: false,
    name: 'uptimeFrom',
    description: 'Filter for machine\'s uptime',
  })
  @ApiImplicitQuery({
    required: false,
    name: 'uptimeTo',
    description: 'Filter for machine\'s uptime',
  })
  @ApiImplicitQuery({ required: false, name: 'take', description: 'Number of items to take' })
  @ApiImplicitQuery({ required: false, name: 'offset', description: 'Take offset (page number)' })
  @ApiImplicitQuery({
    required: false,
    name: 'sortBy',
    description: 'Sort by column with provided name',
  })
  @ApiImplicitQuery({
    required: false,
    name: 'sortOrder',
    description: 'Sort order, ascending by default',
  })
  public async getMachines(@Query() query: any): Promise<MachinesResponse> {
    return this.machinesService.getMachines(query);
  }

  @Get('/names')
  @SetMetadata('tag', [ModuleTags.MACHINES, ModuleTags.CAMERAS, ModuleTags.MONITORING])
  @ApiOkResponse({
    description: 'Returns all operator\'s names and ids',
    type: MachineNamesResponse,
  })
  public async getMachineNames(): Promise<MachineNamesResponse> {
    return this.machinesService.getMachineNames();
  }

  @Get('/sites')
  @SetMetadata('tag', ModuleTags.MACHINES)
  @ApiOkResponse({
    description: 'Returns machine\'s sites with names and ids',
    type: SitesResponse,
  })
  public async getSites(): Promise<SitesResponse> {
    return this.machinesService.getSites(this.contextId);
  }

  @Put('/:id')
  @SetMetadata('tag', ModuleTags.MACHINES)
  @ApiImplicitParam({ name: 'id' })
  @ApiOkResponse({ description: 'Returns updated machines data', type: MachineResponse })
  public async editMachine(@Param() params: any, @Body() data: EditMachineDto): Promise<MachineResponse> {
    return this.machinesService.editMachine(params.id, data, this.contextId);
  }

  @Post('/')
  @SetMetadata('tag', ModuleTags.MACHINES)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Returns updated machines data',
    type: MachineResponse,
  })
  public async createMachine(@Body() data: CreateMachineDto): Promise<MachineResponse> {
    return this.machinesService.createMachine(data, this.contextId);
  }

  @Delete('/:id')
  @SetMetadata('tag', ModuleTags.MACHINES)
  @ApiImplicitParam({ name: 'id' })
  public async deleteMachine(@Param() params: any): Promise<void> {
    return this.machinesService.deleteMachine(params.id, this.contextId);
  }

  @Post('/:id/activate')
  @SetMetadata('tag', ModuleTags.MACHINES)
  @ApiImplicitParam({ name: 'id' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Returns updated machines data',
    type: MachineIdResponse,
  })
  public async activateMachine(
    @Param('id', ParseIntPipe) machineId: number,
    @Body() body: ActivateMachineDto,
  ): Promise<MachineIdResponse> {
    return this.machinesService.activateMachine(machineId, body);
  }

  @Post('/:id/reassign')
  @SetMetadata('tag', ModuleTags.MACHINES)
  @ApiImplicitParam({ name: 'id' })
  @ApiCreatedResponse({
    description: 'Returns target group id',
    type: ReassignMachineDto,
  })
  public async reassignMachine(
    @Param('id', ParseIntPipe) machineId: number, @Body() body: ReassignMachineDto,
  ): Promise<ReassignMachineDto> {
    try {
      return await this.machinesService.reassignMachine(machineId, body);
    } catch (reason) {
      throw new HttpException((reason.response.data && reason.response.data.data)
        || { message: 'Fatal' }, reason.response.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('/:id/dry')
  @SetMetadata('tag', ModuleTags.MACHINES)
  @ApiImplicitParam({ name: 'id' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Returns updated machines data',
    type: MachineIdResponse,
  })
  public dryMachine(@Param('id', ParseIntPipe) machineId: number): Promise<MachineIdResponse> {
    return this.machinesService.dryMachine(machineId);
  }

  @Post('/:id/shutdown')
  @SetMetadata('tag', ModuleTags.MACHINES)
  @ApiImplicitParam({ name: 'id' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Shuts down the machine',
    type: MachineIdResponse,
  })
  public shutdownMachine(@Param('id', ParseIntPipe) machineId: number): Promise<MachineIdResponse> {
    return this.machinesService.shutdownMachine(machineId);
  }

  @Post('/:id/reboot')
  @SetMetadata('tag', ModuleTags.MACHINES)
  @ApiImplicitParam({ name: 'id' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Reboot machine physically',
    type: MachineIdResponse,
  })
  public rebootMachine(@Param('id', ParseIntPipe) machineId: number): Promise<MachineIdResponse> {
    return this.machinesService.rebootMachine(machineId);
  }

  @Get('/power-lines')
  @SetMetadata('tag', ModuleTags.MACHINES)
  @ApiOkResponse({
    description: 'Returns machine\'s power lines',
    type: PowerLinesResponse,
  })
  public async getMachinePowerLines(): Promise<PowerLinesResponse> {
    return this.machinesService.getMachinePowerLines();
  }
}
