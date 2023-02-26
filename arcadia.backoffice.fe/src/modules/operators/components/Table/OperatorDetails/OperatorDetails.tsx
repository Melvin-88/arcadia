import React from 'react';
import {
  Button,
  ButtonColor,
  ButtonVariant,
  Link,
  valueOrEmptyStub,
} from 'arcadia-common-fe';
import { IOperator, OperatorId, OperatorStatus } from '../../../types';
import { ROUTES_MAP } from '../../../../../routing/constants';
import './OperatorDetails.scss';

interface IOperatorDetailsProps extends IOperator {
  onEdit: (id: OperatorId) => void
  onEnable: (id: OperatorId) => void
  onDisable: (id: OperatorId) => void
  onRemove: (id: OperatorId) => void
  onOpenRegulationJSON: (id: OperatorId) => void
  onOpenHistory: (id: OperatorId) => void
}

export const OperatorDetails: React.FC<IOperatorDetailsProps> = React.memo(({
  id,
  name,
  status,
  logoUrl,
  linkToGroups,
  apiConnectorId,
  apiAccessToken,
  apiTokenExpirationDate,
  onEdit,
  onEnable,
  onDisable,
  onRemove,
  onOpenRegulationJSON,
  onOpenHistory,
}) => (
  <div className="operator-details">
    <div className="operator-details__values">
      <div className="operator-details__info-bar operator-details__info-bar--logo">
        <div className="operator-details__term">Logo</div>
        <div className="operator-details__value">
          { logoUrl ? <div className="operator-details__logo" style={{ backgroundImage: `url(${logoUrl})` }} /> : 'N/A'}
        </div>
      </div>
      <div className="operator-details__info-bar">
        <div className="operator-details__term">API connector ID</div>
        <b className="operator-details__value">{valueOrEmptyStub(apiConnectorId)}</b>
      </div>

      <div className="operator-details__info-bar">
        <div className="operator-details__term">API Access token</div>
        <b className="operator-details__value">{valueOrEmptyStub(apiAccessToken)}</b>
      </div>

      <div className="operator-details__info-bar">
        <div className="operator-details__term">API Access token expiration</div>
        <b className="operator-details__value">{valueOrEmptyStub(apiTokenExpirationDate)}</b>
      </div>

      <div className="operator-details__info-bar">
        <div className="operator-details__term">Regulation</div>
        <Link
          className="operator-details__value"
          preventDefault
          onClick={() => onOpenRegulationJSON(id)}
        >
          JSON
        </Link>
      </div>
    </div>

    <div className="operator-details__controls">
      <div className="operator-details__controls-group">
        <Button
          className="operator-details__btn"
          color={ButtonColor.quinary}
          onClick={() => onEdit(id)}
        >
          Edit
        </Button>
        <Button
          className="operator-details__btn"
          color={ButtonColor.quinary}
          disabled={status === OperatorStatus.enabled}
          onClick={() => onEnable(id)}
        >
          Enable
        </Button>
        <Button
          className="operator-details__btn"
          color={ButtonColor.quinary}
          disabled={status === OperatorStatus.disabled}
          onClick={() => onDisable(id)}
        >
          Disable
        </Button>
        <Button
          className="operator-details__btn"
          color={ButtonColor.quinary}
          disabled={status === OperatorStatus.enabled}
          onClick={() => onRemove(id)}
        >
          Remove
        </Button>
        <div className="operator-details__btn-splitter" />
        <Button
          className="operator-details__btn"
          color={ButtonColor.tertiary}
          to={ROUTES_MAP.players.createURL({ operatorName: name })}
        >
          Players
        </Button>
        <Button
          className="operator-details__btn"
          color={ButtonColor.tertiary}
          disabled={!linkToGroups.length}
          to={ROUTES_MAP.groups.createURL({ id: linkToGroups })}
        >
          Groups
        </Button>
        <Button
          className="operator-details__btn"
          color={ButtonColor.tertiary}
          to={ROUTES_MAP.vouchers.createURL({ operatorName: name })}
        >
          Vouchers
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
