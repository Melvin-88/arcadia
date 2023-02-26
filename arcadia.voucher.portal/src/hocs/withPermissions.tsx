import React from 'react';
import { PermissionId } from 'arcadia-common-fe';

export const withPermissions = (predicate: () => boolean, renderFallback: () => React.ReactElement) => (
  <P extends object & { permissionId?: PermissionId }>(Component: React.ComponentType<P>): React.FC<P> => (props: any) => {
    if (!predicate()) {
      return renderFallback();
    }

    return (
      <Component {...props} />
    );
  }
);
