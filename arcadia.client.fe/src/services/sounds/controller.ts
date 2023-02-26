import { Howl } from 'howler';
import { FADE_DURATION } from './constants';
import { createSoundChannel } from './helpers';
import {
  BackgroundSound, ButtonSound, ChipWinSound, GameEventSound, SoundChannel, SoundEffect,
} from './types';

const lobbyBackgroundChannel = createSoundChannel('backgroundMusicLobby', { loop: true });
const queueBackgroundChannel = createSoundChannel('backgroundMusicQueueStatus', { loop: true });
const gameBackgroundChannel = createSoundChannel('backgroundMusicPlayingStatus', { loop: true });

const primaryButtonChannel = createSoundChannel('buttonPrimaryClick');
const secondaryButtonChannel = createSoundChannel('buttonSecondaryClick');
const toggleButtonChannel = createSoundChannel('toggleButton');

const whooshSecondaryChannel = createSoundChannel('whooshSecondary');
const dialogOpenChannel = createSoundChannel('dialogOpen');
const joystickTickChannel = createSoundChannel('joystickTick');
const disappointChannel = createSoundChannel('disappoint');

const queueStateChangeChannel = createSoundChannel('queueStateChange');
const timeoutOverChannel = createSoundChannel('timeoutOver');
const chipDetectionChannel = createSoundChannel('chipDetection');
const jackpotWinChannel = createSoundChannel('jackpotWin');
const sessionResultChannel = createSoundChannel('sessionResult');
const fortuneWheelStartChannel = createSoundChannel('fortuneWheelStart');
const fortuneWheelTickChannel = createSoundChannel('fortuneWheelTick');
const scatterRoundStartChannel = createSoundChannel('scatterRoundStart');
const scatterRoundWinChannel = createSoundChannel('scatterRoundWin');

const chipWinPrimaryChannel = createSoundChannel('chipWinPrimary');
const chipWinSecondaryChannel = createSoundChannel('chipWinSecondary');
const chipWinTertiaryChannel = createSoundChannel('chipWinTertiary');
const chipWinQuaternaryChannel = createSoundChannel('chipWinQuaternary');
const chipWinQuinaryChannel = createSoundChannel('chipWinQuinary');
const chipWinPhantomChannel = createSoundChannel('chipWinPhantom');

export class SoundsController {
  private static instance: SoundsController;

  static getInstance(): SoundsController {
    if (!SoundsController.instance) {
      SoundsController.instance = new SoundsController();
    }

    return SoundsController.instance;
  }

  private channelsMap: { [key in SoundChannel]: Howl } = {
    [SoundChannel.lobbyBackground]: lobbyBackgroundChannel,
    [SoundChannel.queueBackground]: queueBackgroundChannel,
    [SoundChannel.gameBackground]: gameBackgroundChannel,
    [SoundChannel.primaryButton]: primaryButtonChannel,
    [SoundChannel.secondaryButton]: secondaryButtonChannel,
    [SoundChannel.toggleButton]: toggleButtonChannel,
    [SoundChannel.joystickTick]: joystickTickChannel,
    [SoundChannel.whooshSecondary]: whooshSecondaryChannel,
    [SoundChannel.queueStateChange]: queueStateChangeChannel,
    [SoundChannel.timeoutOver]: timeoutOverChannel,
    [SoundChannel.dialogOpen]: dialogOpenChannel,
    [SoundChannel.disappoint]: disappointChannel,
    [SoundChannel.fortuneWheelStart]: fortuneWheelStartChannel,
    [SoundChannel.fortuneWheelTick]: fortuneWheelTickChannel,
    [SoundChannel.scatterRoundStart]: scatterRoundStartChannel,
    [SoundChannel.scatterRoundWin]: scatterRoundWinChannel,
    [SoundChannel.chipDetection]: chipDetectionChannel,
    [SoundChannel.chipWinPrimary]: chipWinPrimaryChannel,
    [SoundChannel.chipWinSecondary]: chipWinSecondaryChannel,
    [SoundChannel.chipWinTertiary]: chipWinTertiaryChannel,
    [SoundChannel.chipWinQuaternary]: chipWinQuaternaryChannel,
    [SoundChannel.chipWinQuinary]: chipWinQuinaryChannel,
    [SoundChannel.chipWinPhantom]: chipWinPhantomChannel,
    [SoundChannel.jackpotWin]: jackpotWinChannel,
    [SoundChannel.sessionResult]: sessionResultChannel,
  };

  private get channels() {
    return Object.values(this.channelsMap);
  }

  public get backgroundChannels() {
    return [
      this.channelsMap[SoundChannel.lobbyBackground],
      this.channelsMap[SoundChannel.queueBackground],
      this.channelsMap[SoundChannel.gameBackground],
    ];
  }

  preloadResources = () => {
    const promises = this.channels.map((channel) => (
      new Promise((resolve) => channel.once('load', resolve))
    ));

    return Promise.all(promises);
  };

  // TODO: refactor method to handle same type fading out after sounds approve
  playBackgroundSound = (type: BackgroundSound) => {
    let soundToPlay: Howl | null = null;

    switch (type) {
      case BackgroundSound.lobby:
        soundToPlay = this.channelsMap[SoundChannel.lobbyBackground];
        break;
      case BackgroundSound.queue:
        soundToPlay = this.channelsMap[SoundChannel.queueBackground];
        break;
      case BackgroundSound.game:
        soundToPlay = this.channelsMap[SoundChannel.gameBackground];
        break;
      default:
        break;
    }

    if (soundToPlay) {
      this.stopChannels(this.backgroundChannels.filter((bgCh) => bgCh !== soundToPlay));
      this.playChannel(soundToPlay);
    }
  };

  playButtonSound = (type: ButtonSound) => {
    switch (type) {
      case ButtonSound.primary:
        this.channelsMap[SoundChannel.primaryButton].play();
        break;
      case ButtonSound.secondary:
        this.channelsMap[SoundChannel.secondaryButton].play();
        break;
      case ButtonSound.toggle:
        this.channelsMap[SoundChannel.toggleButton].play();
        break;
      default:
        break;
    }
  };

  playSoundEffect = (type: SoundEffect) => {
    switch (type) {
      case SoundEffect.whooshSecondary:
        this.channelsMap[SoundChannel.whooshSecondary].play();
        break;
      case SoundEffect.dialogOpenToggle:
        this.channelsMap[SoundChannel.dialogOpen].play();
        break;
      case SoundEffect.joystickTick:
        this.channelsMap[SoundChannel.joystickTick].play();
        break;
      case SoundEffect.disappoint:
        this.channelsMap[SoundChannel.disappoint].play();
        break;
      default:
        break;
    }
  };

  playGameEventSound = (type: GameEventSound) => {
    switch (type) {
      case GameEventSound.chipDetection:
        this.channelsMap[SoundChannel.chipDetection].play();
        break;
      case GameEventSound.jackpotWin:
        this.channelsMap[SoundChannel.jackpotWin].play();
        break;
      case GameEventSound.sessionResult:
        this.channelsMap[SoundChannel.sessionResult].play();
        break;
      case GameEventSound.queue:
        this.channelsMap[SoundChannel.queueStateChange].play();
        break;
      case GameEventSound.timeout:
        this.channelsMap[SoundChannel.timeoutOver].play();
        break;
      case GameEventSound.scatterRoundStart:
        this.channelsMap[SoundChannel.scatterRoundStart].play();
        break;
      case GameEventSound.scatterRoundWin:
        this.channelsMap[SoundChannel.scatterRoundWin].play();
        break;
      case GameEventSound.fortuneWheelStart:
        this.channelsMap[SoundChannel.fortuneWheelStart].play();
        break;
      case GameEventSound.fortuneWheelTick:
        this.channelsMap[SoundChannel.fortuneWheelTick].play();
        break;
      default:
        break;
    }
  };

  playChipWinSound = (type: ChipWinSound) => {
    switch (type) {
      case ChipWinSound.chipWinPrimary:
        this.channelsMap[SoundChannel.chipWinPrimary].play();
        break;
      case ChipWinSound.chipWinSecondary:
        this.channelsMap[SoundChannel.chipWinSecondary].play();
        break;
      case ChipWinSound.chipWinTertiary:
        this.channelsMap[SoundChannel.chipWinTertiary].play();
        break;
      case ChipWinSound.chipWinQuaternary:
        this.channelsMap[SoundChannel.chipWinQuaternary].play();
        break;
      case ChipWinSound.chipWinQuinary:
        this.channelsMap[SoundChannel.chipWinQuinary].play();
        break;
      case ChipWinSound.chipWinPhantom:
        this.channelsMap[SoundChannel.chipWinPhantom].play();
        break;
      default:
        this.channelsMap[SoundChannel.chipWinQuinary].play();
        break;
    }
  };

  playChannel = (channel: Howl) => {
    if (!channel.playing()) {
      channel.fade(0, channel.volume(), FADE_DURATION);
      channel.play();
    }
  };

  setVolume = (volume: number) => {
    this.channels.forEach((channel) => channel.volume(volume));
  };

  private stopChannels = (group: Howl[]) => {
    group.forEach((channel) => {
      if (channel.playing()) {
        channel.fade(channel.volume(), 0, FADE_DURATION);
        // TODO: We need regulation between fade in and fade out after first priority tasks
        channel.once('fade', () => {
          channel.stop();
        });
      }
    });
  };
}
