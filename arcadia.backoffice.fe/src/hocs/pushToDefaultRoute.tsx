import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { LoadingOverlay, PermissionId } from 'arcadia-common-fe';
import { authReducerSelector } from '../modules/auth/selectors';
import {
  DEFAULT_ROUTE, IRoutesMap, ROUTES_MAP,
} from '../routing/constants';

export const pushToDefaultRoute = (predicate: () => boolean, renderFallback: () => React.ReactElement) => (
  <P extends object & { permissionId?: PermissionId }>(Component: React.ComponentType<P>): React.FC<P> => (props: any) => {
    const { userPermissions, isPermissionsLoading } = useSelector(authReducerSelector);

    const defaultRoute = useMemo(() => (
      userPermissions.length ? Object.values(ROUTES_MAP).find(
        (route: IRoutesMap) => route?.permissionId && Number(route.permissionId) === Number(userPermissions[0]),
      ) : null
    ), [userPermissions]);

    const PATH = defaultRoute?.path || DEFAULT_ROUTE.path;

    if (!predicate()) {
      return renderFallback();
    }

    if (isPermissionsLoading) {
      return <LoadingOverlay />;
    }

    return (
      <Component {...props}>
        <Redirect to={PATH} />
      </Component>
    );
  }
);
