import React from 'react';
import { Button, ButtonColor, ButtonVariant } from 'arcadia-common-fe';
import { MonitoringId } from '../../../types';
import './MonitoringDetails.scss';

interface IMonitoringDetailsProps {
  id: MonitoringId
  onEdit: (id: MonitoringId) => void
  onRemove: (id: MonitoringId) => void
  onOpenHistory: (id: MonitoringId) => void
}

export const MonitoringDetails: React.FC<IMonitoringDetailsProps> = React.memo(({
  id,
  onRemove,
  onEdit,
  onOpenHistory,
}) => (
  <div className="monitoring-details">
    <div className="monitoring-details__controls">
      <div className="monitoring-details__controls-container">
        <Button
          className="monitoring-details__btn"
          color={ButtonColor.quinary}
          onClick={() => onEdit(id)}
        >
          Edit
        </Button>
        <Button
          className="monitoring-details__btn"
          color={ButtonColor.quinary}
          onClick={() => onRemove(id)}
        >
          Remove
        </Button>
      </div>
      <div>
        <Button
          className="monitoring-details__btn"
          variant={ButtonVariant.outline}
        >
          Logs
        </Button>
        <Button
          className="monitoring-details__btn"
          variant={ButtonVariant.outline}
          onClick={() => onOpenHistory(id)}
        >
          History
        </Button>
      </div>
    </div>
  </div>
));
