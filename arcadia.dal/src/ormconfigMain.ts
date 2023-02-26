import { SnakeNamingStrategy } from './utils';
import * as entities from './entities';
import * as connectionNames from './constants';
import { AuditSubscriber, MachineStatusHistorySubscriber } from './subscribers';

const configMain = {
  name: connectionNames.DATA,
  type: 'mysql',
  extra: {
    connectionLimit: process.env.DB_CONNECTION_LIMIT || 100,
    timeout: process.env.DB_TIMEOUT || 60000,
  },
  replication: {
    master: {
      host: process.env.DB_MASTER_HOST,
      port: process.env.DB_MASTER_PORT,
      username: process.env.DB_MASTER_USER,
      password: (process.env.DB_MASTER_PSW || '').replace('\\', ''),
      database: process.env.DB_MASTER_NAME,
    },
    slaves: [{
      host: process.env.DB_SLAVE_HOST,
      port: process.env.DB_SLAVE_PORT,
      username: process.env.DB_SLAVE_USER,
      password: (process.env.DB_SLAVE_PSW || '').replace('\\', ''),
      database: process.env.DB_SLAVE_NAME,
    }],
    canRetry: true,
    removeNodeErrorCount: process.env.DB_N0DE_ERROR_COUNT || 5,
    restoreNodeTimeout: process.env.DB_N0DE_TIMEOUT || 300,
  },
  maxQueryExecutionTime: process.env.DB_MAX_QUERY_EXECUTION_TIME || 1000,
  retryAttempts: process.env.DB_RETRY_ATTEMPTS || 1000,
  entities: Object.values(entities),
  migrations: ['./dist/migrations/*.js'],
  cli: {
    migrationsDir: './src/migrations',
  },
  migrationsTableName: 'migrations',
  logging: process.env.DB_LOGS ? process.env.DB_LOGS.split(',') : false,
  namingStrategy: new SnakeNamingStrategy(),
  subscribers: [MachineStatusHistorySubscriber],
};

const configSeed = {
  name: connectionNames.SEED,
  type: 'mysql',
  extra: { connectionLimit: process.env.DB_CONNECTION_LIMIT || 100 },
  host: process.env.DB_MASTER_HOST,
  port: process.env.DB_MASTER_PORT,
  username: process.env.DB_MASTER_USER,
  password: (process.env.DB_MASTER_PSW || '').replace('\\', ''),
  database: process.env.DB_MASTER_NAME,
  maxQueryExecutionTime: process.env.DB_MAX_QUERY_EXECUTION_TIME || 1000,
  retryAttempts: process.env.DB_RETRY_ATTEMPTS || 1000,
  entities: Object.values(entities),
  migrations: ['./dist/migrations/*.js'],
  cli: {
    migrationsDir: './src/migrations',
  },
  migrationsTableName: 'migrations',
  logging: process.env.DB_LOGS ? process.env.DB_LOGS.split(',') : false,
  namingStrategy: new SnakeNamingStrategy(),
};

const configMainWithAuditSubscriber = { ...configMain, subscribers: [AuditSubscriber] };

export {
  configMain,
  configMainWithAuditSubscriber,
  configSeed,
};
