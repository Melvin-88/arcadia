import React from 'react';
import {
  Button,
  ButtonColor,
  ButtonVariant,
  Link,
  valueOrEmptyStub,
} from 'arcadia-common-fe';
import {
  MachineStatus, IMachine, MachineId, QueueStatus,
} from '../../../types';
import { ROUTES_MAP } from '../../../../../routing/constants';
import { modulesInitialFilters } from '../../../../../constants';
import './MachineDetails.scss';

interface IMachineDetailsProps extends IMachine {
  onEdit: (id: MachineId) => void
  onActivate: (id: MachineId) => void
  onDry: (id: MachineId) => void
  onShutdown: (id: MachineId) => void
  onRemove: (id: MachineId) => void
  onOpenChipsOnTableJSON: (id: MachineId) => void
  onOpenConfigurationJSON: (id: MachineId) => void
  onOpenHistory: (id: MachineId) => void
  onReassign: (id: MachineId) => void
  onReboot: (id: MachineId) => void
}

export const MachineDetails: React.FC<IMachineDetailsProps> = React.memo(({
  id,
  status,
  queueStatus,
  groupName,
  serial,
  cameraID,
  controllerIP,
  location,
  onEdit,
  onActivate,
  onDry,
  onShutdown,
  onRemove,
  onOpenChipsOnTableJSON,
  onOpenConfigurationJSON,
  onOpenHistory,
  onReassign,
  onReboot,
}) => (
  <div className="machine-details">
    <div className="machine--details__description">

      <div className="machine-details__info-bar">
        <div className="machine-details__info-row">
          <div className="machine-details__term">Serial number</div>
          <b className="machine-details__value">{valueOrEmptyStub(serial)}</b>
        </div>
        <div className="machine-details__info-row">
          <div className="machine-details__term">Chips on table</div>
          <div className="machine-details__value">
            <Link
              preventDefault
              onClick={() => onOpenChipsOnTableJSON(id)}
            >
              JSON
            </Link>
          </div>
        </div>
      </div>

      <div className="machine-details__info-bar">
        <div className="machine-details__info-row">
          <div className="machine-details__term">Camera ID</div>
          <b className="machine-details__value">{valueOrEmptyStub(cameraID)}</b>
        </div>
        <div className="machine-details__info-row">
          <div className="machine-details__term">Configuration</div>
          <div className="machine-details__value">
            <Link
              preventDefault
              onClick={() => onOpenConfigurationJSON(id)}
            >
              JSON
            </Link>
          </div>
        </div>
      </div>

      <div className="machine-details__info-bar">
        <div className="machine-details__info-row">
          <div className="machine-details__term">Robot controller IP</div>
          <b className="machine-details__value">{valueOrEmptyStub(controllerIP)}</b>
        </div>
        <div className="machine-details__info-row" />
      </div>

      <div className="machine-details__info-bar">
        <div className="machine-details__info-row">
          <div className="machine-details__term">Location</div>
          <b className="machine-details__value">{valueOrEmptyStub(location)}</b>
        </div>
        <div className="machine-details__info-row" />
      </div>
    </div>

    <div className="machine-details__controls">
      <div className="machine-details__controls-machine">
        <Button
          className="machine-details__btn"
          color={ButtonColor.quinary}
          disabled={status !== MachineStatus.offline && status !== MachineStatus.stopped}
          onClick={() => onEdit(id)}
        >
          Edit
        </Button>
        <Button
          className="machine-details__btn"
          color={ButtonColor.quinary}
          disabled={!(
            status === MachineStatus.offline
              || status === MachineStatus.stopped
              || status === MachineStatus.onHold
          )}
          onClick={() => onActivate(id)}
        >
          Activate
        </Button>
        <Button
          className="machine-details__btn"
          color={ButtonColor.quinary}
          disabled={
            (status !== MachineStatus.ready
            && status !== MachineStatus.inPlay
            && status !== MachineStatus.seeding)
            || queueStatus === QueueStatus.drying
          }
          onClick={() => onDry(id)}
        >
          Dry
        </Button>
        <Button
          className="machine-details__btn"
          color={ButtonColor.quinary}
          onClick={() => onReassign(id)}
          disabled={status === MachineStatus.offline || queueStatus === QueueStatus.drying}
        >
          Reassign
        </Button>
        <Button
          className="machine-details__btn"
          color={ButtonColor.quinary}
          disabled={
            status === MachineStatus.stopped
            || status === MachineStatus.offline
            || status === MachineStatus.shuttingDown
          }
          onClick={() => onShutdown(id)}
        >
          Shutdown
        </Button>
        <Button
          className="machine-details__btn"
          color={ButtonColor.quinary}
          disabled={status !== MachineStatus.offline}
          onClick={() => onRemove(id)}
        >
          Remove
        </Button>
        <Button
          className="machine-details__btn"
          color={ButtonColor.quaternary}
          disabled={status === MachineStatus.ready}
          onClick={() => onReboot(id)}
        >
          Reboot
        </Button>
        <div className="machine-details__btn-splitter" />
        <Button
          className="machine-details__btn"
          color={ButtonColor.tertiary}
          to={ROUTES_MAP.sessions.createURL({
            machineId: id,
            status: modulesInitialFilters.sessions.status,
          })}
        >
          Sessions
        </Button>
        <Button
          className="machine-details__btn"
          color={ButtonColor.tertiary}
          to={ROUTES_MAP.groups.createURL({ name: groupName })}
        >
          Group
        </Button>
      </div>
      <Button
        className="machine-details__btn-history"
        variant={ButtonVariant.outline}
        onClick={() => onOpenHistory(id)}
      >
        History
      </Button>
    </div>
  </div>
));
