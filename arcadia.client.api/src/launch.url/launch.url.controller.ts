import {
  Body,
  Controller,
  HttpException,
  HttpService,
  HttpStatus,
  Logger,
  Param,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotAcceptableResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';
import { isIP } from 'net';
import * as requestIp from 'request-ip';
import { map } from 'rxjs/operators';
import { CreateUrlDto } from './CreateUrlDto';

@ApiTags('Launch Url')
@Controller('v1/launchUrl')
export class LaunchUrlController {
  private readonly logger = new Logger(LaunchUrlController.name);

  constructor(private readonly httpService: HttpService) {
  }

  @ApiCreatedResponse({ description: 'Launch url created' })
  @ApiNotAcceptableResponse({ description: 'Operator not found' })
  @ApiUnauthorizedResponse({ description: 'Token verification failed' })
  @ApiBadRequestResponse({ description: 'Request validation error' })
  @Post('/:operatorId/create')
  public async createLaunchUrl(
    @Req() req: Request, @Param('operatorId') operator: string, @Body() data: CreateUrlDto,
  ): Promise<any> {
    this.logger.log(`Creating url: ${JSON.stringify(data)}`);
    const callerIp: string = requestIp.getClientIp(req);
    if (!data.authToken && (!callerIp || isIP(callerIp) === 0)) {
      throw new UnauthorizedException('Auth token is missing or IP is unknown');
    }
    try {
      return await this.httpService.post('auth/launchUrl/create', { ...data, operator, callerIp })
        .pipe(map(data => data.data))
        .toPromise();
    } catch (reason) {
      throw new HttpException(reason.response?.data?.data || { message: 'Fatal' },
        reason.response?.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
