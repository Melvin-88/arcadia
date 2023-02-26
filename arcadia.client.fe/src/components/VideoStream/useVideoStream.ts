import { useCallback, useEffect, useState } from 'react';
import { CSRTCVideoPlayerStatus, HLSVideoPlayerStatus, VideoPlayerType } from './types';
import { PubSubClient } from '../../services/pubSubClient/client';
import { PubSubUserEventNotification } from '../../services/pubSubClient/constants';

const pubSubClient = PubSubClient.getInstance();

export const useVideoStream = (activeVideoPlayerType: VideoPlayerType) => {
  const [hlsVideoPlayerStatus, setHLSVideoPlayerStatus] = useState<HLSVideoPlayerStatus | null>(null);
  const [csrtcVideoPlayerStatus, setCSRTCVideoPlayerStatus] = useState<CSRTCVideoPlayerStatus | null>(null);

  const getHLSVideoStreamState = useCallback(() => {
    switch (hlsVideoPlayerStatus) {
      case HLSVideoPlayerStatus.abort:
      case HLSVideoPlayerStatus.error:
      case HLSVideoPlayerStatus.stalled:
      case HLSVideoPlayerStatus.suspend:
        return {
          isLoading: false,
          error: true,
        };

      case HLSVideoPlayerStatus.waiting:
      case HLSVideoPlayerStatus.emptied:
      case HLSVideoPlayerStatus.ended:
      case HLSVideoPlayerStatus.pause:
      case HLSVideoPlayerStatus.loadstart:
        return {
          isLoading: true,
          error: false,
        };

      default:
        return {
          isLoading: false,
          error: false,
        };
    }
  }, [hlsVideoPlayerStatus]);

  const getCSRTCVideoStreamState = useCallback(() => {
    switch (csrtcVideoPlayerStatus) {
      case CSRTCVideoPlayerStatus.FAILED:
      case CSRTCVideoPlayerStatus.PAUSED:
      case CSRTCVideoPlayerStatus.STOPPED:
      case CSRTCVideoPlayerStatus.PLAYBACK_PROBLEM:
        return {
          isLoading: false,
          error: true,
        };

      case CSRTCVideoPlayerStatus.NOT_ENOUGH_BANDWIDTH:
      case CSRTCVideoPlayerStatus.PENDING:
        return {
          isLoading: true,
          error: false,
        };

      default:
        return {
          isLoading: false,
          error: false,
        };
    }
  }, [csrtcVideoPlayerStatus]);

  const getVideoStreamState = useCallback(() => {
    switch (activeVideoPlayerType) {
      case VideoPlayerType.CSRTCPlayer:
        return getCSRTCVideoStreamState();

      case VideoPlayerType.HLSPlayer:
        return getHLSVideoStreamState();

      default:
        return { isLoading: true, error: false };
    }
  }, [activeVideoPlayerType, getHLSVideoStreamState, getCSRTCVideoStreamState]);

  useEffect(() => {
    if (hlsVideoPlayerStatus) {
      pubSubClient.sendUserEventNotification({
        type: PubSubUserEventNotification.video,
        data: {
          type: VideoPlayerType.HLSPlayer,
          status: hlsVideoPlayerStatus,
        },
      });
    }
  }, [hlsVideoPlayerStatus]);

  useEffect(() => {
    if (csrtcVideoPlayerStatus) {
      pubSubClient.sendUserEventNotification({
        type: PubSubUserEventNotification.video,
        data: {
          type: VideoPlayerType.CSRTCPlayer,
          status: csrtcVideoPlayerStatus,
        },
      });
    }
  }, [csrtcVideoPlayerStatus]);

  return {
    ...getVideoStreamState(),
    setHLSVideoPlayerStatus,
    setCSRTCVideoPlayerStatus,
  };
};
