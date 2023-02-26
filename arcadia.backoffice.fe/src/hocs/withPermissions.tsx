import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { LoadingOverlay, NoAccessRights, PermissionId } from 'arcadia-common-fe';
import { authReducerSelector } from '../modules/auth/selectors';

export const withPermissions = (predicate: () => boolean, renderFallback: () => React.ReactElement) => (
  <P extends object & { permissionId?: PermissionId }>(Component: React.ComponentType<P>): React.FC<P> => (props: P) => {
    const { permissionId } = props;
    const { userPermissions, isPermissionsLoading } = useSelector(authReducerSelector);

    const isNotAllowedPermission = useMemo(() => (
      userPermissions.length && !userPermissions.some((permission) => permission === permissionId)
    ), [userPermissions, permissionId]);

    if (!predicate()) {
      return renderFallback();
    }

    if (isPermissionsLoading) {
      return <LoadingOverlay />;
    }

    if (isNotAllowedPermission) {
      return <NoAccessRights />;
    }

    return (
      <Component {...props} />
    );
  }
);
