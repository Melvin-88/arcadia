import React from 'react';
import {
  Button, ButtonColor, ButtonVariant, valueOrEmptyStub, VoucherStatus, IVoucher,
} from 'arcadia-common-fe';
import { ROUTES_MAP } from '../../../../../routing/constants';
import { modulesInitialFilters } from '../../../../../constants';
import './VoucherDetails.scss';

interface IVoucherDetailsProps extends IVoucher {
  onOpenHistory: (id: string) => void
}

export const VoucherDetails: React.FC<IVoucherDetailsProps> = React.memo(({
  id,
  status,
  revocationReason,
  groupName,
  playerCid,
  sessionId,
  onOpenHistory,
}) => (
  <div className="voucher-details">
    <div className="voucher-details__values">
      <div className="voucher-details__info-bar">
        <div className="voucher-details__term">Reason</div>
        <b className="voucher-details__value">{valueOrEmptyStub(revocationReason)}</b>
      </div>
    </div>

    <div className="voucher-details__controls">
      <div className="voucher-details__controls-group">
        <Button
          className="voucher-details__btn"
          color={ButtonColor.tertiary}
          disabled={status === VoucherStatus.pending || status === VoucherStatus.revoked}
          to={ROUTES_MAP.sessions.createURL({
            id: sessionId,
            status: modulesInitialFilters.sessions.status,
          })}
        >
          Session
        </Button>
        <Button
          className="voucher-details__btn"
          color={ButtonColor.tertiary}
          to={ROUTES_MAP.players.createURL({ cid: playerCid })}
        >
          Player
        </Button>
        <Button
          className="voucher-details__btn"
          color={ButtonColor.tertiary}
          to={ROUTES_MAP.groups.createURL({ name: groupName })}
        >
          Group
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
