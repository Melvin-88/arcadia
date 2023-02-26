import { Environments } from '../../../enums/environments';

const getAppenders = (appenders: string[]): string[] => appenders;

module.exports = {
  appenders: {
    access: {
      type: 'console',
      layout: { type: 'jsonLayout', separator: ';' },
    },
    error: {
      type: 'console',
      layout: { type: 'jsonLayout', separator: ';' },
    },
    mysqlQuery: {
      type: 'console',
      layout: { type: 'jsonLayout', separator: ';' },
    },
    mysqlError: {
      type: 'console',
      layout: { type: 'jsonLayout', separator: ';' },
    },
    console: { type: 'console' },
  },
  categories: {
    default: { appenders: ['console'], level: 'debug' },
    access: { appenders: getAppenders(['access']), level: 'info' },
    error: { appenders: getAppenders(['error']), level: 'warn' },
    mysqlQuery: { appenders: getAppenders(['mysqlQuery']), level: 'info' },
    mysqlError: { appenders: getAppenders(['mysqlError']), level: 'error' },
  },
  pm2: process.env.NODE_ENV !== Environments.DEV,
  pm2InstanceVar: process.env.NODE_ENV === Environments.DEV ? '' : 'API_PROJECT',
};
