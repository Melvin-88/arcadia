import * as Joi from 'joi';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as connectionNames from './constants';
import { ConnectionType } from './enums';

export * from './repositories';
export * from './repositoriesAudit';
export * from './entitiesAudit';
export * from './entities';
export * from './enums';
export * from './types';
export * from './reports/interfaces';
export * from './reports/reponses';
export * from './utils';
export * from '@nestjs/typeorm';
export * from 'typeorm';
export * from 'typeorm/driver/mysql/MysqlDriver';

export type configOption = {
  DB_CONNECTION_LIMIT: number;
  DB_MASTER_HOST: string;
  DB_MASTER_PORT: number;
  DB_MASTER_USER: string;
  DB_MASTER_PSW: string;
  DB_MASTER_NAME: string;
  DB_SLAVE_HOST: string;
  DB_SLAVE_PORT: number;
  DB_SLAVE_USER: string;
  DB_SLAVE_PSW: string;
  DB_SLAVE_NAME: string;
  DB_MAX_QUERY_EXECUTION_TIME: number;
  DB_RETRY_ATTEMPTS: number;
  DB_LOGS?: string;
}

export type configOptionWithAudit = configOption & {
  DB_AUDIT_HOST: string;
  DB_AUDIT_PORT: number;
  DB_AUDIT_USER: string;
  DB_AUDIT_PSW: string;
  DB_AUDIT_NAME: string;
}

const envMainJoi = {
  DB_MASTER_HOST: Joi.string().required(),
  DB_MASTER_PORT: Joi.number().default(3306),
  DB_SLAVE_HOST: Joi.string().required(),
  DB_SLAVE_PORT: Joi.number().default(3306),
  DB_CONNECTION_LIMIT: Joi.number().required(),
  DB_RETRY_ATTEMPTS: Joi.number().required(),
  DB_MAX_QUERY_EXECUTION_TIME: Joi.number().required(),
  DB_MASTER_USER: Joi.string().required(),
  DB_MASTER_PSW: Joi.string().required(),
  DB_MASTER_NAME: Joi.string().required(),
  DB_SLAVE_NAME: Joi.string().required(),
  DB_SLAVE_USER: Joi.string().required(),
  DB_SLAVE_PSW: Joi.string().required(),
  DB_LOGS: Joi.string(),
};

const envVarsSchemaMain: Joi.ObjectSchema = Joi.object(envMainJoi);

const envVarsSchemaAudit: Joi.ObjectSchema = Joi.object({
  ...envMainJoi,
  DB_AUDIT_HOST: Joi.string().required(),
  DB_AUDIT_PORT: Joi.number().default(3306),
  DB_AUDIT_USER: Joi.string().required(),
  DB_AUDIT_PSW: Joi.string().required(),
  DB_AUDIT_NAME: Joi.string().required(),
});

export function getConfig(type: ConnectionType, config?: configOption | configOptionWithAudit): TypeOrmModuleOptions {
  let ormconf;

  const proceedConf = (error, validatedEnvConfig) => {
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }

    if (config) {
      const entries = Object.entries(validatedEnvConfig);
      for (const [key, value] of entries) {
        process.env[key] = <string>value;
      }
    }
  };

  if (type === ConnectionType.MAIN) {
    const { error, value: validatedEnvConfig } = envVarsSchemaMain.validate(
      config || process.env,
      { stripUnknown: true },
    );

    proceedConf(error, validatedEnvConfig);

    // eslint-disable-next-line
    ormconf = require('./ormconfigMain');
    return ormconf.configMain;
  }

  const { error, value: validatedEnvConfig } = envVarsSchemaAudit.validate(
    config || process.env,
    { stripUnknown: true },
  );

  proceedConf(error, validatedEnvConfig);
  // eslint-disable-next-line
  ormconf = require('./ormconfig');

  if (type === ConnectionType.AUDIT) {
    return ormconf[0];
  }

  return ormconf[1];
}

export {
  connectionNames,
};
