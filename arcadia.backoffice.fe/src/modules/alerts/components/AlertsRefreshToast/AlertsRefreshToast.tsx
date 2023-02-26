import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Link, ITEMS_PER_PAGE, useSearchParams } from 'arcadia-common-fe';
import { getAlerts } from '../../state/actions';

export const AlertsRefreshToast = () => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  const handleRefreshAlerts = useCallback(() => {
    dispatch(getAlerts({
      ...searchParams,
      take: ITEMS_PER_PAGE,
    }));
  }, [searchParams]);

  return (
    <>
      There&apos;re new Alerts available. Do you want to&nbsp;
      <Link
        preventDefault
        onClick={handleRefreshAlerts}
      >
        Refresh
      </Link>
      ?
    </>
  );
};
