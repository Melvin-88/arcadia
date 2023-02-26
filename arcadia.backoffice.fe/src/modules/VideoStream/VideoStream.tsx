import React, {
  useState, useEffect,
} from 'react';
import classNames from 'classnames';
import './VideoStream.scss';

interface IVideoStreamProps {
  className?: string
  rtsp: string
  wss: string
  authToken: string
}

export const VideoStream: React.FC<IVideoStreamProps> = React.memo(({
  className, rtsp, wss, authToken,
}) => {
  const { SESSION_STATUS, STREAM_STATUS } = window?.CSRTCPlayer?.constants || {};

  const rootRef = React.useRef(null);
  const [sessionId, setSessionId] = useState<any>(null);
  const [isFailed, setIsFailed] = useState(false);

  const playStream = (session: any) => {
    try {
      const options = {
        name: rtsp,
        display: rootRef.current,
      };

      const newStream = session.createStream(options)
        .on(STREAM_STATUS.PLAYING, () => {
          setIsFailed(false);
        }).on(STREAM_STATUS.STOPPED, () => {
          setIsFailed(true);
        }).on(STREAM_STATUS.FAILED, () => {
          setIsFailed(true);
        })
        .on(STREAM_STATUS.NOT_ENOUGH_BANDWIDTH, (stream: any) => {
          setIsFailed(true);
          // eslint-disable-next-line
        console.log(`Not enough bandwidth, consider using lower video resolution or bitrate. Bandwidth ${Math.round(stream.getNetworkBandwidth() / 1000)} bitrate ${Math.round(stream.getRemoteBitrate() / 1000)}`);
        });

      newStream.play();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  };

  const createSession = () => {
    if (sessionId) {
      const sessions = window.CSRTCPlayer.getSessions();
      const session = sessions.find((item: any) => item.id() === sessionId);

      playStream(session);
    } else {
      window.CSRTCPlayer
        .createSession({ urlServer: `${wss}?authkey=${authToken}` })
        .on(SESSION_STATUS.ESTABLISHED, (session: any) => {
          setSessionId(session.id());
          playStream(session);
        }).on(SESSION_STATUS.DISCONNECTED, () => {
          setIsFailed(true);
        }).on(SESSION_STATUS.FAILED, () => {
          setIsFailed(true);
        });
    }
  };

  useEffect(() => {
    if (window?.CSRTCPlayer?.constants && !sessionId) {
      window.CSRTCPlayer.init({});
      createSession();
    }
  }, []);

  return (
    <div ref={rootRef} className={classNames('video-stream', className)}>
      {isFailed && <b className="video-stream__failed">Failed</b>}
    </div>
  );
});
