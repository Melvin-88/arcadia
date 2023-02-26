import {
  Body,
  Controller,
  Inject,
  Post,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AlertsService } from './alerts.service';
import { AlertCreateDto } from './dto';

@ApiTags('alerts')
@Controller('alerts')
export class AlertsController {
  constructor(
    @Inject(AlertsService) private readonly alertsService: AlertsService,
  ) {}

  @Post('/')
  @ApiOkResponse({ description: 'Log pushed successfully' })
  public async createAlert(@Body() data: AlertCreateDto): Promise<void> {
    return this.alertsService.createAlert(data);
  }
}
