import { AutoplayStatus } from '../enum/autoplay.status';
import { AutoplayConfigDto } from './autoplay.config.dto';

export class AutoplayDto {
  status: AutoplayStatus;
  config?: AutoplayConfigDto
}