import React from 'react';
import {
  Button, ButtonColor, Link, valueOrEmptyStub,
} from 'arcadia-common-fe';
import { ICamera } from '../../../types';
import { ROUTES_MAP } from '../../../../../routing/constants';
import './CameraDetails.scss';

interface ICameraDetailsProps extends ICamera {
  onRemove: (id: string) => void
  onReset: (id: string) => void
  onGetCamerasStreams: (id: string) => void
  onCamerasChangeRecording: (id: string, isRecorded: boolean) => void
  onGetRecording: (id: string) => void
}

export const CameraDetails: React.FC<ICameraDetailsProps> = React.memo(({
  id,
  machine,
  adminUser,
  adminUrl,
  adminPassword,
  comments,
  isRecorded,
  onRemove,
  onReset,
  onGetCamerasStreams,
  onCamerasChangeRecording,
  onGetRecording,
}) => (
  <div className="camera-details">
    <div className="camera-details__values">
      <div className="camera-details__info-bar">
        <div className="camera-details__term">Admin console URL</div>
        <b className="camera-details__value">
          <Link
            to={adminUrl}
            target="_blank"
            nativeElement
          >
            {adminUrl}
          </Link>
        </b>
      </div>
      <div className="camera-details__info-bar">
        <div className="camera-details__term">Admin username</div>
        <b className="camera-details__value">{valueOrEmptyStub(adminUser)}</b>
      </div>
      <div className="camera-details__info-bar">
        <div className="camera-details__term">Admin password</div>
        <b className="camera-details__value">{valueOrEmptyStub(adminPassword)}</b>
      </div>
      <div className="camera-details__info-bar">
        <div className="camera-details__term">Comments</div>
        <b className="camera-details__value">{valueOrEmptyStub(comments)}</b>
      </div>
    </div>

    <div className="camera-details__controls">
      <div className="camera-details__controls-group">
        <Button
          className="camera-details__btn"
          color={ButtonColor.quinary}
          onClick={() => onRemove(id)}
        >
          Delete
        </Button>
        <Button
          className="camera-details__btn"
          color={ButtonColor.quinary}
          onClick={() => onReset(id)}
        >
          Reset
        </Button>
        <Button
          className="camera-details__btn"
          color={ButtonColor.quinary}
          onClick={() => onGetCamerasStreams(id)}
        >
          Streams
        </Button>
        <Button
          className="camera-details__btn"
          color={ButtonColor.quinary}
          onClick={() => onCamerasChangeRecording(id, !isRecorded)}
        >
          {isRecorded ? 'Stop' : 'Start'}
          &nbsp;recording
        </Button>
        <Button
          className="camera-details__btn"
          color={ButtonColor.quinary}
          onClick={() => onGetRecording(id)}
        >
          Get recording
        </Button>
        <div className="camera-details__btn-splitter" />
        <Button
          className="camera-details__btn"
          color={ButtonColor.tertiary}
          to={ROUTES_MAP.machines.createURL({ name: machine })}
        >
          Machine
        </Button>
      </div>
    </div>
  </div>
));
