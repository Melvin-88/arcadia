import { Module, Provider } from '@nestjs/common';
import {
  connectionNames,
  getConnectionToken,
  getRepositoryToken,
  MachineRepository,
  OperatorRepository,
  ScatterType,
} from 'arcadia-dal';
import * as Joi from 'joi';
import { ConfigValidator } from './configValidator';

const configSchema: Joi.ObjectSchema = Joi.object({
  autoplay: Joi.object({
    tiltMode: Joi.string().required(),
    stopIfJackpot: Joi.boolean().required(),
    stopAfterRounds: Joi.number().integer().required(),
    hiLimitMultiplier: Joi.number().integer().required(),
    lowLimitMultiplier: Joi.number().integer().required(),
    singleWinThreshold: Joi.number().integer().required(),
  }).required(),
  betBehind: Joi.object({
    stopIfJackpot: Joi.boolean().required(),
    stopAfterRounds: Joi.number().integer().required(),
    hiLimitMultiplier: Joi.number().integer().required(),
    lowLimitMultiplier: Joi.number().integer().required(),
    singleWinThreshold: Joi.number().integer().required(),
  }).required(),
  minimalHold: Joi.object({
    count: Joi.number().integer().required(),
    value: Joi.number().required(),
  }).required(),
  dispensers: Joi.object().pattern(/[\w_-]{1,100}/, Joi.object({
    capacity: Joi.number().integer().required(),
    chipType: Joi.string().required(),
  })).required(),
  rtpSegment: Joi.string(),
  reshuffleCoinsEmpty: Joi.number().integer().required(),
  reshuffleCoinsNonEmpty: Joi.number().integer().required(),
  countryWhitelist: Joi.array().items(Joi.string()),
  scatterType: Joi.string().valid(...Object.values(ScatterType)).required(),
  slot: Joi.array().items(Joi.string()).when('scatterType', {
    is: ScatterType.SLOT,
    then: Joi.required(),
  }),
});

const configSchemaProvider: Provider = {
  provide: 'CONFIG_SCHEMA',
  useValue: configSchema,
};

@Module({
  providers: [configSchemaProvider, ConfigValidator,
    {
      provide: getRepositoryToken(MachineRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(MachineRepository),
      inject: [getConnectionToken(connectionNames.DATA)],
    },
    {
      provide: getRepositoryToken(OperatorRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(OperatorRepository),
      inject: [getConnectionToken(connectionNames.DATA)],
    },
  ],
  exports: [ConfigValidator],
})
export class ConfigValidatorModule {

}