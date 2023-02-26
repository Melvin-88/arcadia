import { AppLogger } from '../modules/logger/logger.service';
import { Environments } from '../enums/environments';
import { VideoEnvironments } from '../enums/videoEnvironments';

export function envToVideoEnv(env: string, logger: AppLogger): string {
  let videoEnv: string = VideoEnvironments[Object.keys(Environments)[(<string[]>Object.values(Environments)).indexOf(env)]];
  if (!videoEnv) {
    logger.warn(`Unknown video environment for ${env}`);
    videoEnv = VideoEnvironments.DEV;
  }
  return videoEnv;
}
