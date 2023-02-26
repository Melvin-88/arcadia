import { Inject, Injectable, NotAcceptableException } from '@nestjs/common';
import {
  Configuration,
  connectionNames,
  InjectRepository,
  MachineRepository,
  OperatorRepository,
} from 'arcadia-dal';
import * as CacheManager from 'cache-manager';
import * as Joi from 'joi';
import { ConfigService } from '../config/config.service';
import { REDIS_CACHE } from '../global.cache/redis.cache.module';
import { AppLogger } from '../logger/logger.service';

@Injectable()
export class ConfigValidator {
  private readonly configTtl: number;

  constructor(
    config: ConfigService,
    private readonly logger: AppLogger,
    @InjectRepository(MachineRepository, connectionNames.DATA)
    private readonly machineRepo: MachineRepository,
    @InjectRepository(OperatorRepository, connectionNames.DATA)
    private readonly operatorRepo: OperatorRepository,
    @Inject(REDIS_CACHE) private readonly cacheManager: CacheManager.Cache,
    @Inject('CONFIG_SCHEMA') private readonly configSchema: Joi.ObjectSchema,
  ) {
    this.configTtl = Number(config.get(['core', 'VALIDATED_CONFIG_TTL_SEC']));
  }

  public async getValidatedConfig(machineSerial: string, operatorId?: number): Promise<Configuration> {
    const key = ConfigValidator.getCacheKey(machineSerial, operatorId);
    const cachedConfig: Configuration = await this.cacheManager.get(key);
    if (cachedConfig) {
      return cachedConfig;
    }

    const machine = await this.machineRepo.findOneOrFail({ serial: machineSerial },
      { relations: ['group'] });
    if (!machine.group) {
      throw new NotAcceptableException('Configuration validation failed: no group');
    }
    let config = { ...machine.configuration, ...machine.group.configuration };
    if (operatorId) {
      const operator = await this.operatorRepo.findOneOrFail(operatorId);
      config = { ...config, ...operator.configuration };
    }

    const validationError = this.validateConfig(config);
    if (validationError) {
      this.logger.error(`Config validation error: ${JSON.stringify(validationError)}`);
      throw new NotAcceptableException('Configuration validation failed');
    }
    await this.cacheManager.set(key, config, { ttl: this.configTtl });
    return config;
  }

  public async dropConfigCache(machineSerial: string, operatorId?: number): Promise<void> {
    const key = ConfigValidator.getCacheKey(machineSerial, operatorId);
    await this.cacheManager.del(key);
  }

  private validateConfig(config: any): Joi.ValidationError | undefined {
    const result = this.configSchema
      .validate(config, { stripUnknown: false, allowUnknown: true });
    return result.error;
  }

  public async dropCache(machineSerial: string, operatorId?: number): Promise<void> {
    await this.cacheManager.del(ConfigValidator.getCacheKey(machineSerial, operatorId));
  }

  private static getCacheKey(machineSerial: string, operatorId?: number): string {
    return `configuration-${machineSerial}-${operatorId || 'noOperator'}`;
  }
}