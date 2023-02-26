import 'react-app-polyfill/ie11';
import React, { Suspense, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useTranslation } from 'react-i18next';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import './services/sentry';
import { history } from './routing/history';
import { Switch } from './routing/switch';
import { store } from './store/store';
import { App } from './modules/app/components/App';
import { LoadingOverlay } from './components/loaders/LoadingOverlay/LoadingOverlay';
import { AppLayout } from './components/AppLayout/AppLayout';
import { SoundsController } from './services/sounds/controller';
import { preloadAnimationsResources } from './components/SpineAnimation/helpers';
import '../i18n';
import { OverlayBackdropColor } from './components/Overlay/styles/Overlay.styles';
import './styles/app.scss';

// TODO: Refactor all styles to CSS-in-JS

const AppRoot = () => {
  const { t } = useTranslation();
  const [isLoadingImages, setIsLoadingImages] = useState(true);
  const [isLoadingSounds, setIsLoadingSounds] = useState(true);
  const [isLoadingAnimations, setIsLoadingAnimations] = useState(true);

  useEffect(() => {
    preloadAnimationsResources(['buyButton', 'jackpot', 'Scatter']).then(() => {
      setIsLoadingAnimations(false);
    });

    SoundsController.getInstance().preloadResources().then(() => {
      setIsLoadingSounds(false);
    });

    const imagesRequireContext = require.context('./assets/images', true, /\.(png|jpe?g|gif|bmp)$/);
    const imagesURLs = imagesRequireContext.keys().map((key) => (
      imagesRequireContext(key)
    ));

    const preloadedImages: { [key: string]: HTMLImageElement } = {};
    const promises = imagesURLs.map((url) => new Promise((resolve) => {
      const image = new Image();

      image.src = url;
      image.onload = resolve;
      image.onerror = resolve;

      preloadedImages[url] = image;
    }));

    // We need this window assignment to make sure that images persisted in memory
    (window as any)[`preloadedImages${Date.now()}`] = preloadedImages;

    Promise.all(promises).then(() => {
      setIsLoadingImages(false);
    });
  }, []);

  const isLoadingResources = isLoadingImages || isLoadingSounds || isLoadingAnimations;

  return (
    <Provider store={store}>
      <AppLayout>
        <Suspense fallback={<LoadingOverlay e2eSelector="app-suspense-loading-overlay" />}>
          { !isLoadingResources && (
            <Router history={history}>
              <App>
                <Switch />
              </App>
            </Router>
          ) }
          <LoadingOverlay
            isVisible={isLoadingResources}
            overlayBackdropColor={OverlayBackdropColor.primarySolid}
            message={t('Root.Loading')}
            e2eSelector="app-resources-loading-overlay"
          />
        </Suspense>
      </AppLayout>
    </Provider>
  );
};

const render = () => {
  ReactDOM.render(
    <AppRoot />,
    document.getElementById('root'),
  );
};

render();

if (module.hot) {
  module.hot.accept('./index.tsx', () => {
    render();
  });
}
