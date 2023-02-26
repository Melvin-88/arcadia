import { InitOptions } from 'i18next';
import {
  lng, namespaces, defaultNS, nsSeparator, ns,
} from './constants';
import enResources from './en/general.json';

export const i18nInitialOptions: InitOptions = {
  resources: {
    en: {
      [namespaces.general]: enResources,
    },
  },
  ns,
  defaultNS,
  lng,
  fallbackLng: lng,
  nsSeparator,
  debug: process.env.NODE_ENV === 'development',
  partialBundledLanguages: true,
  interpolation: {
    escapeValue: false,
  },
  overloadTranslationOptionHandler: () => ({
    defaultValue: '',
  }),
};
