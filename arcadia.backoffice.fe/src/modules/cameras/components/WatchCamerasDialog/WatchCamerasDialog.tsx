import React, { useCallback } from 'react';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog, DialogType, Spinner } from 'arcadia-common-fe';
import { camerasDialogWatchSelector } from '../../state/selectors';
import { setCamerasWatch } from '../../state/actions';
import { VideoStream } from '../../../VideoStream/VideoStream';
import './WatchCamerasDialog.scss';

export interface IWatchCamerasDialogProps {
}

export const WatchCamerasDialog: React.FC<IWatchCamerasDialogProps> = () => {
  const dispatch = useDispatch();
  const {
    isOpen, isLoading, streams, streamAuthToken,
  } = useSelector(camerasDialogWatchSelector);

  const handleClose = useCallback(() => {
    dispatch(setCamerasWatch());
  }, [setCamerasWatch]);

  return (
    <Dialog
      className="watch-cameras-dialog"
      title="Cameras"
      isOpen={isOpen}
      onClose={handleClose}
      dialogType={DialogType.wide}
    >
      {
        isLoading
          ? <div className="watch-cameras-dialog__spinner"><Spinner /></div>
          : (
            <div className={classNames('watch-cameras-dialog__sections', `watch-cameras-dialog__sections--count-${streams.length}`)}>
              {
                streams.length ? streams.map((stream) => (
                  <div key={stream[0].server + stream[0].rtsp} className="watch-cameras-dialog__section">
                    <VideoStream
                      className="watch-cameras-dialog__video-player"
                      wss={stream[0].server}
                      rtsp={stream[0].rtsp}
                      authToken={streamAuthToken}
                    />
                  </div>
                )) : (
                  <div className="watch-cameras-dialog__sections-no-streams">No active streams!</div>
                )
              }
            </div>
          )
      }
    </Dialog>
  );
};
