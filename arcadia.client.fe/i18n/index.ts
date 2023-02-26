import i18next from 'i18next';
import Backend from 'i18next-xhr-backend';
import { initReactI18next } from 'react-i18next';
import { i18nInitialOptions } from './i18next.config';

i18next
  .use(Backend)
  .use(initReactI18next)
  .init(i18nInitialOptions);

export default i18next;
