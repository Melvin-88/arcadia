/* eslint-disable max-lines */
const fs = require('fs');
const dotenv = require('dotenv');
const Joi = require('joi');
const SecretManagerServiceClient = require('@google-cloud/secret-manager').SecretManagerServiceClient;
const JoiExtended = Joi.extend(...require('../util/joiExtend'));

module.exports = {
  getConfigs: async filePath => {
    const configs = await loadConfigAsync(filePath);
    const apiPrefix = '/api/v1';
    const urls = [];

    for (const node of Array.isArray(configs.RABBITMQ_HOST) ? configs.RABBITMQ_HOST : [configs.RABBITMQ_HOST]) {
      urls.push(`amqp://${configs.RABBITMQ_USERNAME}:${configs.RABBITMQ_PASSWORD}@${node}:${configs.RABBITMQ_PORT || 5672}`);
    }

    return {
      gameCore: {
        apiUrl: (configs.GAME_CORE_API_HOST && configs.GAME_CORE_API_PORT)
          ? `http://${configs.GAME_CORE_API_HOST}:${configs.GAME_CORE_API_PORT}${apiPrefix}`
          : `http://localhost:3000${apiPrefix}`,
      },
      redis: configs.SENTINEL_NAME ?
        {
          sentinels: configs.REDIS_HOST.map((host, index) => ({
            host,
            port: (Array.isArray(configs.REDIS_PORT) && configs.REDIS_PORT[index]) ? configs.REDIS_PORT[index] : configs.REDIS_PORT,
          })),
          name: configs.SENTINEL_NAME
        } :
        {
          host: configs.REDIS_HOST || 'localhost',
          port: parseInt(configs.REDIS_PORT, 10) || 6379,
        },
      rabbitMQ: {
        amqpUrl: configs.RABBITMQ_HOST ? urls : ['amqp://localhost:5672'],
        coreQueue: `${configs.PLAYER_TO_CORE_QUEUE || 'playerToCoreQueue'}`,
      },
      loginWaitTimeout: parseInt(configs.LOGIN_WAIT_TIMEOUT || '30000', 10),
      messagesRate: parseInt(configs.MESSAGES_PER_SECOND_RATE, 10),
      server: {
        port: parseInt(configs.SOCKET_PORT, 10) || 3001,
      },
    };
  },
};

const loadConfigAsync = async filePath => {
  let parseConf;

  if (fs.existsSync(filePath)) {
    parseConf = dotenv.config({ path: filePath });
    if (parseConf.error) {
      throw new Error(`Dotenv error: ${parseConf.error}`);
    }

    parseConf = parseConf.parsed;
  } else {
    parseConf = process.env;
  }

  const initialConfigs = validateInitial(parseConf);
  let configs = { ...(await loadAndValidateMain(parseConf, initialConfigs)), ...initialConfigs };

  return configs;
};

const validateInitial = envConfig => {
  const initialEnvVarsSchema = JoiExtended.object({
    USE_GCP_SM: JoiExtended.boolean()
      .default(false),
    GCP_PROJECT: JoiExtended.string()
      .when('USE_GCP_SM', {
        is: true,
        then: JoiExtended.required()
      }),
    GOOGLE_APPLICATION_CREDENTIALS: JoiExtended.string()
      .when('USE_GCP_SM', {
        is: true,
        then: JoiExtended.required()
      }),
  });

  const {
    error,
    value: validatedEnvConfig
  } = initialEnvVarsSchema.validate(envConfig, { stripUnknown: true });
  if (error) {
    throw new Error(`Initial validation error: ${error.message}`);
  }
  return validatedEnvConfig;
};

const loadAndValidateMain = async (envConfig, initialConfigs) => {
  const envVarsSchema = JoiExtended.object({
    REDIS_HOST: JoiExtended.hosts()
      .required(),
    REDIS_PORT: JoiExtended.ports()
      .default(6379),
    SENTINEL_NAME: JoiExtended.string(),
    RABBITMQ_HOST: JoiExtended.hosts()
      .required(),
    RABBITMQ_USERNAME: JoiExtended.string()
      .required(),
    RABBITMQ_PASSWORD: JoiExtended.string()
      .required(),
    RABBITMQ_PORT: JoiExtended.ports()
      .default(5672),
    PLAYER_TO_CORE_QUEUE: JoiExtended.string()
      .required(),
    LOGIN_WAIT_TIMEOUT: JoiExtended.number()
      .default(30000),
    MESSAGES_PER_SECOND_RATE: JoiExtended.number()
      .required(),
    SOCKET_PORT: JoiExtended.number()
      .default(3001),
    GAME_CORE_API_HOST: JoiExtended.string()
      .required(),
    GAME_CORE_API_PORT: JoiExtended.number()
      .default(3000),
  });

  if (initialConfigs.USE_GCP_SM) {
    envConfig = await populateEnvFromGCPSecretManager(envConfig, initialConfigs);
  }

  const {
    error,
    value: validatedEnvConfig
  } = envVarsSchema.validate(envConfig, { stripUnknown: true });
  if (error) {
    throw new Error(`Config validation error: ${error.message}`);
  }

  return validatedEnvConfig;
};

const populateEnvFromGCPSecretManager = async (envConfig, initialConfigs) => {
  const secretManagerServiceClient = new SecretManagerServiceClient();

  const envVarMapping = {
    REDIS_HOST: 'REDIS_HOST',
    REDIS_PORT: 'REDIS_PORT',
    RABBITMQ_HOST: 'RABBITMQ_HOST',
    RABBITMQ_USERNAME: 'RABBITMQ_USERNAME',
    RABBITMQ_PASSWORD: 'RABBITMQ_PASSWORD',
    RABBITMQ_PORT: 'RABBITMQ_PORT',
    PLAYER_TO_CORE_QUEUE: 'CSN_PLAYER_TO_CORE_QUEUE',
    LOGIN_WAIT_TIMEOUT: 'CSN_LOGIN_WAIT_TIMEOUT',
    MESSAGES_PER_SECOND_RATE: 'CSN_MESSAGES_PER_SECOND_RATE',
    SOCKET_PORT: 'CSN_SOCKET_PORT',
    GAME_CORE_API_HOST: 'GAME_CORE_API_HOST',
    GAME_CORE_API_PORT: 'GAME_CORE_API_PORT',
  };

  for (const key in envVarMapping) {
    try {
      const secretName = envVarMapping[key];
      const [version] = await secretManagerServiceClient.accessSecretVersion({
        name: `${initialConfigs.GCP_PROJECT}/secrets/${secretName}/versions/latest`,
      });

      if (version.payload && version.payload.data) {
        envConfig[key] = version.payload.data.toString();
      }
    } catch (e) {
    }
  }

  return envConfig;
};
