import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpService,
  HttpStatus,
  Logger,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from './config/config.service';
import { CancelContributionDto, JackpotWinDto } from './dto';

@Controller('')
export class AppController {
  private readonly gameCoreApiUrl: string;
  private readonly logger: Logger = new Logger(AppController.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.gameCoreApiUrl = this.configService.get(['core', 'GAME_CORE_API_URL']) as string;
  }

  @Get('/health')
  @HttpCode(HttpStatus.OK)
  public getHealth(): any {
    return {};
  }

  @ApiBody({ type: JackpotWinDto, description: 'Jackpot win callback for Blue Ribbon' })
  @ApiOkResponse()
  @Post('/jackpotWinCb')
  public async jackpotWinCallback(@Body() data: JackpotWinDto): Promise<any> {
    const correlationId = uuidv4();
    this.logger.log(`JP win callback, winnerDetails: ${JSON.stringify(data?.winnerDetails)}, correlationId: ${correlationId}`);
    try {
      return await this.httpService.post(`${this.gameCoreApiUrl}/jackpots/win`, data,
        { headers: { correlation: correlationId } })
        .toPromise()
        .then(value => value.data);
    } catch (err) {
      throw new HttpException(err.response?.data?.data || { message: 'Fatal' },
        err.response?.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiBody({
    type: CancelContributionDto,
    description: 'Jackpot cancel contribution callback for Blue Ribbon',
  })
  @ApiOkResponse()
  @Post('/cancelJackpotContribution')
  public async cancelJackpotContribution(@Body() data: CancelContributionDto): Promise<any> {
    const correlationId = uuidv4();
    this.logger.log(`JP cancel contribution callback, cancelDetails: ${JSON.stringify(data?.cancelDetails)}, correlationId: ${correlationId}`);
    try {
      return await this.httpService.post(`${this.gameCoreApiUrl}/jackpots/cancelContribution`, data,
        { headers: { correlation: correlationId } })
        .toPromise()
        .then(value => value.data);
    } catch (err) {
      throw new HttpException(err.response?.data?.data || { message: 'Fatal' },
        err.response?.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
