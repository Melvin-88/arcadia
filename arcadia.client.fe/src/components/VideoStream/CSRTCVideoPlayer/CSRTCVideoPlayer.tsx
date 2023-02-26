// TODO: Should be fully reviewed and optimized after final video API provided by 3rd party
import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import { IStyleFunctionOrObject, styled } from '@uifabric/utilities';
import { toast } from 'react-toastify';
import { usePrevious } from '../../../hooks/usePrevious';
import { CSRTCVideoPlayerStatus } from '../types';
import {
  getClassNames,
  getStyles,
  ICSRTCVideoPlayerStyleProps,
  ICSRTCVideoPlayerStyles,
} from './styles/CSRTCVideoPlayer';

const { SESSION_STATUS } = window.CSRTCPlayer.constants;

try {
  window.CSRTCPlayer.init({
  });
} catch (error) {
  // eslint-disable-next-line no-console
  toast.error(error);
}

interface IVideoStream {
  setVolume: (volume: number) => void;
  play: () => void;
  on: (status: CSRTCVideoPlayerStatus, callback: () => void) => void;
}

interface ICSRTCVideoPlayerProps extends Partial<ICSRTCVideoPlayerStyleProps> {
  styles?: IStyleFunctionOrObject<ICSRTCVideoPlayerStyleProps, ICSRTCVideoPlayerStyles>;
  url: string;
  rtsp: string;
  volume?: number;
  onStatusChange: (status: CSRTCVideoPlayerStatus) => void;
}

const CSRTCVideoPlayerBase: React.FC<ICSRTCVideoPlayerProps> = React.memo(({
  styles,
  className,
  url,
  rtsp,
  volume = 0,
  onStatusChange,
}) => {
  const videoContainerRef = useRef<HTMLDivElement | null>(null);
  const streamRef = useRef<IVideoStream>();
  const [sessionId, setSessionId] = useState<any>(null);

  const previousURL = usePrevious(url);

  const handleSetPlayingPlayerStatus = useCallback(() => {
    streamRef.current?.setVolume(volume);
  }, [streamRef.current, volume]);

  const handlePlayStream = useCallback((session: any) => {
    try {
      const options = {
        name: rtsp,
        display: videoContainerRef.current,
      };

      streamRef.current = session.createStream(options)
        .on(CSRTCVideoPlayerStatus.PLAYING, handleSetPlayingPlayerStatus);

      Object.values(CSRTCVideoPlayerStatus).forEach((status) => {
        streamRef.current?.on(status, () => {
          onStatusChange(status);
        });
      });

      streamRef.current?.play();
    } catch (error) {
      toast.error(error);
    }
  }, [videoContainerRef.current, streamRef.current, rtsp, handleSetPlayingPlayerStatus, onStatusChange]);

  const handleCreateSession = useCallback((forceReInit = false) => {
    if (videoContainerRef.current) {
      videoContainerRef.current.innerHTML = '';
    }

    if (sessionId && !forceReInit) {
      const sessions = window.CSRTCPlayer.getSessions();
      const session = sessions.find((item: any) => item.id() === sessionId);

      handlePlayStream(session);
    } else {
      window.CSRTCPlayer
        .createSession({ urlServer: url })
        .on(SESSION_STATUS.ESTABLISHED, (session: any) => {
          setSessionId(session.id());
          handlePlayStream(session);
        });
      // TODO: Implement session status listening
      // .on(SESSION_STATUS.PENDING, handleSetLoadingPlayerStatus)
      // .on(SESSION_STATUS.DISCONNECTED, handleSetErrorPlayerStatus)
      // .on(SESSION_STATUS.FAILED, handleSetErrorPlayerStatus)
      // .on(SESSION_STATUS.UNREGISTERED, handleSetErrorPlayerStatus);
    }
  }, [videoContainerRef.current, sessionId, url, handlePlayStream]);

  useEffect(() => {
    if (url && rtsp) {
      const forceReInit = previousURL !== url;

      handleCreateSession(forceReInit);
    }
  }, [previousURL, rtsp]);

  useEffect(() => {
    streamRef.current?.setVolume(volume);
  }, [volume]);

  const classNames = getClassNames(styles, { className });

  return (
    <div ref={videoContainerRef} className={classNames.videoPlayer} />
  );
});

export const CSRTCVideoPlayer = styled<ICSRTCVideoPlayerProps, ICSRTCVideoPlayerStyleProps, ICSRTCVideoPlayerStyles>(
  CSRTCVideoPlayerBase,
  getStyles,
);
