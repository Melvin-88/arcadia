import React, {
  useCallback, useEffect, useMemo, Suspense,
} from 'react';
import { ToastContainer } from 'react-toastify';
import { Helmet } from 'react-helmet';
import { useLocation, matchPath } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { LoadingOverlay, DATEPICKER_PORTAL_ID } from 'arcadia-common-fe';
import { AppHeader } from './AppHeader/AppHeader';
import { getPermissions } from '../../auth/actions';
import { IRoutesMap, ROUTES_MAP } from '../../../routing/constants';
import { DialogJSONViewer } from '../../DialogJSONViewer/DialogJSONViewer';
import { isAuthenticated } from '../../../services/auth';
import 'react-toastify/dist/ReactToastify.css';
import './App.scss';

const ROUTES_WITHOUT_HEADER: IRoutesMap[] = Object.values(ROUTES_MAP).filter((route: IRoutesMap) => route.isWithoutHeader);

interface IAppProps {
}

export const App: React.FC<IAppProps> = ({ children }) => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  const isWithHeader = useMemo(() => (
    !ROUTES_WITHOUT_HEADER.some((route) => matchPath(pathname, route))
  ), [pathname]);

  useEffect(() => {
    if (isAuthenticated()) {
      dispatch(getPermissions());
    }
  }, []);

  const renderHelmet = useCallback(() => {
    const renderedRoute = Object.values(ROUTES_MAP).find((route) => matchPath(pathname, route));
    let title = 'Arcadia Back Office';

    if (renderedRoute && renderedRoute.title) {
      title = `${renderedRoute.title} - ${title}`;
    }

    return (
      <Helmet>
        <title>{title}</title>
      </Helmet>
    );
  }, [pathname]);

  return (
    <>
      { renderHelmet() }
      <div className="app">
        <div className="app__main-container">
          { isWithHeader && <AppHeader /> }
          <main className="app__content">
            <Suspense fallback={<LoadingOverlay className="overlay__backdrop--transpert" />}>
              { children }
            </Suspense>
          </main>
        </div>
      </div>
      <DialogJSONViewer />
      <ToastContainer pauseOnFocusLoss={false} />
      <div id={DATEPICKER_PORTAL_ID} />
    </>
  );
};
