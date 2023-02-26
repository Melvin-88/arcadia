/* eslint-disable max-lines */
import { SecretManagerServiceClient, v1 } from '@google-cloud/secret-manager';
import * as protos from '@google-cloud/secret-manager/build/protos/protos';
import { RuntimeException } from '@nestjs/core/errors/exceptions/runtime.exception';
import * as dotenv from 'dotenv';
import {existsSync, readFileSync} from 'fs';
import * as Joi from 'joi';
import { get } from 'lodash';

export interface EnvConfig {
  [key: string]: any;
}

export class ConfigService {
  private static envConfig: EnvConfig;
  private static secretManagerServiceClient: v1.SecretManagerServiceClient;

  constructor(config: EnvConfig) {
    ConfigService.envConfig = config;
  }

  public static async load(filePath: string): Promise<ConfigService> {
    const config: EnvConfig = await this.loadConfigAsync(filePath);
    return new ConfigService(config);
  }

  private static validateInitial(envConfig: EnvConfig): EnvConfig {
    const initialEnvVarsSchema: Joi.ObjectSchema = Joi.object({
      PORT: Joi.number().default(3000),
      SWAGGER_ENDPOINT: Joi.string().default('/docs'),
      USE_GCP_SM: Joi.boolean().default(false),
      GCP_PROJECT: Joi.string().when('USE_GCP_SM', { is: true, then: Joi.required() }),
      GOOGLE_APPLICATION_CREDENTIALS: Joi.string().when('USE_GCP_SM', { is: true, then: Joi.required() }),
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

  private static async loadConfigAsync(filePath: string): Promise<EnvConfig> {
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
    const configs = { ...(await ConfigService.loadAndValidateMain(parseConf, initialConfigs)), ...initialConfigs };

    return { core: configs };
  }

  private static async loadAndValidateMain(envConfig: EnvConfig, initialConfigs: EnvConfig): Promise<EnvConfig> {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      MAX_REQUEST_RATE: Joi.number().required(),
      GAME_CORE_API_HOST: Joi.string().required(),
      GAME_CORE_API_PORT: Joi.number().default(3000),
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

    const gameCoreApiHost = validatedEnvConfig.GAME_CORE_API_HOST;
    const gameCoreApiPort = validatedEnvConfig.GAME_CORE_API_PORT;
    validatedEnvConfig.GAME_CORE_API_URL = `http://${gameCoreApiHost}:${gameCoreApiPort}/api/v1`;

    return validatedEnvConfig;
  }

  private static async populateEnvFromGCPSecretManager(envConfig: EnvConfig, initialConfigs: EnvConfig): Promise<EnvConfig> {
    if (!ConfigService.secretManagerServiceClient) {
      ConfigService.secretManagerServiceClient = new SecretManagerServiceClient();
    }
    const envVarMapping = {
      MAX_REQUEST_RATE: 'CA_MAX_REQUEST_RATE',
      GAME_CORE_API_HOST: 'GAME_CORE_API_HOST',
      GAME_CORE_API_PORT: 'GAME_CORE_API_PORT',
    };

    // eslint-disable-next-line guard-for-in
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
        console.error(e);
      }
    }

    return envConfig;
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
