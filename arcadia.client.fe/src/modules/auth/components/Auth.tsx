import React, { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { signIn } from '../state/actions';

interface IAuthProps {
}

export const Auth: React.FC<IAuthProps> = () => {
  const { search } = useLocation();
  const searchParams = useMemo(() => (
    queryString.parse(search, {
      parseNumbers: true,
    })
  ), [search]);
  const dispatch = useDispatch();

  useEffect(() => {
    const { accessToken, operatorId } = searchParams;

    dispatch(signIn({
      ...searchParams,
      accessToken: (accessToken || '').toString(),
      operatorId: operatorId as number,
    }));
  }, []);

  return null;
};
