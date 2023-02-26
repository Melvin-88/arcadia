import React from 'react';
import {
  Button, Link, formatSecondsToMinutesSeconds, valueOrEmptyStub,
} from 'arcadia-common-fe';
import { ISession, SessionId, SessionStatus } from '../../../types';
import { ROUTES_MAP } from '../../../../../routing/constants';
import './SessionDetails.scss';

interface ISessionDetailsProps {
  session: ISession
  onOpenLogs: (session: ISession) => void
  onTerminate: (id: SessionId) => void
  onOpenGroupSettingsJSON: (id: SessionId) => void
  onOpenOperatorSettingsJSON: (id: SessionId) => void
  onOpenSystemSettingsJSON: (id: SessionId) => void
  onOpenHistory: (id: SessionId) => void
}

export const SessionDetails: React.FC<ISessionDetailsProps> = React.memo(({
  session,
  onOpenLogs,
  onTerminate,
  onOpenGroupSettingsJSON,
  onOpenOperatorSettingsJSON,
  onOpenSystemSettingsJSON,
  onOpenHistory,
}) => {
  const {
    id,
    machineId,
    playerCid,
    groupName,
    status,
    viewerDuration,
    queueDuration,
    totalBets,
    totalStacksUsed,
    currency,
    clientVersion,
    os,
    deviceType,
    browser,
    operatorName,
    videoUrl,
  } = session;

  return (
    <div className="session-row-details">
      <div className="session-row-details__description">
        <div className="session-row-details__info-bar">
          <div className="session-row-details__info-row">
            <div className="session-row-details__term">Observer duration</div>
            <b className="session-row-details__row-value">
              { valueOrEmptyStub(formatSecondsToMinutesSeconds(viewerDuration)) }
            </b>
          </div>
          <div className="session-row-details__info-row">
            <div className="session-row-details__term">Queue duration</div>
            <b className="session-row-details__row-value">
              { valueOrEmptyStub(formatSecondsToMinutesSeconds(queueDuration)) }
            </b>
          </div>
          <div className="session-row-details__info-row">
            <div className="session-row-details__term">Total bets</div>
            <b className="session-row-details__row-value">{valueOrEmptyStub(totalBets)}</b>
          </div>
        </div>
        <div className="session-row-details__info-bar">
          <div className="session-row-details__info-row">
            <div className="session-row-details__term">Total stacks used</div>
            <b className="session-row-details__row-value">{valueOrEmptyStub(totalStacksUsed)}</b>
          </div>
          <div className="session-row-details__info-row">
            <div className="session-row-details__term">Currency</div>
            <b className="session-row-details__row-value">{valueOrEmptyStub(currency)}</b>
          </div>
          <div className="session-row-details__info-row">
            <div className="session-row-details__term">Game client version</div>
            <b className="session-row-details__row-value">{valueOrEmptyStub(clientVersion)}</b>
          </div>
        </div>
        <div className="session-row-details__info-bar">
          <div className="session-row-details__info-row">
            <div className="session-row-details__term">OS</div>
            <b className="session-row-details__row-value">{valueOrEmptyStub(os)}</b>
          </div>
          <div className="session-row-details__info-row">
            <div className="session-row-details__term">Device type</div>
            <b className="session-row-details__row-value">{valueOrEmptyStub(deviceType)}</b>
          </div>
          <div className="session-row-details__info-row">
            <div className="session-row-details__term">Browser</div>
            <b className="session-row-details__row-value">{valueOrEmptyStub(browser)}</b>
          </div>
        </div>
        <div className="session-row-details__info-bar">
          <div className="session-row-details__info-row">
            <div className="session-row-details__term">Group settings</div>
            <Link
              className="session-row-details__row-value"
              preventDefault
              onClick={() => onOpenGroupSettingsJSON(id)}
            >
              JSON
            </Link>
          </div>
          <div className="session-row-details__info-row">
            <div className="session-row-details__term">Operator settings</div>
            <Link
              className="session-row-details__row-value"
              preventDefault
              onClick={() => onOpenOperatorSettingsJSON(id)}
            >
              JSON
            </Link>
          </div>
          <div className="session-row-details__info-row">
            <div className="session-row-details__term">System settings</div>
            <Link
              className="session-row-details__row-value"
              preventDefault
              onClick={() => onOpenSystemSettingsJSON(id)}
            >
              JSON
            </Link>
          </div>
        </div>
        <div className="session-row-details__info-bar">
          <div className="session-row-details__info-row">
            <div className="session-row-details__term">Video link</div>
            <b className="session-row-details__row-value">{videoUrl}</b>
          </div>
        </div>
      </div>
      <div className="session-row-details__controls">
        <div className="session-row-details__configs">
          <Button
            className="session-row-details__configs-btn"
            color="quinary"
            disabled={status === SessionStatus.terminated || status === SessionStatus.terminating || status === SessionStatus.completed}
            onClick={() => onTerminate(id)}
          >
            Terminate
          </Button>
          <div className="session-row-details__btn-splitter" />
          <Button
            className="session-row-details__configs-btn"
            color="tertiary"
            to={ROUTES_MAP.players.createURL({ cid: playerCid })}
          >
            Player
          </Button>
          <Button
            className="session-row-details__configs-btn"
            color="tertiary"
            to={ROUTES_MAP.machines.createURL({ id: machineId })}
          >
            Machine
          </Button>
          <Button
            className="session-row-details__configs-btn"
            color="tertiary"
            to={ROUTES_MAP.groups.createURL({ name: groupName })}
          >
            Group
          </Button>
          <Button
            className="session-row-details__configs-btn"
            color="tertiary"
            to={ROUTES_MAP.operators.createURL({ operatorName })}
          >
            Operator
          </Button>
        </div>
        <div className="session-row-details__controls-row">
          <Button
            className="session-row-details__configs-btn"
            variant="outline"
            onClick={() => onOpenLogs(session)}
          >
            Logs
          </Button>
          <Button
            className="session-row-details__configs-btn"
            variant="outline"
            onClick={() => onOpenHistory(id)}
          >
            History
          </Button>
        </div>
      </div>
    </div>
  );
});
