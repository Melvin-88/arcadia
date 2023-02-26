import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post } from '@nestjs/common';
import { LogDto } from './dto/log.dto';
import { VideoServerService } from './videServer.service';

@ApiTags('videoServer')
@Controller(({ path: 'videoServer' }))
export class VideoServerController {
  constructor(
    private readonly videoServerService: VideoServerService,
  ) {}

  @Post('pushLog')
  @ApiCreatedResponse({ description: 'Log pushed successfully' })
  public async pushLog(@Body() data: LogDto): Promise<void> {
    return this.videoServerService.pushLog(data);
  }
}
