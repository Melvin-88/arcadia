import { HttpService, Module, NotAcceptableException } from '@nestjs/common';
import axios from 'axios';
import * as Joi from 'joi';
import 'reflect-metadata';
import { CONFIG_TAG } from '../../constants/injection.tokens';
import { SPINOMENAL_EMU } from '../../constants/operator.tags';
import { ConfigService } from '../config/config.service';
import { AuthResponseMapper } from './authResponseMapper';
import { BalanceResponseMapper } from './balanceResponseMapper';
import { BetResponseMapper } from './betResponseMapper';
import { SpinEmuOperatorAdapter } from './spin.emu.operator.adapter';

const configSchema: Joi.ObjectSchema = Joi.object({
  SPIN_EMU_BASE_URL: Joi.string().required(),
});

const configProvider = {
  provide: CONFIG_TAG,
  useFactory: async (configService: ConfigService): Promise<Record<string, any>> => {
    const { error, value: validatedConfig } = configSchema.validate(
      configService.get(['core']),
      { stripUnknown: true },
    );
    if (error) {
      throw new NotAcceptableException(`${SPINOMENAL_EMU} config validation error!`, error.message);
    }
    return validatedConfig;
  },
  inject: [ConfigService],
};

const httpServiceProvider = {
  provide: HttpService,
  useFactory: async (config: Record<string, any>): Promise<HttpService> => new HttpService(axios.create({
    baseURL: config.SPIN_EMU_BASE_URL,
    timeout: 5000,
  })),
  inject: [CONFIG_TAG],
};

@Module({
  providers: [SpinEmuOperatorAdapter, configProvider, httpServiceProvider, AuthResponseMapper,
    BalanceResponseMapper, BetResponseMapper],
  exports: [SpinEmuOperatorAdapter],
})
export class SpinEmuOperatorModule {
}
