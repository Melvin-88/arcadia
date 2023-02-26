import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import { IStyleFunctionOrObject, styled } from '@uifabric/utilities';
import { HLSVideoPlayerStatus } from '../types';
import {
  IHLSVideoPlayerStyleProps, IHLSVideoPlayerStyles, getClassNames, getStyles,
} from './styles/HLSVideoPlayer';

(window as any).window.HELP_IMPROVE_VIDEOJS = false;

interface IHLSVideoPlayerProps extends Partial<IHLSVideoPlayerStyleProps> {
  styles?: IStyleFunctionOrObject<IHLSVideoPlayerStyleProps, IHLSVideoPlayerStyles>;
  src: string;
  volume: number;
  onStatusChange: (status: HLSVideoPlayerStatus) => void;
}

export const HLSVideoPlayerBase: React.FC<IHLSVideoPlayerProps> = React.memo(({
  styles, className, volume, src, onStatusChange,
}) => {
  const refVideo = useRef<HTMLVideoElement>(null);
  const refPlayer = useRef<videojs.Player | null>(null);

  const classNames = getClassNames(styles, { className });

  useEffect(() => {
    refPlayer.current = videojs(
      refVideo.current,
      {
        controls: false,
        autoplay: true,
        fluid: false,
        liveui: false,
        nativeControlsForTouch: false,
        defaultVolume: volume,
        children: [],
      },
      () => {
        refPlayer.current?.addClass(classNames.hlsVideoPlayer);
      },
    );

    Object.values(HLSVideoPlayerStatus).forEach((status) => {
      refPlayer.current?.on(status, () => {
        onStatusChange(status);
      });
    });

    refPlayer.current?.src({
      src,
      type: 'application/vnd.apple.mpegurl',
    });

    return () => {
      // TODO: Dispose player and handle relative DOM cleanups
      // refPlayer.current?.dispose();
    };
  }, [refVideo.current, onStatusChange]);

  useEffect(() => {
    refPlayer.current?.volume(volume);
  }, [refPlayer.current, volume]);

  return (
    <div className={classNames.hlsVideoPlayerContainer}>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        ref={refVideo}
        // @ts-ignore
        type="application/vnd.apple.mpegurl"
      />
    </div>
  );
});

export const HLSVideoPlayer = styled<IHLSVideoPlayerProps, IHLSVideoPlayerStyleProps, IHLSVideoPlayerStyles>(
  HLSVideoPlayerBase,
  getStyles,
);
