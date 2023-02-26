import {
  HttpService, Module, NotAcceptableException, Provider,
} from '@nestjs/common';
import axios from 'axios';
import * as Joi from 'joi';
import 'reflect-metadata';
import { SPINOMENAL } from '../../constants/operator.tags';
import { ConfigService } from '../config/config.service';
import { AuthResponseMapper } from './authResponseMapper';
import { BalanceResponseMapper } from './balanceResponseMapper';
import { BetResponseMapper } from './betResponseMapper';
import { SpinomenalOperatorAdapter } from './spinomenal.operator.adapter';
import { SpinomenalConfig } from './spinomenalConfig';

const configSchema: Joi.ObjectSchema = Joi.object({
  SPINOMENAL_BASE_URL: Joi.string().required(),
  SPINOMENAL_SECRET_KEY: Joi.string().required(),
  SPINOMENAL_PROVIDER_CODE: Joi.string().required(),
  SPINOMENAL_GAME_CODE: Joi.string().required(),
  SPINOMENAL_PARTNER_ID: Joi.string().required(),
});

const configProvider: Provider = {
  provide: SpinomenalConfig,
  useFactory: async (configService: ConfigService): Promise<SpinomenalConfig> => {
    const { error, value: validatedConfig } = configSchema.validate(
      configService.get(['core']), { stripUnknown: true },
    );
    if (error) {
      throw new NotAcceptableException(`${SPINOMENAL} config validation error!`, error.message);
    }
    return validatedConfig;
  },
  inject: [ConfigService],
};

const httpServiceProvider: Provider = {
  provide: HttpService,
  useFactory: async (config: SpinomenalConfig): Promise<HttpService> => new HttpService(axios.create({
    baseURL: config.SPINOMENAL_BASE_URL,
    timeout: 5000,
  })),
  inject: [SpinomenalConfig],
};

@Module({
  providers: [SpinomenalOperatorAdapter, configProvider, httpServiceProvider, AuthResponseMapper,
    BalanceResponseMapper, BetResponseMapper],
  exports: [SpinomenalOperatorAdapter],
})
export class SpinomenalOperatorModule {
}
