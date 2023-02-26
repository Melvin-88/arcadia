import { Howl, HowlOptions } from 'howler';
import { PATH_TO_SOUND } from './constants';

export const createSoundChannel = (filename: string, options?: HowlOptions): Howl => new Howl({
  src: [`${PATH_TO_SOUND}/${filename}.mp3`, `${PATH_TO_SOUND}/${filename}.wav`],
  volume: 0,
  ...options,
});
