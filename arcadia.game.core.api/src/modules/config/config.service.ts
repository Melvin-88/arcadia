/* eslint-disable max-lines */
import { SecretManagerServiceClient, v1 } from '@google-cloud/secret-manager';
import * as protos from '@google-cloud/secret-manager/build/protos/protos';
import { RuntimeException } from '@nestjs/core/errors/exceptions/runtime.exception';
import * as dotenv from 'dotenv';
import { existsSync, readdirSync } from 'fs';
import { RedisOptions } from 'ioredis';
import * as Joi from 'joi';
import { get } from 'lodash';
import * as path from 'path';
import { Environments } from '../../enums/environments';
import { JoiExtentions } from '../../util/joiExtend';

const joiExtended = Joi.extend(...JoiExtentions);

export interface EnvConfig {
  [key: string]: any;
}

export class ConfigService {
  private static envConfig: EnvConfig;
  private static readonly configDir: string = '/configs/';
  private static secretManagerServiceClient: v1.SecretManagerServiceClient;
  private static GCP_PROJECT: string;

  constructor(config: EnvConfig) {
    ConfigService.envConfig = config;
  }

  public static async load(filePath: string): Promise<ConfigService> {
    const config: EnvConfig = await this.loadConfigAsync(filePath);
    return new ConfigService(config);
  }

  private static validateInitial(envConfig: EnvConfig): EnvConfig {
    const initialEnvVarsSchema: Joi.ObjectSchema = joiExtended.object({
      NODE_ENV: joiExtended.string().valid(...Object.values(Environments)).required(),
      PORT: joiExtended.number().default(3000),
      USE_GCP_SM: joiExtended.boolean().default(false),
      GCP_PROJECT: joiExtended.string().when('USE_GCP_SM', {
        is: true,
        then: joiExtended.required(),
      }),
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

    this.GCP_PROJECT = validatedEnvConfig.GCP_PROJECT;

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
    configs = this.configGrab(matches, configs);

    return configs;
  }

  private static async loadAndValidateMain(envConfig: EnvConfig, initialConfigs: EnvConfig): Promise<EnvConfig> {
    const envVarsSchema: Joi.ObjectSchema = joiExtended.object({
      DB_SLAVE_HOST: joiExtended.string().required(),
      DB_SLAVE_PORT: joiExtended.number().default(3306),
      DB_SLAVE_NAME: joiExtended.string().required(),
      DB_SLAVE_USER: joiExtended.string().required(),
      DB_SLAVE_PSW: joiExtended.string().required(),
      DB_MASTER_USER: joiExtended.string().required(),
      DB_MASTER_PSW: joiExtended.string().required(),
      DB_MASTER_NAME: joiExtended.string().required(),
      DB_MASTER_HOST: joiExtended.string().required(),
      DB_MASTER_PORT: joiExtended.number().default(3306),
      DB_LOGS: joiExtended.string(),
      DB_CONNECTION_LIMIT: joiExtended.number().required(),
      DB_RETRY_ATTEMPTS: joiExtended.number().required(),
      DB_MAX_QUERY_EXECUTION_TIME: joiExtended.number().required(),
      REDIS_HOST: joiExtended.hosts().required(),
      EXTERNAL_REDIS_HOST: joiExtended.hosts().required(),
      REDIS_PORT: joiExtended.ports().default(6379),
      SENTINEL_NAME: joiExtended.string(),
      RABBITMQ_HOST: joiExtended.hosts().required(),
      EXTERNAL_RABBITMQ_HOST: joiExtended.hosts().required(),
      RABBITMQ_USERNAME: joiExtended.string().required(),
      RABBITMQ_PASSWORD: joiExtended.string().required(),
      RABBITMQ_PORT: joiExtended.ports().default(5672),
      OPERATOR_SERVICE_API_URL: joiExtended.string().required(),
      CLIENT_IO_HAPROXY_URL: joiExtended.string().required(),
      ROBOTS_AUTH_SECRET: joiExtended.string().required(),
      BLUE_RIBBON_API_URL: joiExtended.string().required(),
      BLUE_RIBBON_AUTHENTICATION_KEY: joiExtended.string().required(),
      BLUE_RIBBON_AUTHENTICATION_SECRET: joiExtended.string().required(),
      RNG_HOST: joiExtended.string().required(),
      RNG_PORT: joiExtended.number().default(3000),
      STREAM_AUTH_SECRET: joiExtended.string().required(),
      STREAM_AUTH_TEST_TOKEN_OK: joiExtended.string().required(),
      STREAM_AUTH_TEST_TOKEN_BAD: joiExtended.string().required(),
      GC_CURRENCY_WHITELIST: joiExtended.string().required(),
      ROBOT_OFFLINE_DURATION_THRESHOLD_SEC: joiExtended.number().integer().required(),
      SPINOMENAL_SECRET_KEY_STAGE: joiExtended.string().required(),
      CLIENT_FE_BASE_URL: joiExtended.string().required(),
      ROUND_END_DELAY_SECONDS: joiExtended.number().integer().default(10),
      PHANTOM_WIDGET_ANIMATION_DURATION_MS: joiExtended.number().integer().default(5000),
      URL_CREATOR_IP_WHITELIST: joiExtended.string().required(),
      CAMERA_API_TOKEN_TTL_SECONDS: joiExtended.number().integer().default(3600),
      VALIDATED_CONFIG_TTL_SEC: joiExtended.number().integer().default(30),
      ALLOW_PARALLEL_SESSIONS: joiExtended.boolean().default(false),
    }).pattern(/^CAMERA_API_PASS_/, joiExtended.string());

    if (initialConfigs.USE_GCP_SM) {
      envConfig = await ConfigService.populateEnvFromGCPSecretManager(envConfig);
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

  public getRedisConfig(isExternal: boolean = false): RedisOptions {
    let hosts: string | string[] = <string | string[]>(
      isExternal
        ? ConfigService.get(['core', 'EXTERNAL_REDIS_HOST'])
        : ConfigService.get(['core', 'REDIS_HOST'])
    );
    hosts = Array.isArray(hosts) ? hosts : [hosts];
    const ports: number | number[] = <number | number[]>ConfigService.get(['core', 'REDIS_PORT']);
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

  public getRabbitMQConfig(isExternal: boolean = false): string[] {
    return ConfigService.getRabbitMQConfig(isExternal);
  }

  public static getRabbitMQConfig(isExternal: boolean = false): string[] {
    const urls: string[] = [];
    let hosts: string | string[] = <string | string[]>(
      isExternal
        ? ConfigService.get(['core', 'EXTERNAL_RABBITMQ_HOST'])
        : ConfigService.get(['core', 'RABBITMQ_HOST'])
    );
    let ports: number | number[] = <number | number[]>ConfigService.get(['core', 'RABBITMQ_PORT'], 5672);
    const user: string = <string>ConfigService.get(['core', 'RABBITMQ_USERNAME']);
    const password: string = <string>ConfigService.get(['core', 'RABBITMQ_PASSWORD']);

    hosts = Array.isArray(hosts) ? hosts : [hosts];
    ports = Array.isArray(ports) ? ports : Array.from(hosts, () => Number(ports));
    hosts.forEach((node, nodeIndex) => {
      const port = ports[nodeIndex] ? ports[nodeIndex] : ports[0];
      urls.push(`amqp://${user}:${password}@${node}:${port}`);
    });

    return urls;
  }

  private static async populateEnvFromGCPSecretManager(envConfig: EnvConfig): Promise<EnvConfig> {
    const envVarMapping = {
      DB_SLAVE_PORT: 'DB_SLAVE_PORT',
      DB_SLAVE_USER: 'DB_SLAVE_USER',
      DB_SLAVE_PSW: 'DB_SLAVE_PSW',
      DB_SLAVE_NAME: 'DB_SLAVE_NAME',
      DB_SLAVE_HOST: 'DB_SLAVE_HOST',
      DB_MASTER_PORT: 'DB_MASTER_PORT',
      DB_MASTER_USER: 'DB_MASTER_USER',
      DB_MASTER_PSW: 'DB_MASTER_PSW',
      DB_MASTER_NAME: 'DB_MASTER_NAME',
      DB_MASTER_HOST: 'DB_MASTER_HOST',
      DB_LOGS: 'GCA_DB_LOGS',
      DB_CONNECTION_LIMIT: 'GCA_DB_CONNECTION_LIMIT',
      DB_RETRY_ATTEMPTS: 'DB_RETRY_ATTEMPTS',
      DB_MAX_QUERY_EXECUTION_TIME: 'DB_MAX_QUERY_EXECUTION_TIME',
      REDIS_HOST: 'REDIS_HOST',
      EXTERNAL_REDIS_HOST: 'EXTERNAL_REDIS_HOST',
      REDIS_PORT: 'REDIS_PORT',
      SENTINEL_NAME: ' SENTINEL_NAME',
      RABBITMQ_HOST: 'RABBITMQ_HOST',
      RABBITMQ_PORT: 'RABBITMQ_PORT',
      EXTERNAL_RABBITMQ_HOST: 'EXTERNAL_RABBITMQ_HOST',
      RABBITMQ_USERNAME: 'RABBITMQ_USERNAME',
      RABBITMQ_PASSWORD: 'RABBITMQ_PASSWORD',
      CLIENT_IO_HAPROXY_URL: 'GCA_CLIENT_IO_HAPROXY_URL',
      OPERATOR_SERVICE_API_URL: 'GCA_OPERATOR_SERVICE_API_URL',
      ROBOTS_AUTH_SECRET: 'GCA_ROBOTS_AUTH_SECRET',
      BLUE_RIBBON_API_URL: 'BLUE_RIBBON_API_URL',
      BLUE_RIBBON_AUTHENTICATION_KEY: 'BLUE_RIBBON_AUTHENTICATION_KEY',
      BLUE_RIBBON_AUTHENTICATION_SECRET: 'BLUE_RIBBON_AUTHENTICATION_SECRET',
      RNG_HOST: 'RNG_HOST',
      RNG_PORT: 'RNG_PORT',
      STREAM_AUTH_SECRET: 'STREAM_AUTH_SECRET',
      STREAM_AUTH_TEST_TOKEN_OK: 'STREAM_AUTH_TEST_TOKEN_OK',
      STREAM_AUTH_TEST_TOKEN_BAD: 'STREAM_AUTH_TEST_TOKEN_BAD',
      GC_CURRENCY_WHITELIST: 'GC_CURRENCY_WHITELIST',
      ROBOT_OFFLINE_DURATION_THRESHOLD_SEC: 'ROBOT_OFFLINE_DURATION_THRESHOLD_SEC',
      SPINOMENAL_SECRET_KEY_STAGE: 'SPINOMENAL_SECRET_KEY_STAGE',
      CLIENT_FE_BASE_URL: 'CLIENT_FE_BASE_URL',
      ROUND_END_DELAY_SECONDS: 'ROUND_END_DELAY_SECONDS',
      PHANTOM_WIDGET_ANIMATION_DURATION_MS: 'PHANTOM_WIDGET_ANIMATION_DURATION_MS',
      URL_CREATOR_IP_WHITELIST: 'URL_CREATOR_IP_WHITELIST',
      CAMERA_API_TOKEN_TTL_SECONDS: 'CG_CAMERA_API_TOKEN_TTL_SECONDS',
      VALIDATED_CONFIG_TTL_SEC: 'VALIDATED_CONFIG_TTL_SEC',
      ALLOW_PARALLEL_SESSIONS: 'ALLOW_PARALLEL_SESSIONS',
    };

    // eslint-disable-next-line guard-for-in
    for (const key in envVarMapping) {
      const secretName = envVarMapping[key];
      try {
        envConfig[key] = await ConfigService.getSecret(secretName, envConfig.USE_GCP_SM === 'true');
      } catch (e) {
        console.log(`Failed to get secret from GSM: ${secretName}`);
      }
    }

    return envConfig;
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
        if (!/(\.js|\.ts)$/.test(file)) {
          return configs;
        }
        // eslint-disable-next-line global-require
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

  public static async getSecret(secretName: string, useGcpOnInit?: boolean): Promise<string | undefined> {
    let secret: string;

    if (ConfigService.get(['core', 'USE_GCP_SM']) || useGcpOnInit) {
      if (!ConfigService.secretManagerServiceClient) {
        ConfigService.secretManagerServiceClient = new SecretManagerServiceClient();
      }

      const [version]: [
        protos.google.cloud.secretmanager.v1.IAccessSecretVersionResponse,
          protos.google.cloud.secretmanager.v1.IAccessSecretVersionRequest | undefined,
          Record<string, any> | undefined,
      ] = await ConfigService.secretManagerServiceClient.accessSecretVersion({
        name: `${ConfigService.GCP_PROJECT}/secrets/${secretName}/versions/latest`,
      });

      secret = version?.payload?.data ? version.payload.data.toString() : undefined;
    } else {
      secret = ConfigService.get(['core', secretName]) as string;
    }

    return secret;
  }
}
