import React from 'react';
import { Button, ButtonVariant, Link } from 'arcadia-common-fe';
import { AlertId, IAlert } from '../../../types';
import './AlertDetails.scss';

interface IAlertDetailsProps extends IAlert {
  onOpenAdditionalInformationJSON: (id: AlertId) => void
  onOpenHistory: (id: AlertId) => void
}

export const AlertDetails: React.FC<IAlertDetailsProps> = React.memo(({
  id,
  onOpenAdditionalInformationJSON,
  onOpenHistory,
}) => (
  <div className="alert-details">
    <div className="alert-details__values">
      <div className="alert-details__info-bar">
        <div className="alert-details__term">Additional information</div>
        <Link
          className="alert-details__value"
          preventDefault
          onClick={() => onOpenAdditionalInformationJSON(id)}
        >
          JSON
        </Link>
      </div>
    </div>

    <div className="alert-details__controls">
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
