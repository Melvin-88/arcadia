import React, { useMemo } from 'react';
import {
  Button, ButtonColor, ButtonVariant, Link,
} from 'arcadia-common-fe';
import { AlertId, IAlert, MaintenanceAction } from '../../types';
import { getActionText } from '../../helpers';
import './MaintenanceDetails.scss';

interface IMaintenanceDetailsProps extends IAlert {
  onOpenAdditionalInformationJSON: (id: AlertId) => void
  onAction: (type: MaintenanceAction, id: AlertId) => void
  onOpenHistory: (id: AlertId) => void
}

export const MaintenanceDetails: React.FC<IMaintenanceDetailsProps> = React.memo(({
  id,
  additionalInfo,
  onOpenAdditionalInformationJSON,
  onAction,
  onOpenHistory,
}) => {
  const actionText = useMemo(() => getActionText(additionalInfo.maintenanceType), [additionalInfo]);

  return (
    <div className="maintenance-details">
      <div className="maintenance-details__values">
        <div className="maintenance-details__info-bar">
          <div className="maintenance-details__term">Additional information</div>
          <Link
            className="maintenance-details__value"
            preventDefault
            onClick={() => onOpenAdditionalInformationJSON(id)}
          >
            JSON
          </Link>
        </div>
      </div>

      <div className="maintenance-details__controls">
        <div className="maintenance-details__controls-group">
          <Button
            color={ButtonColor.quinary}
            onClick={() => onAction(additionalInfo.maintenanceType, id)}
          >
            {actionText}
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
  );
});
