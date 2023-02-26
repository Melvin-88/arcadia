import { ScatterType } from '../enums';
import { AutoplayConfiguration } from './autoplay.configuration';
import { BetBehindConfiguration } from './bet.behind.configuration';
import { Dispenser } from './dispenser';
import { MinimalHold } from './minimal.hold';

export class Configuration {
  autoplay?: AutoplayConfiguration;
  betBehind?: BetBehindConfiguration;
  minimalHold?: MinimalHold;
  dispensers?: Record<string, Dispenser>;
  rtpSegment?: string;
  reshuffleCoinsEmpty?: number;
  reshuffleCoinsNonEmpty?: number;
  countryWhitelist?: string[];
  slot?: string[];
  scatterType?: ScatterType;
}
