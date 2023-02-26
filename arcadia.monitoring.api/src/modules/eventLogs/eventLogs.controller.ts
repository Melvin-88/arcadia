import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  Controller, Get, Inject, Param, Query, UseInterceptors, UsePipes, ValidationPipe,
} from '@nestjs/common';
import { ApiImplicitQuery } from '@nestjs/swagger/dist/decorators/api-implicit-query.decorator';
import { MainAppInterceptor } from '../../interceptors/app';
import { EventLogService } from './eventLog.service';
import { EventLogsResponse } from './eventLog.interface';

@ApiTags('eventLogs')
@Controller('/eventLogs')
@UseInterceptors(MainAppInterceptor)
@UsePipes(new ValidationPipe({
  transform: true,
  whitelist: true,
}))
export class EventLogsController {
  constructor(
        @Inject(EventLogService) private readonly eventLogService: EventLogService,
  ) {}

    @Get('/:sessionId')
    @ApiOkResponse({ description: 'Returns session event logs for provided session id', type: EventLogsResponse })
    @ApiImplicitQuery({
      required: false, name: 'source', description: 'Filter for logs\'s source', type: [String],
    })
    @ApiImplicitQuery({ required: false, name: 'type', description: 'Filter for logs\'s type' })
    @ApiImplicitQuery({ required: false, name: 'dateFrom', description: 'Filter for logs\'s creation date' })
    @ApiImplicitQuery({ required: false, name: 'dateTo', description: 'Filter for logs\'s creation date' })
    @ApiImplicitQuery({ required: false, name: 'take', description: 'Number of items to take' })
    @ApiImplicitQuery({ required: false, name: 'offset', description: 'Take offset (page number)' })
  public async getEventLogs(@Query() query: any, @Param() params: any): Promise<EventLogsResponse> {
    return this.eventLogService.getEventLogs(parseInt(params.sessionId, 10), query);
  }
}