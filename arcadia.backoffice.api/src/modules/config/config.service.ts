/* eslint-disable max-lines */
import { SecretManagerServiceClient, v1 } from '@google-cloud/secret-manager';
import * as protos from '@google-cloud/secret-manager/build/protos/protos';
import { RuntimeException } from '@nestjs/core/errors/exceptions/runtime.exception';
import * as dotenv from 'dotenv';
import { existsSync, readdirSync } from 'fs';
import * as Joi from 'joi';
import { get } from 'lodash';
import * as path from 'path';

type EnvConfig = Record<string, any>;

export class ConfigService {
  private static envConfig: EnvConfig;
  private static readonly configDir: string = '/configs/';
  private static secretManagerServiceClient: v1.SecretManagerServiceClient;

  constructor(config: EnvConfig) {
    ConfigService.envConfig = config;
  }

  public static async load(filePath: string, noValidation?: boolean): Promise<ConfigService> {
    const config: EnvConfig = await this.loadConfigAsync(filePath, noValidation);
    return new ConfigService(config);
  }

  private static validateInitial(envConfig: EnvConfig, noValidation?: boolean): EnvConfig {
    const initialEnvVarsSchema: Joi.ObjectSchema = Joi.object({
      PORT: Joi.number().default(3000),
      USE_GCP_SM: Joi.boolean().default(false),
      GCP_PROJECT: Joi.string().when('USE_GCP_SM', { is: true, then: Joi.required() }),
      GOOGLE_APPLICATION_CREDENTIALS: Joi.string().when('USE_GCP_SM', {
        is: true,
        then: Joi.required(),
      }),
      API_VERSION: !noValidation ? Joi.number().required() : Joi.number(),
      ROBOT_DEMO_CHIP_PATH: Joi.string(),
    });

    const { error, value: validatedEnvConfig } = initialEnvVarsSchema.validate(
      envConfig,
      { stripUnknown: false, allowUnknown: true },
    );
    if (error) {
      throw new RuntimeException(`Config validation error: ${error.message}`);
    }
    return validatedEnvConfig;
  }

  private static async populateEnvFromGCPSecretManager(envConfig: EnvConfig, initialConfigs: EnvConfig): Promise<EnvConfig> {
    if (!ConfigService.secretManagerServiceClient) {
      ConfigService.secretManagerServiceClient = new SecretManagerServiceClient();
    }
    const envVarMapping = {
      DB_MASTER_HOST: 'DB_MASTER_HOST',
      DB_MASTER_PORT: 'DB_MASTER_PORT',
      DB_SLAVE_HOST: 'DB_SLAVE_HOST',
      DB_SLAVE_PORT: 'DB_SLAVE_PORT',
      DB_AUDIT_HOST: 'DB_AUDIT_HOST',
      DB_AUDIT_PORT: 'DB_AUDIT_PORT',
      DB_CONNECTION_LIMIT: 'BO_API_DB_CONNECTION_LIMIT',
      DB_RETRY_ATTEMPTS: 'DB_RETRY_ATTEMPTS',
      DB_MAX_QUERY_EXECUTION_TIME: 'DB_MAX_QUERY_EXECUTION_TIME',
      DB_MASTER_USER: 'DB_MASTER_USER',
      DB_MASTER_PSW: 'DB_MASTER_PSW',
      DB_MASTER_NAME: 'DB_MASTER_NAME',
      DB_SLAVE_NAME: 'DB_SLAVE_NAME',
      DB_SLAVE_USER: 'DB_SLAVE_USER',
      DB_SLAVE_PSW: 'DB_SLAVE_PSW',
      DB_AUDIT_USER: 'DB_AUDIT_USER',
      DB_AUDIT_PSW: 'DB_AUDIT_PSW',
      DB_AUDIT_NAME: 'DB_AUDIT_NAME',
      DB_LOGS: 'BO_API_DB_LOGS',
      JWT_SECRET: 'BO_API_JWT_SECRET',
      MONITORING_API_HOST: 'MONITORING_API_HOST',
      MONITORING_API_PORT: 'MONITORING_API_PORT',
      BO_API_DOMAIN: 'BO_API_DOMAIN',
      GAME_CORE_API_HOST: 'GAME_CORE_API_HOST',
      GAME_CORE_API_PORT: 'GAME_CORE_API_PORT',
      CAMERA_API_PASS_1: 'CAMERA_API_PASS_1',
      STREAM_AUTH_SECRET: 'STREAM_AUTH_SECRET',
    };

    // eslint-disable-next-line guard-for-in
    for (const key in envVarMapping) {
      try {
        const secretName = envVarMapping[key];
        const [version]: [
          protos.google.cloud.secretmanager.v1.IAccessSecretVersionResponse,
            protos.google.cloud.secretmanager.v1.IAccessSecretVersionRequest | undefined,
            {} | undefined,
        ] = await ConfigService.secretManagerServiceClient.accessSecretVersion({
          name: `${initialConfigs.GCP_PROJECT}/secrets/${secretName}/versions/latest`,
        });

        if (version.payload && version.payload.data) {
          envConfig[key] = version.payload.data.toString();
        }
      } catch (e) {
        console.log(e);
      }
    }

    return envConfig;
  }

  private static async loadAndValidateMain(
    envConfig: EnvConfig,
    initialConfigs: EnvConfig,
    noValidation?: boolean,
  ): Promise<EnvConfig> {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      DB_MASTER_HOST: !noValidation ? Joi.string().required() : Joi.string(),
      DB_MASTER_PORT: Joi.number().default(3306),
      DB_SLAVE_HOST: !noValidation ? Joi.string().required() : Joi.string(),
      DB_SLAVE_PORT: Joi.number().default(3306),
      DB_AUDIT_HOST: !noValidation ? Joi.string().required() : Joi.string(),
      DB_AUDIT_PORT: Joi.number().default(3306),
      DB_CONNECTION_LIMIT: !noValidation ? Joi.number().required() : Joi.number(),
      DB_RETRY_ATTEMPTS: !noValidation ? Joi.number().required() : Joi.number(),
      DB_MAX_QUERY_EXECUTION_TIME: !noValidation ? Joi.number().required() : Joi.number(),
      DB_MASTER_USER: !noValidation ? Joi.string().required() : Joi.string(),
      DB_MASTER_PSW: !noValidation ? Joi.string().required() : Joi.string(),
      DB_MASTER_NAME: !noValidation ? Joi.string().required() : Joi.string(),
      DB_SLAVE_NAME: !noValidation ? Joi.string().required() : Joi.string(),
      DB_SLAVE_USER: !noValidation ? Joi.string().required() : Joi.string(),
      DB_SLAVE_PSW: !noValidation ? Joi.string().required() : Joi.string(),
      DB_AUDIT_USER: !noValidation ? Joi.string().required() : Joi.string(),
      DB_AUDIT_PSW: !noValidation ? Joi.string().required() : Joi.string(),
      DB_AUDIT_NAME: !noValidation ? Joi.string().required() : Joi.string(),
      DB_LOGS: Joi.string(),
      JWT_SECRET: !noValidation ? Joi.string().required() : Joi.string(),
      MONITORING_API_HOST: !noValidation ? Joi.string().required() : Joi.string(),
      MONITORING_API_PORT: !noValidation ? Joi.number().required() : Joi.number(),
      BO_API_DOMAIN: !noValidation ? Joi.string().required() : Joi.string(),
      GAME_CORE_API_HOST: !noValidation ? Joi.string().required() : Joi.string(),
      GAME_CORE_API_PORT: !noValidation ? Joi.string().required() : Joi.string(),
      STREAM_AUTH_SECRET: Joi.string().required(),
    });

    if (initialConfigs.USE_GCP_SM) {
      envConfig = await ConfigService.populateEnvFromGCPSecretManager(envConfig, initialConfigs);
    }

    const { error, value: validatedEnvConfig } = envVarsSchema.validate(
      envConfig,
      { stripUnknown: false, allowUnknown: true },
    );
    if (error) {
      throw new RuntimeException(`Config validation error: ${error.message}`);
    }

    return validatedEnvConfig;
  }

  private static async loadConfigAsync(filePath: string, noValidation?: boolean): Promise<EnvConfig> {
    const matches = readdirSync(`${__dirname}${this.configDir}`);
    let parseConf: EnvConfig;

    if (existsSync(filePath)) {
      parseConf = dotenv.config({ path: filePath });
      if (parseConf.error) {
        throw new Error(`Dotenv error: ${parseConf.error}`);
      }

      parseConf = parseConf.parsed;
    } else {
      parseConf = { ...process.env };
    }

    const initialConfigs: EnvConfig = ConfigService.validateInitial(parseConf, noValidation);
    let configs = { ...(await ConfigService.loadAndValidateMain(parseConf, initialConfigs, noValidation)), ...initialConfigs };
    configs = ConfigService.configGrab(matches, configs);

    return configs;
  }

  protected static configGrab(
    configPaths: string[],
    initValue: EnvConfig,
  ): EnvConfig {
    const configPathSchema: Joi.ArraySchema = Joi.array()
      .items(
        Joi.string()
          .valid('log4js.js', 'log4js.ts')
          .required(),
        Joi.string()
          .valid('ormconfig.js', 'ormconfig.ts')
          .required(),
        // Joi.string()
        //   .valid('redisconfig.js', 'redisconfig.ts')
        //   .required(),
      )
      .required();

    const { error } = configPathSchema.validate(configPaths);

    if (error) {
      throw new Error(`Config path validation error: ${error.message}`);
    }

    return configPaths.reduce(
      (configs: EnvConfig, file: string) => {
        if (!/(\.js|\.ts)$/.test(file) || /^redisconfig(.*)$/.test(file)) {
          return configs;
        }
        // eslint-disable-next-line global-require
        const module = require(`.${this.configDir}${file}`);
        const config: EnvConfig = module.default || module;
        const configName: string = ConfigService.getConfigName(file);

        configs[configName] = config;

        return configs;
      },
      { core: initValue },
    );
  }

  protected static getConfigName(file: string): string {
    return file
      .split(path.posix.sep)
      .pop()
      .replace('.js', '')
      .replace('.ts', '');
  }

  get(
    params: string | string[],
    value: any = undefined,
  ): EnvConfig | string | undefined {
    return ConfigService.get(params, value);
  }

  static get(
    params: string | string[],
    value: any = undefined,
  ): string | EnvConfig | undefined {
    if (!Array.isArray(params)) {
      params = [params];
    }

    let configValue: EnvConfig | undefined | string = ConfigService.envConfig;
    params.forEach(
      param => configValue !== undefined && (configValue = get(configValue, param)),
    );

    if (configValue === undefined) {
      configValue = value;
    }

    return configValue;
  }
}
