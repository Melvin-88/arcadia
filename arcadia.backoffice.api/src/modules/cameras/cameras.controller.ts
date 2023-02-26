import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  Query, Res,
  SetMetadata,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiImplicitQuery } from '@nestjs/swagger/dist/decorators/api-implicit-query.decorator';
import { ApiImplicitParam } from '@nestjs/swagger/dist/decorators/api-implicit-param.decorator';
import { AuthGuard } from '@nestjs/passport';
import { MainAppInterceptor } from '../../interceptors/app';
import { CamerasService } from './cameras.service';
import {
  CameraResponse,
  CamerasResponse,
  StreamAuthTokenResponse,
  StreamsResponse,
} from './cameras.interface';
import { AddCameraDto, EditCameraDto, ToggleStreamDto } from './cameras.dto';
import { SitesResponse } from '../players/players.interface';
import { ModuleTags } from '../../enums';
import { ModuleAccessGuard } from '../../guards';

@ApiTags('cameras')
@Controller('cameras')
@UseGuards(AuthGuard('bearer'), ModuleAccessGuard)
@ApiBearerAuth()
@UseInterceptors(MainAppInterceptor)
export class CamerasController {
  constructor(
    @Inject(CamerasService) private readonly camerasService: CamerasService,
  ) {}

  @Get('/sites')
  @SetMetadata('tag', ModuleTags.CAMERAS)
  @ApiOkResponse({ description: 'Return site\'s data', type: SitesResponse })
  public getSites(): Promise<SitesResponse> {
    return this.camerasService.getSites();
  }

  @Get('/')
  @SetMetadata('tag', ModuleTags.CAMERAS)
  @ApiOkResponse({ description: 'Returns cameras users\' data', type: CamerasResponse })
  @ApiImplicitQuery({ required: true, name: 'site', description: 'Camera\'s site' })
  @ApiImplicitQuery({ required: false, name: 'id', description: 'Filter for camera\'s id' })
  @ApiImplicitQuery({ required: false, name: 'type', description: 'Filter for camera\'s type' })
  @ApiImplicitQuery({
    required: false, name: 'recordingStatus', description: 'Filter for camera\'s recording status', type: [String],
  })
  @ApiImplicitQuery({ required: false, name: 'cameraIp', description: 'Filter for camera\'s ip' })
  @ApiImplicitQuery({
    required: false, name: 'machine', description: 'Filter for camera\'s machine', type: [String],
  })
  @ApiImplicitQuery({ required: false, name: 'take', description: 'Number of items to take' })
  @ApiImplicitQuery({ required: false, name: 'offset', description: 'Take offset (page number)' })
  @ApiImplicitQuery({ required: false, name: 'sortBy', description: 'Sort by column with provided name' })
  @ApiImplicitQuery({ required: false, name: 'sortOrder', description: 'Sort order, ascending by default' })
  public getCameras(@Query() query: any): Promise<CamerasResponse> {
    if (!query.site) {
      throw new BadRequestException('Site is required');
    }
    return this.camerasService.getCameras(query, query.site);
  }

  @Get('/:site/:id/streams')
  @SetMetadata('tag', ModuleTags.CAMERAS)
  @ApiImplicitParam({ name: 'id' })
  @ApiImplicitParam({ name: 'site', description: 'Camera\'s site' })
  @ApiOkResponse({ description: 'Returns camera\'s streams data', type: StreamsResponse })
  @ApiImplicitQuery({ required: false, name: 'take', description: 'Number of items to take' })
  @ApiImplicitQuery({ required: false, name: 'offset', description: 'Take offset (page number)' })
  public getStreams(@Param() params): Promise<StreamsResponse> {
    return this.camerasService.getStreams(params.site, params.id);
  }

  @Post('/:site')
  @SetMetadata('tag', ModuleTags.CAMERAS)
  @ApiImplicitParam({ name: 'site', description: 'Camera\'s site' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Returns new camera\'s data', type: CameraResponse })
  public addCamera(@Body() data: AddCameraDto, @Param() params): Promise<CameraResponse> {
    return this.camerasService.addCamera(params.site, data);
  }

  @Put('/:site/:id')
  @SetMetadata('tag', ModuleTags.CAMERAS)
  @ApiImplicitParam({ name: 'site', description: 'Camera\'s site' })
  @ApiImplicitParam({ name: 'id' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns new camera\'s data', type: CameraResponse })
  public editCamera(@Body() data: EditCameraDto, @Param() params): Promise<CameraResponse> {
    return this.camerasService.editCamera(params.site, params.id, data);
  }

  @Delete('/:site/:id')
  @SetMetadata('tag', ModuleTags.CAMERAS)
  @ApiImplicitParam({ name: 'id' })
  @ApiImplicitParam({ name: 'site', description: 'Camera\'s site' })
  public removeCamera(@Param() params): Promise<void> {
    return this.camerasService.deleteCamera(params.site, params.id);
  }

  @Post('/:site/:id/reset')
  @SetMetadata('tag', ModuleTags.CAMERAS)
  @ApiImplicitParam({ name: 'id' })
  @ApiImplicitParam({ name: 'site', description: 'Camera\'s site' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Returns updated camera\'s data', type: CameraResponse })
  public resetCamera(@Param() params): Promise<CameraResponse> {
    return this.camerasService.resetCamera(params.site, params.id);
  }

  @Post('/:site/:id/recording')
  @SetMetadata('tag', ModuleTags.CAMERAS)
  @ApiImplicitParam({ name: 'site', description: 'Camera\'s site' })
  @ApiImplicitParam({ name: 'id', description: 'Camera\'s id' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Returns updated camera\'s data', type: CameraResponse })
  public toggleStreamRecording(@Param() params, @Body() data: ToggleStreamDto): Promise<CameraResponse> {
    return this.camerasService.toggleStreamRecording(params.site, params.id, data.isRecorded);
  }

  @Get('/:site/:id/recordingUrl')
  @SetMetadata('tag', ModuleTags.CAMERAS)
  @ApiImplicitParam({ name: 'id' })
  @ApiImplicitParam({ name: 'site', description: 'Camera\'s site' })
  @ApiOkResponse({ description: 'Returns recording', type: Buffer })
  @ApiImplicitQuery({ required: true, name: 'fromDateTime', description: 'Starting date of recording. Must be in the past' })
  @ApiImplicitQuery({ required: true, name: 'toDateTime', description: 'End date of recording. Must be in the past' })
  public getRecording(@Query() query, @Param() params, @Res() res: any): Promise<void> {
    return this.camerasService.getRecording(params.site, params.id, query.fromDateTime, query.toDateTime, res);
  }

  @Get('/streamAuthToken')
  @SetMetadata('tag', ModuleTags.CAMERAS)
  @ApiOkResponse({ description: 'Returns jwt token for stream authorization', type: StreamAuthTokenResponse })
  public getAuthStreamToken(): Promise<StreamAuthTokenResponse> {
    return this.camerasService.getAuthStreamToken();
  }
}
