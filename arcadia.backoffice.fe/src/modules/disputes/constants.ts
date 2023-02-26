import { DisputeStatus } from './types';

export const disputeStatusLabelMap: { [key in DisputeStatus]: string } = {
  [DisputeStatus.open]: 'Open',
  [DisputeStatus.inquiring]: 'Inquiring',
  [DisputeStatus.closed]: 'Closed',
};
