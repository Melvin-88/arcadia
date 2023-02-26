import React from 'react';
import {
  Button,
  ButtonColor,
  ButtonVariant,
  Link,
  covertBooleanToYesNo,
  valueOrEmptyStub,
} from 'arcadia-common-fe';
import { GroupId, GroupStatus, IGroup } from '../../../types';
import { ROUTES_MAP } from '../../../../../routing/constants';
import { modulesInitialFilters } from '../../../../../constants';
import './GroupDetails.scss';

interface IGroupDetailsProps extends IGroup {
  onEdit: (id: GroupId) => void
  onActivate: (id: GroupId) => void
  onDry: (id: GroupId) => void
  onShutdown: (id: GroupId) => void
  onRemove: (id: GroupId) => void
  onOpenRegulationsJSON: (id: GroupId) => void
  onOpenConfigurationJSON: (id: GroupId) => void
  onOpenHistory: (id: GroupId) => void
}

export const GroupDetails: React.FC<IGroupDetailsProps> = React.memo(({
  id,
  status,
  name,
  stackCoinsSize,
  idleTimeout,
  graceTimeout,
  isPrivate,
  machinesTotal,
  onEdit,
  onActivate,
  onDry,
  onShutdown,
  onRemove,
  onOpenRegulationsJSON,
  onOpenConfigurationJSON,
  onOpenHistory,
}) => (
  <div className="group-details">
    <div className="group-details__values">
      <div className="group-details__info-bar">
        <div className="group-details__term">Stack size</div>
        <b className="group-details__value">{valueOrEmptyStub(stackCoinsSize)}</b>
      </div>
      <div className="group-details__info-bar">
        <div className="group-details__term">Idle timeout</div>
        <b className="group-details__value">
          { valueOrEmptyStub(idleTimeout) }
        </b>
      </div>
      <div className="group-details__info-bar">
        <div className="group-details__term">Grace timeout</div>
        <b className="group-details__value">
          { valueOrEmptyStub(graceTimeout) }
        </b>
      </div>
      <div className="group-details__info-bar">
        <div className="group-details__term">Is private</div>
        <b className="group-details__value">{ covertBooleanToYesNo(isPrivate) }</b>
      </div>
      <div className="group-details__info-bar">
        <div className="group-details__term">Regulations</div>
        <Link
          className="group-details__value"
          preventDefault
          onClick={() => onOpenRegulationsJSON(id)}
        >
          JSON
        </Link>
      </div>
      <div className="group-details__info-bar">
        <div className="group-details__term">Configuration</div>
        <Link
          className="group-details__value"
          preventDefault
          onClick={() => onOpenConfigurationJSON(id)}
        >
          JSON
        </Link>
      </div>
    </div>

    <div className="group-details__controls">
      <div className="group-details__controls-group">
        <Button
          className="group-details__btn"
          color={ButtonColor.quinary}
          disabled={status !== GroupStatus.offline}
          onClick={() => onEdit(id)}
        >
          Edit
        </Button>
        <Button
          className="group-details__btn"
          color={ButtonColor.quinary}
          disabled={status !== GroupStatus.offline || machinesTotal <= 0}
          onClick={() => onActivate(id)}
        >
          Activate
        </Button>
        <Button
          className="group-details__btn"
          color={ButtonColor.quinary}
          disabled={status !== GroupStatus.idle && status !== GroupStatus.inPlay}
          onClick={() => onDry(id)}
        >
          Dry
        </Button>
        <Button
          className="group-details__btn"
          color={ButtonColor.quinary}
          disabled={status !== GroupStatus.inPlay && status !== GroupStatus.drying && status !== GroupStatus.idle}
          onClick={() => onShutdown(id)}
        >
          Shutdown
        </Button>
        <Button
          className="group-details__btn"
          color={ButtonColor.quinary}
          disabled={status !== GroupStatus.offline || machinesTotal > 0}
          onClick={() => onRemove(id)}
        >
          Remove
        </Button>
        <div className="group-details__btn-splitter" />
        <Button
          className="group-details__btn"
          color={ButtonColor.tertiary}
          to={ROUTES_MAP.sessions.createURL({
            groupName: name,
            status: modulesInitialFilters.sessions.status,
          })}
        >
          Sessions
        </Button>
        <Button
          className="group-details__btn"
          color={ButtonColor.tertiary}
          to={ROUTES_MAP.machines.createURL({ groupName: name })}
        >
          Machines
        </Button>
      </div>
      <div>
        <Button
          variant={ButtonVariant.outline}
          onClick={() => onOpenHistory(id)}
        >
          History
        </Button>
      </div>
    </div>
  </div>
));
