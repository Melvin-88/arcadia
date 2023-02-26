import { Type } from 'class-transformer';
import { IsBoolean, IsNumber, ValidateNested } from 'class-validator';
import { SessionAwareDto } from '../../../dto/session.aware.dto';

class SoundsConfig {
  @IsBoolean()
  public isAllSoundsMuted: boolean;

  @IsBoolean()
  public isMachineSoundsMuted: boolean;

  @IsBoolean()
  public isGameSoundsMuted: boolean;

  @IsNumber()
  public machineSoundsVolume: number;

  @IsNumber()
  public gameSoundsVolume: number;
}

export class SettingsUpdateMessageDto extends SessionAwareDto {
  @Type(() => SoundsConfig)
  @ValidateNested()
  settings: SoundsConfig;
}
