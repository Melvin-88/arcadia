import React from 'react';
import { IStyleFunctionOrObject, styled } from '@uifabric/utilities';
import { useTranslation } from 'react-i18next';
import { CSRTCVideoPlayer } from './CSRTCVideoPlayer/CSRTCVideoPlayer';
import { HLSVideoPlayer } from './HLSVideoPlayer/HLSVideoPlayer';
import { LoadingOverlay } from '../loaders/LoadingOverlay/LoadingOverlay';
import { LiveStreamBadge } from './LiveStreamBadge';
import { SessionStatus } from '../../types/session';
import { isPassiveSessionStatus } from '../../services/general';
import { VideoPlayerType } from './types';
import { useVideoStream } from './useVideoStream';
import {
  getClassNames, getStyles, IVideoStreamStyleProps, IVideoStreamStyles,
} from './styles/VideoStream';

interface IVideoStreamProps extends Partial<IVideoStreamStyleProps> {
  styles?: IStyleFunctionOrObject<IVideoStreamStyleProps, IVideoStreamStyles>;
  sessionStatus: SessionStatus;
  authToken: string;
  serviceEnv: string;
  rtsp: string;
  wss: string;
  hlsStreamSrc: string;
  volume?: number;
}

const VideoStreamBase: React.FC<IVideoStreamProps> = React.memo(({
  styles,
  className,
  sessionStatus,
  authToken,
  serviceEnv,
  rtsp,
  wss,
  hlsStreamSrc,
  volume = 0,
}) => {
  const { t } = useTranslation();

  const playerType = isPassiveSessionStatus(sessionStatus)
    ? VideoPlayerType.HLSPlayer
    : VideoPlayerType.CSRTCPlayer;

  const {
    isLoading, error, setHLSVideoPlayerStatus, setCSRTCVideoPlayerStatus,
  } = useVideoStream(playerType);

  const videoStreamURLQueryString = `?authkey=${authToken}&env=${serviceEnv}`;

  const classNames = getClassNames(styles, { className });

  return (
    <div className={classNames.root}>
      { playerType === VideoPlayerType.HLSPlayer ? (
        <HLSVideoPlayer
          className={classNames.videoPlayer}
          volume={volume / 100}
          src={`${hlsStreamSrc}${videoStreamURLQueryString}`}
          onStatusChange={setHLSVideoPlayerStatus}
        />
      ) : (
        <CSRTCVideoPlayer
          className={classNames.videoPlayer}
          url={`${wss}${videoStreamURLQueryString}`}
          volume={volume}
          rtsp={rtsp}
          onStatusChange={setCSRTCVideoPlayerStatus}
        />
      ) }
      { error && (
        <b className={classNames.errorMessage}>{t('VideoStream.Failed')}</b>
      ) }
      <LoadingOverlay
        className={classNames.loadingOverlay}
        isVisible={isLoading}
        message={t('VideoStream.Loading')}
        e2eSelector="video-stream-loading-overlay"
      />
      { !isLoading && !error && (
        <LiveStreamBadge className={classNames.liveStreamBadge} />
      ) }
    </div>
  );
});

export const VideoStream = styled<IVideoStreamProps, IVideoStreamStyleProps, IVideoStreamStyles>(
  VideoStreamBase,
  getStyles,
);
