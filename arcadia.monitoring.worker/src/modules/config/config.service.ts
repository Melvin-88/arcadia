/* eslint-disable max-lines */
import * as dotenv from 'dotenv';
import * as Joi from 'joi';
import { existsSync, readdirSync } from 'fs';
import * as path from 'path';
import { get } from 'lodash';
import { SecretManagerServiceClient, v1 } from '@google-cloud/secret-manager';
import * as protos from '@google-cloud/secret-manager/build/protos/protos';
import { RuntimeException } from '@nestjs/core/errors/exceptions/runtime.exception';
import { RedisOptions } from 'ioredis';
import { JoiExtentions } from '../../util/joiExtend';

const JoiExtended = Joi.extend(...JoiExtentions);

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
    const initialEnvVarsSchema: Joi.ObjectSchema = JoiExtended.object({
      PORT: JoiExtended.number().default(3000),
      USE_GCP_SM: JoiExtended.boolean().default(false),
      GCP_PROJECT: JoiExtended.string().when('USE_GCP_SM', { is: true, then: JoiExtended.required() }),
      GOOGLE_APPLICATION_CREDENTIALS: JoiExtended.string().when('USE_GCP_SM', { is: true, then: JoiExtended.required() }),
      API_VERSION: JoiExtended.number().required(),
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
      DB_CONNECTION_LIMIT: 'MONITORING_WORKER_DB_CONNECTION_LIMIT',
      DB_RETRY_ATTEMPTS: 'DB_RETRY_ATTEMPTS',
      DB_MAX_QUERY_EXECUTION_TIME: 'DB_MAX_QUERY_EXECUTION_TIME',
      DB_MASTER_USER: 'DB_MASTER_USER',
      DB_MASTER_PSW: 'DB_MASTER_PSW',
      DB_MASTER_NAME: 'DB_MASTER_NAME',
      DB_SLAVE_NAME: 'DB_SLAVE_NAME',
      DB_SLAVE_USER: 'DB_SLAVE_USER',
      DB_SLAVE_PSW: 'DB_SLAVE_PSW',
      DB_AUDIT_HOST: 'DB_AUDIT_HOST',
      DB_AUDIT_PORT: 'DB_AUDIT_PORT',
      DB_AUDIT_USER: 'DB_AUDIT_USER',
      DB_AUDIT_PSW: 'DB_AUDIT_PSW',
      DB_AUDIT_NAME: 'DB_AUDIT_NAME',
      DB_LOGS: 'GCW_API_DB_LOGS',
      RABBITMQ_HOST: 'RABBITMQ_HOST',
      RABBITMQ_PORT: 'RABBITMQ_PORT',
      RABBITMQ_USERNAME: 'RABBITMQ_USERNAME',
      RABBITMQ_PASSWORD: 'RABBITMQ_PASSWORD',
      REDIS_HOST: 'REDIS_HOST',
      REDIS_PORT: 'REDIS_PORT',
      SENTINEL_NAME: ' SENTINEL_NAME',
      MONGODB_URI: 'MONGODB_URI',
      MONITORING_API_HOST: 'MONITORING_API_HOST',
      MONITORING_API_PORT: 'MONITORING_API_PORT',
      GAME_CORE_API_HOST: 'GAME_CORE_API_HOST',
      GAME_CORE_API_PORT: 'GAME_CORE_API_PORT',
    };

    for (const key in envVarMapping) {
      try {
        const secretName = envVarMapping[key];
        const [version]: [protos.google.cloud.secretmanager.v1.IAccessSecretVersionResponse, (protos.google.cloud.secretmanager.v1.IAccessSecretVersionRequest | undefined), {} | undefined] = await ConfigService.secretManagerServiceClient.accessSecretVersion({
          name: `${initialConfigs.GCP_PROJECT}/secrets/${secretName}/versions/latest`,
        });

        if (version.payload && version.payload.data) {
          envConfig[key] = version.payload.data.toString();
        }
      } catch (e) {}
    }

    return envConfig;
  }

  private static async loadAndValidateMain(envConfig: EnvConfig, initialConfigs: EnvConfig): Promise<EnvConfig> {
    const envVarsSchema: Joi.ObjectSchema = JoiExtended.object({
      API_PORT: JoiExtended.number().default(3000),
      DB_MASTER_HOST: JoiExtended.string().required(),
      DB_MASTER_PORT: JoiExtended.number().default(3306),
      DB_SLAVE_HOST: JoiExtended.string().required(),
      DB_SLAVE_PORT: JoiExtended.number().default(3306),
      DB_AUDIT_HOST: JoiExtended.string().required(),
      DB_AUDIT_PORT: JoiExtended.number().default(3306),
      DB_AUDIT_USER: JoiExtended.string().required(),
      DB_AUDIT_PSW: JoiExtended.string().required(),
      DB_AUDIT_NAME: JoiExtended.string().required(),
      DB_CONNECTION_LIMIT: JoiExtended.number().required(),
      DB_RETRY_ATTEMPTS: JoiExtended.number().required(),
      DB_MAX_QUERY_EXECUTION_TIME: JoiExtended.number().required(),
      DB_MASTER_USER: JoiExtended.string().required(),
      DB_MASTER_PSW: JoiExtended.string().required(),
      DB_MASTER_NAME: JoiExtended.string().required(),
      DB_SLAVE_NAME: JoiExtended.string().required(),
      DB_SLAVE_USER: JoiExtended.string().required(),
      DB_SLAVE_PSW: JoiExtended.string().required(),
      RABBITMQ_HOST: JoiExtended.hosts().required(),
      RABBITMQ_PORT: JoiExtended.ports().default(5672),
      RABBITMQ_USERNAME: JoiExtended.string().required(),
      RABBITMQ_PASSWORD: JoiExtended.string().required(),
      REDIS_HOST: JoiExtended.hosts().required(),
      REDIS_PORT: JoiExtended.ports().required(),
      SENTINEL_NAME: JoiExtended.string(),
      API_VERSION: JoiExtended.number().required(),
      MONGODB_URI: JoiExtended.string().required(),
      MONITORING_API_HOST: JoiExtended.string().required(),
      MONITORING_API_PORT: JoiExtended.number().required(),
      GAME_CORE_API_HOST: JoiExtended.string().required(),
      GAME_CORE_API_PORT: JoiExtended.number().required(),
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

  protected static configGrab(
    configPaths: string[],
    initValue: EnvConfig,
  ): EnvConfig {
    const configPathSchema: Joi.ArraySchema = JoiExtended.array()
      .items(
        JoiExtended.string()
          .valid('log4js.js', 'log4js.ts')
          .required(),
        JoiExtended.string()
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
        // eslint-disable-next-line global-require
        // eslint-disable-next-line @typescript-eslint/no-var-requires
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
