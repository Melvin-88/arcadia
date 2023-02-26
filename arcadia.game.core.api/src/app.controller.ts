import {
  Controller, Get, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('system')
@Controller('')
export class AppController {
  constructor(
    // eslint-disable-next-line @typescript-eslint/no-empty-function
  ) {
  }

  @Get('/health')
  @HttpCode(HttpStatus.OK)
  public getHealth(): any {
    return {};
  }
}
