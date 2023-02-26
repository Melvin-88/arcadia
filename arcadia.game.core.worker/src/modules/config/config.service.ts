/* eslint-disable max-lines */
import { SecretManagerServiceClient, v1 } from '@google-cloud/secret-manager';
import * as protos from '@google-cloud/secret-manager/build/protos/protos';
import { RuntimeException } from '@nestjs/core/errors/exceptions/runtime.exception';
import * as dotenv from 'dotenv';
import { existsSync, readdirSync } from 'fs';
import * as Joi from 'joi';
import { get } from 'lodash';
import * as path from 'path';
import { RedisOptions } from 'ioredis';
import { JoiExtentions } from '../../util/joiExtend';

const joiExtended = Joi.extend(...JoiExtentions);

export interface EnvConfig {
  [key: string]: any;
}

export class ConfigService {
  private static envConfig: EnvConfig;
  private static readonly configDir: string = '/configs/';
  private static secretManagerServiceClient: v1.SecretManagerServiceClient;

  constructor(config: EnvConfig) {
    ConfigService.envConfig = config;
  }

  public static async load(filePath: string): Promise<ConfigService> {
    const config: EnvConfig = await this.loadConfigAsync(filePath);
    return new ConfigService(config);
  }

  private static validateInitial(envConfig: EnvConfig): EnvConfig {
    const initialEnvVarsSchema: Joi.ObjectSchema = joiExtended.object({
      PORT: joiExtended.number().default(3000),
      USE_GCP_SM: joiExtended.boolean().default(false),
      GCP_PROJECT: joiExtended.string().when('USE_GCP_SM', { is: true, then: joiExtended.required() }),
      GOOGLE_APPLICATION_CREDENTIALS: joiExtended.string().when('USE_GCP_SM', {
        is: true,
        then: joiExtended.required(),
      }),
      API_VERSION: joiExtended.number().required(),
    });

    const { error, value: validatedEnvConfig } = initialEnvVarsSchema.validate(
      envConfig,
      { stripUnknown: true },
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
      DB_CONNECTION_LIMIT: 'GCW_API_DB_CONNECTION_LIMIT',
      DB_RETRY_ATTEMPTS: 'DB_RETRY_ATTEMPTS',
      DB_MAX_QUERY_EXECUTION_TIME: 'DB_MAX_QUERY_EXECUTION_TIME',
      DB_MASTER_USER: 'DB_MASTER_USER',
      DB_MASTER_PSW: 'DB_MASTER_PSW',
      DB_MASTER_NAME: 'DB_MASTER_NAME',
      DB_SLAVE_NAME: 'DB_SLAVE_NAME',
      DB_SLAVE_USER: 'DB_SLAVE_USER',
      DB_SLAVE_PSW: 'DB_SLAVE_PSW',
      DB_LOGS: 'GCW_API_DB_LOGS',
      RABBITMQ_HOST: 'RABBITMQ_HOST',
      RABBITMQ_PORT: 'RABBITMQ_PORT',
      RABBITMQ_USERNAME: 'RABBITMQ_USERNAME',
      RABBITMQ_PASSWORD: 'RABBITMQ_PASSWORD',
      REDIS_HOST: 'REDIS_HOST',
      REDIS_PORT: 'REDIS_PORT',
      SENTINEL_NAME: ' SENTINEL_NAME',
      ROBOTS_PING_TIMEOUT_SEC: 'GCW_ROBOTS_PING_TIMEOUT_SEC',
      EXPIRE_VOUCHERS_INTERVAL_SEC: 'GCW_EXPIRE_VOUCHERS_INTERVAL_SEC',
      TERMINATE_VIEWERS_INTERVAL_SEC: 'TERMINATE_VIEWERS_INTERVAL_SEC',
      TERMINATE_VIEWERS_THRESHOLD_SEC: 'TERMINATE_VIEWERS_THRESHOLD_SEC',
      QUEUE_BALANCE_TIMEOUT_SEC: 'QUEUE_BALANCE_TIMEOUT_SEC',
      QUEUE_CHANGE_THRESHOLD: 'QUEUE_CHANGE_THRESHOLD',
    };

    // eslint-disable-next-line guard-for-in
    for (const key in envVarMapping) {
      try {
        const secretName = envVarMapping[key];
        const [version]: [protos.google.cloud.secretmanager.v1.IAccessSecretVersionResponse,
          (protos.google.cloud.secretmanager.v1.IAccessSecretVersionRequest | undefined),
            {} | undefined] = await ConfigService.secretManagerServiceClient.accessSecretVersion({
              name: `${initialConfigs.GCP_PROJECT}/secrets/${secretName}/versions/latest`,
            });

        if (version.payload && version.payload.data) {
          envConfig[key] = version.payload.data.toString();
        }
      } catch (e) {
      }
    }

    return envConfig;
  }

  private static async loadAndValidateMain(envConfig: EnvConfig, initialConfigs: EnvConfig): Promise<EnvConfig> {
    const envVarsSchema: Joi.ObjectSchema = joiExtended.object({
      API_PORT: joiExtended.number().default(3000),
      DB_MASTER_HOST: joiExtended.string().required(),
      DB_MASTER_PORT: joiExtended.number().default(3306),
      DB_SLAVE_HOST: joiExtended.string().required(),
      DB_SLAVE_PORT: joiExtended.number().default(3306),
      DB_CONNECTION_LIMIT: joiExtended.number().required(),
      DB_RETRY_ATTEMPTS: joiExtended.number().required(),
      DB_MAX_QUERY_EXECUTION_TIME: joiExtended.number().required(),
      DB_MASTER_USER: joiExtended.string().required(),
      DB_MASTER_PSW: joiExtended.string().required(),
      DB_MASTER_NAME: joiExtended.string().required(),
      DB_SLAVE_NAME: joiExtended.string().required(),
      DB_SLAVE_USER: joiExtended.string().required(),
      DB_SLAVE_PSW: joiExtended.string().required(),
      RABBITMQ_HOST: joiExtended.hosts().required(),
      RABBITMQ_PORT: joiExtended.number().default(5672),
      RABBITMQ_USERNAME: joiExtended.string().required(),
      RABBITMQ_PASSWORD: joiExtended.string().required(),
      REDIS_HOST: joiExtended.string().required(),
      REDIS_PORT: joiExtended.number().required(),
      SENTINEL_NAME: joiExtended.string(),
      API_VERSION: joiExtended.number().required(),
      ROBOTS_PING_TIMEOUT_SEC: joiExtended.number().default(30),
      QUEUE_BALANCE_TIMEOUT_SEC: joiExtended.number().default(60),
      QUEUE_CHANGE_THRESHOLD: joiExtended.number().default(2),
      EXPIRE_VOUCHERS_INTERVAL_SEC: joiExtended.number().default(3600),
      TERMINATE_VIEWERS_INTERVAL_SEC: Joi.number().default(60),
      TERMINATE_VIEWERS_THRESHOLD_SEC: Joi.number().default(180),
    });

    if (initialConfigs.USE_GCP_SM) {
      envConfig = await ConfigService.populateEnvFromGCPSecretManager(envConfig, initialConfigs);
    }

    const { error, value: validatedEnvConfig } = envVarsSchema.validate(
      envConfig,
      { stripUnknown: true },
    );
    if (error) {
      throw new RuntimeException(`Config validation error: ${error.message}`);
    }
    return validatedEnvConfig;
  }

  public getRedisConfig(): RedisOptions {
    let hosts: string|string[] = <string|string[]>ConfigService.get(['core', 'REDIS_HOST']);
    hosts = Array.isArray(hosts) ? hosts : [hosts];
    const ports: number|number[] = <number|number[]>ConfigService.get(['core', 'REDIS_PORT']);
    return ConfigService.get(['core', 'SENTINEL_NAME'])
      ? {
        sentinels: hosts.map((host, index) => ({
          host,
          port: <number>((Array.isArray(ports) && ports[index])
            ? ports[index]
            : ports),
        })),
        name: <string>ConfigService.get(['core', 'SENTINEL_NAME']),
      }
      : {
        host: <string>hosts[0] || 'localhost',
        port: <number>(ports || 6379),
      };
  }

  public static getRabbitMQConfig(): string[] {
    const urls: string[] = [];
    let hosts: string | string[] = <string|string[]>ConfigService.get(['core', 'RABBITMQ_HOST']);
    let ports: number | number[] = <number | number[]>ConfigService.get(['core', 'RABBITMQ_PORT'], 5672);
    const user: string = <string>ConfigService.get(['core', 'RABBITMQ_USERNAME']);
    const password: string = <string>ConfigService.get(['core', 'RABBITMQ_PASSWORD']);

    hosts = Array.isArray(hosts) ? hosts : [hosts];
    ports = Array.isArray(ports) ? ports : Array.from(hosts, (h: string): number => <number>ports);
    hosts.forEach((node, nodeIndex) => {
      const port = ports[nodeIndex] ? ports[nodeIndex] : ports[0];
      urls.push(`amqp://${user}:${password}@${node}:${port}`);
    });

    return urls;
  }

  private static async loadConfigAsync(filePath: string): Promise<EnvConfig> {
    const matches = readdirSync(`${__dirname}${this.configDir}`);
    let parseConf: EnvConfig;

    if (existsSync(filePath)) {
      parseConf = dotenv.config({ path: filePath });
      if (parseConf.error) {
        throw new Error(`Dotenv error: ${parseConf.error}`);
      }

      parseConf = parseConf.parsed;
    } else {
      parseConf = process.env;
    }

    const initialConfigs: EnvConfig = ConfigService.validateInitial(parseConf);
    let configs = { ...(await ConfigService.loadAndValidateMain(parseConf, initialConfigs)), ...initialConfigs };
    configs = ConfigService.configGrab(matches, configs);

    return configs;
  }

  protected static configGrab(
    configPaths: string[],
    initValue: EnvConfig,
  ): EnvConfig {
    const configPathSchema: Joi.ArraySchema = joiExtended.array()
      .items(
        joiExtended.string()
          .valid('log4js.js', 'log4js.ts')
          .required(),
        joiExtended.string()
          .valid('redisconfig.js', 'redisconfig.ts')
          .required(),
      )
      .required();

    const { error } = configPathSchema.validate(configPaths);

    if (error) {
      throw new Error(`Config path validation error: ${error.message}`);
    }

    return configPaths.reduce(
      (configs: EnvConfig, file: string) => {
        if (!/((^.?|\.[^d]|[^.]d|[^.][^d])\.ts|\.js)$/.test(file)) {
          return configs;
        }
        // eslint-disable-next-line @typescript-eslint/no-var-requires,global-require
        const module = require(`.${this.configDir}${file}`);
        const config: EnvConfig = module.default || module;
        const configName: string = this.getConfigName(file);

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
