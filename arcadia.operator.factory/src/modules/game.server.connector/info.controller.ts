import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { OperatorFactory } from '../adapter.factory/operator.factory';
import { ConfigService } from '../config/config.service';

@ApiTags('Info')
@Controller('v1/info')
export class InfoController {
  constructor(
    private readonly config: ConfigService,
    private readonly operatorFactory: OperatorFactory,
  ) {
  }

  @ApiOkResponse({ description: 'Success', type: [String] })
  @Get('activeOperators')
  getActiveOperators(): string[] {
    return this.operatorFactory.getOperators();
  }

  @ApiOkResponse({ description: 'Success' })
  @Get('version')
  getVersion(): Record<string, any> {
    return { apiVersion: this.config.get(['core', 'API_VERSION']) };
  }
}
