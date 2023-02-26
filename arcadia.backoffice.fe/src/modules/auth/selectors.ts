import { IAuthStoreSlice } from './types';

export const authReducerSelector = ({ authReducer }: IAuthStoreSlice) => authReducer;

export const isAuthenticatedSelector = ({ authReducer }: IAuthStoreSlice) => !!authReducer.token;

export const userSelector = ({ authReducer }: IAuthStoreSlice) => authReducer.user;

export const permissionsSelector = ({ authReducer }: IAuthStoreSlice) => {
  const { isPermissionsLoading, permissionsIds, permissionsEntities } = authReducer;

  return {
    isPermissionsLoading,
    permissionsIds,
    permissionsEntities,
  };
};
