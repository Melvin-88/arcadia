import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog, DialogType, Spinner } from 'arcadia-common-fe';
import { camerasDialogStreamSelector } from '../../../state/selectors';
import { mergeStreamDialog } from '../../../state/actions';
import { VideoStream } from '../../../../VideoStream/VideoStream';
import './StreamDialog.scss';

export interface IStreamDialogProps {
}

export const StreamDialog: React.FC<IStreamDialogProps> = () => {
  const dispatch = useDispatch();
  const {
    isOpen, isLoading, camera, streamAuthToken,
  } = useSelector(camerasDialogStreamSelector);

  const handleClose = useCallback(() => {
    dispatch(mergeStreamDialog({
      isOpen: false,
    }));
  }, [mergeStreamDialog]);

  return (
    <Dialog
      className="stream-dialog"
      title="Camera"
      isOpen={isOpen}
      onClose={handleClose}
      dialogType={DialogType.wide}
    >
      <div className="stream-dialog__section">
        {
          // eslint-disable-next-line no-nested-ternary
          isLoading
            ? <Spinner className="stream-dialog__spinner" />
            : (
              camera?.liveStreamUrl && camera?.rtsp && streamAuthToken
                ? (
                  <VideoStream
                    className="stream-dialog__video-stream"
                    wss={camera.liveStreamUrl}
                    rtsp={camera.rtsp}
                    authToken={streamAuthToken}
                  />
                )
                : (
                  <div className="stream-dialog__no-stream">No active stream!</div>
                )
            )
        }
      </div>
    </Dialog>
  );
};
