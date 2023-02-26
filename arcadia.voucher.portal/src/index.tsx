import 'react-app-polyfill/ie11';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { LoadingOverlay, history } from 'arcadia-common-fe';
import { Switch } from './routing/switch';
import { store } from './store/store';
import { App } from './modules/app/App';
import './services/api/interceptors';
import './styles/app.scss';

const AppRoot = () => (
  <Suspense fallback={<LoadingOverlay />}>
    <Provider store={store}>
      <Router history={history}>
        <App>
          <Switch />
        </App>
      </Router>
    </Provider>
  </Suspense>
);

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
