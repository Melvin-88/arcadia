import React, {
  useCallback, Suspense,
} from 'react';
import { ToastContainer } from 'react-toastify';
import { LoadingOverlay, DATEPICKER_PORTAL_ID } from 'arcadia-common-fe';
import { Helmet } from 'react-helmet';
import { useLocation, matchPath } from 'react-router-dom';
import { ROUTES_MAP } from '../../routing/constants';
import 'react-toastify/dist/ReactToastify.css';
import './App.scss';

interface IAppProps {
}

export const App: React.FC<IAppProps> = ({ children }) => {
  const { pathname } = useLocation();

  const renderHelmet = useCallback(() => {
    const renderedRoute = Object.values(ROUTES_MAP).find((route) => matchPath(pathname, route));
    let title = 'Arcadia Voucher Portal';

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
          <main className="app__content">
            <Suspense fallback={<LoadingOverlay className="overlay__backdrop--transpert" />}>
              { children }
            </Suspense>
          </main>
        </div>
      </div>
      <ToastContainer pauseOnFocusLoss={false} />
      <div id={DATEPICKER_PORTAL_ID} />
    </>
  );
};
