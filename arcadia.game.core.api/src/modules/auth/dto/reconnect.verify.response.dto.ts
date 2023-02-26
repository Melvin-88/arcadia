import { ApiResponseProperty } from '@nestjs/swagger';
import { TokenVerifyRespDto } from './token.verify.resp.dto';

export class ReconnectVerifyResponseDto extends TokenVerifyRespDto {
  @ApiResponseProperty()
  rounds: number;

  @ApiResponseProperty()
  coins: number;

  @ApiResponseProperty()
  joinRobotDirectRoom: boolean;

  @ApiResponseProperty()
  queueToken: string;

  @ApiResponseProperty()
  totalWin: number;
}
