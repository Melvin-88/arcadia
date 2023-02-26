import { PhantomPrizeDto } from './phantom.prize.dto';
import { SeedValue } from './seed.value';

export class RngResponseDto {
  status: 'ok' | 'err';
  rtp?: SeedValue[];
  seed?: SeedValue[];
  prize?: PhantomPrizeDto;
  msg?: string;
}