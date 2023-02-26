import { SnakeNamingStrategy } from './utils';
import * as entitiesAudit from './entitiesAudit';
import * as connectionNames from './constants';
import { configMainWithAuditSubscriber, configSeed } from './ormconfigMain';

module.exports = [
  {
    name: connectionNames.AUDIT,
    type: 'mysql',
    extra: { connectionLimit: process.env.DB_CONNECTION_LIMIT || 100 },
    host: process.env.DB_AUDIT_HOST,
    port: process.env.DB_AUDIT_PORT,
    username: process.env.DB_AUDIT_USER,
    password: (process.env.DB_AUDIT_PSW || '').replace('\\', ''),
    database: process.env.DB_AUDIT_NAME,
    maxQueryExecutionTime: process.env.DB_MAX_QUERY_EXECUTION_TIME || 1000,
    retryAttempts: process.env.DB_RETRY_ATTEMPTS || 1000,
    entities: Object.values(entitiesAudit),
    migrations: ['./dist/migrationsAudit/*.js'],
    cli: {
      migrationsDir: './src/migrationsAudit',
    },
    migrationsTableName: 'migrations',
    logging: process.env.DB_LOGS ? process.env.DB_LOGS.split(',') : false,
    namingStrategy: new SnakeNamingStrategy(),
  },
  configMainWithAuditSubscriber,
  configSeed,
];
