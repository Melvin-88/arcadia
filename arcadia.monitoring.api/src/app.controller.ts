import { ApiTags } from '@nestjs/swagger';
import {
  Controller,
  HttpStatus,
  HttpCode,
  Get,
} from '@nestjs/common';

@ApiTags('system')
@Controller('')
export class AppController {
  constructor(
  ) {}

  @Get('/health')
  @HttpCode(HttpStatus.OK)
  public getHealth() {
    return {};
  }
}
