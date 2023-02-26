/* eslint-disable max-lines */
import { SecretManagerServiceClient, v1 } from '@google-cloud/secret-manager';
import * as protos from '@google-cloud/secret-manager/build/protos/protos';
import { RuntimeException } from '@nestjs/core/errors/exceptions/runtime.exception';
import * as dotenv from 'dotenv';
import { existsSync, readdirSync } from 'fs';
import * as Joi from 'joi';
import { get } from 'lodash';
import * as path from 'path';
import { Environments } from '../../enums/environments';
import { JoiExtentions } from '../util/joiExtend';

const joiExtended = Joi.extend(...JoiExtentions);

export type EnvConfig = Record<string, any>;

export class ConfigService {
  private static instance: ConfigService;
  private static envConfig: EnvConfig;
  private static readonly configDir: string = '/configs/';
  private static secretManagerServiceClient: v1.SecretManagerServiceClient;

  constructor(config: EnvConfig) {
    ConfigService.envConfig = config;
  }

  public static async load(filePath?: string): Promise<ConfigService> {
    if (!ConfigService.instance) {
      const config: EnvConfig = await this.loadConfigAsync(filePath || '');
      ConfigService.instance = new ConfigService(config);
    }
    return ConfigService.instance;
  }

  private static validateInitial(envConfig: EnvConfig): EnvConfig {
    const initialEnvVarsSchema: Joi.ObjectSchema = Joi.object({
      NODE_ENV: Joi.string().valid(...Object.values(Environments)).required(),
      PORT: Joi.number().default(3003),
      USE_GCP_SM: Joi.boolean().default(false),
      GCP_PROJECT: Joi.string().when('USE_GCP_SM', { is: true, then: Joi.required() }),
      GOOGLE_APPLICATION_CREDENTIALS: Joi.string().when('USE_GCP_SM', {
        is: true,
        then: Joi.required(),
      }),
      API_VERSION: Joi.number().default(1),
    });

    const { error, value: validatedEnvConfig } = initialEnvVarsSchema.validate(
      envConfig, { stripUnknown: false, allowUnknown: true },
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
    configs = this.configGrab(matches, configs);

    return configs;
  }

  private static async loadAndValidateMain(envConfig: EnvConfig, initialConfigs: EnvConfig): Promise<EnvConfig> {
    const envVarsSchema: Joi.ObjectSchema = joiExtended.object({
      ACTIVE_OPERATORS: joiExtended.string().required(),
      RABBITMQ_HOST: joiExtended.hosts().required(),
      RABBITMQ_USERNAME: joiExtended.string().required(),
      RABBITMQ_PASSWORD: joiExtended.string().required(),
      RABBITMQ_PORT: joiExtended.ports().default(5672),
      CORE_TO_MONITORING_WORKER_QUEUE: joiExtended.string(),
    });

    if (initialConfigs.USE_GCP_SM) {
      envConfig = await ConfigService.populateEnvFromGCPSecretManager(envConfig, initialConfigs);
    }

    const { error, value: validatedEnvConfig } = envVarsSchema.validate(
      envConfig,
      {
        stripUnknown: false,
        allowUnknown: true,
      },
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
      ACTIVE_OPERATORS: 'OP_ACTIVE_OPERATORS',
      SPINOMENAL_BASE_URL: 'SPINOMENAL_BASE_URL',
      SPINOMENAL_SECRET_KEY: 'SPINOMENAL_SECRET_KEY_STAGE',
      SPINOMENAL_PROVIDER_CODE: 'SPINOMENAL_PROVIDER_CODE',
      SPINOMENAL_GAME_CODE: 'SPINOMENAL_GAME_CODE',
      SPINOMENAL_PARTNER_ID: 'SPINOMENAL_PARTNER_ID',
      SPIN_EMU_BASE_URL: 'SPIN_EMU_BASE_URL',
      RABBITMQ_HOST: 'RABBITMQ_HOST',
      RABBITMQ_PORT: 'RABBITMQ_PORT',
      RABBITMQ_USERNAME: 'RABBITMQ_USERNAME',
      RABBITMQ_PASSWORD: 'RABBITMQ_PASSWORD',
      CORE_TO_MONITORING_WORKER_QUEUE: 'CORE_TO_MONITORING_WORKER_QUEUE',
    };

    // eslint-disable-next-line guard-for-in,no-restricted-syntax
    for (const key in envVarMapping) {
      try {
        const secretName = envVarMapping[key];
        const [version]: [
          protos.google.cloud.secretmanager.v1.IAccessSecretVersionResponse,
            protos.google.cloud.secretmanager.v1.IAccessSecretVersionRequest | undefined,
            Record<string, any> | undefined,
        ] = await ConfigService.secretManagerServiceClient.accessSecretVersion({
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

  protected static configGrab(
    configPaths: string[],
    initValue: EnvConfig,
  ): EnvConfig {
    const configPathSchema: Joi.ArraySchema = Joi.array()
      .items(
        Joi.string()
          .valid('log4js.js', 'log4js.ts')
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

  public getRabbitMQConfig(): string[] {
    return ConfigService.getRabbitMQConfig();
  }

  public static getRabbitMQConfig(): string[] {
    const urls: string[] = [];
    let hosts: string | string[] = <string | string[]>(ConfigService.get(['core', 'RABBITMQ_HOST']));
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
}
