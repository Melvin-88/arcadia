let entities = './dist/entities/*entity.js';
if (/\.ts$/.test(__filename)) {
  entities = './src/entities/*entity.ts';
}
module.exports = [
  {
    name: 'default',
    type: 'mysql',
    extra: { connectionLimit: process.env.DB_CONNECTION_LIMIT },
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PSW,
    database: process.env.DB_NAME,
    maxQueryExecutionTime: process.env.DB_MAX_QUERY_EXECUTION_TIME,
    retryAttempts: process.env.DB_RETRY_ATTEMPTS,
    entities: [entities],
    migrations: ['./dist/migrations/*.js'],
    cli: {
      migrationsDir: './src/migrations',
    },
    migrationsTableName: 'migrations',
    synchronize: true,
    logging: process.env.DB_LOGS ? process.env.DB_LOGS.split(',') : false,
  },
];
