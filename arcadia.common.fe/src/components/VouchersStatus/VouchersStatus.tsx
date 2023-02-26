import React from 'react';
import { voucherStatusLabelMap } from '../../constants';
import { VoucherStatus } from '../../types';
import { StatusIndicator, StatusIndicatorColor } from '../StatusIndicator/StatusIndicator';

export const voucherStatusColorMap: { [key in VoucherStatus]: StatusIndicatorColor } = {
  [VoucherStatus.pending]: StatusIndicatorColor.yellow,
  [VoucherStatus.used]: StatusIndicatorColor.green,
  [VoucherStatus.revoked]: StatusIndicatorColor.red,
  [VoucherStatus.expired]: StatusIndicatorColor.grey,
};

interface IVouchersStatusProps {
  className?: string
  status: VoucherStatus
}

export const VouchersStatus: React.FC<IVouchersStatusProps> = React.memo(({
  className,
  status,
}) => (
  <StatusIndicator
    className={className}
    color={voucherStatusColorMap[status]}
  >
    { voucherStatusLabelMap[status] }
  </StatusIndicator>
));
