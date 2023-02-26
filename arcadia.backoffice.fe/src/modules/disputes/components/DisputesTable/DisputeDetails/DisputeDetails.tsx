import React from 'react';
import {
  Button, ButtonColor, ButtonVariant, valueOrEmptyStub,
} from 'arcadia-common-fe';
import { IDispute } from '../../../types';
import { ROUTES_MAP } from '../../../../../routing/constants';
import { modulesInitialFilters } from '../../../../../constants';
import './DisputeDetails.scss';

interface IDisputeDetailsProps extends IDispute {
  onEdit: (id: number) => void
  onOpenHistory: (id: number) => void
}

export const DisputeDetails: React.FC<IDisputeDetailsProps> = React.memo(({
  id,
  sessionId,
  playerCid,
  complaint,
  discussion,
  onEdit,
  onOpenHistory,
}) => (
  <div className="dispute-details">
    <div className="dispute-details__info">
      <div className="dispute-details__info-container">
        <div className="dispute-details__info-term">Complaint</div>
        <b className="dispute-details__info-value">{ valueOrEmptyStub(complaint) }</b>
      </div>
      <div className="dispute-details__info-container">
        <div className="dispute-details__info-term">Discussion</div>
        <b className="dispute-details__info-value">{ valueOrEmptyStub(discussion) }</b>
      </div>
    </div>

    <div className="dispute-details__controls">
      <div className="dispute-details__controls-container">
        <Button
          className="dispute-details__btn"
          color={ButtonColor.quinary}
          onClick={() => onEdit(id)}
        >
          Edit
        </Button>
        <div className="dispute-details__btn-splitter" />
        <Button
          className="dispute-details__btn"
          color={ButtonColor.tertiary}
          disabled={!sessionId}
          to={ROUTES_MAP.sessions.createURL({
            id: sessionId,
            status: modulesInitialFilters.sessions.status,
          })}
        >
          Session
        </Button>
        <Button
          className="dispute-details__btn"
          color={ButtonColor.tertiary}
          to={ROUTES_MAP.players.createURL({ cid: playerCid })}
        >
          Player
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
