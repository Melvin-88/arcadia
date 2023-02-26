import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { ModuleRef, Reflector } from '@nestjs/core';
import { Module } from '@nestjs/core/injector/module';
import * as _ from 'lodash';
import 'reflect-metadata';
import { ACTIVE_OPERATORS } from '../../constants/injection.tokens';
import { OPERATOR_ADAPTER_TAG } from '../../constants/operator.tags';
import { BaseOperatorAdapter } from '../common/base.operator.adapter';
import { OperatorAdapter } from '../common/operator.interface';
import { ConfigService } from '../config/config.service';
import { AppLogger } from '../logger/logger.service';
import { OperatorFactoryModule } from './operator.factory.module';

@Injectable()
export class OperatorFactory implements OnApplicationBootstrap {
  private readonly activeOperators: Map<string, OperatorAdapter>;

  constructor(private readonly moduleRef: ModuleRef,
              private readonly reflector: Reflector,
              @Inject(ACTIVE_OPERATORS) private readonly operators: string[],
              private readonly logger: AppLogger,
  ) {
    this.activeOperators = new Map();
  }

  public onApplicationBootstrap(): void {
    const ops = (ConfigService.get(['core', 'ACTIVE_OPERATORS']) as string).split(',');
    const notSupported = _.difference(ops, this.operators);
    if (notSupported?.length) {
      this.logger.warn(`Operator tags not supported: ${JSON.stringify(notSupported)}`);
    }
    const factoryModule: Module = Array.from(((this.moduleRef as any).container
      .getModules() as Map<string, any>).values())
      .find(({ _metatype }) => _metatype.name === OperatorFactoryModule.name);
    const adapters: any[] = Array.from(factoryModule.imports.values())
      .flatMap(value => Array.from(value.providers.values()))
      .map(value => value.instance as any)
      .filter(value => value instanceof BaseOperatorAdapter);
    this.operators.forEach(adapterTag => {
      const adapter = adapters.find(adapter => this.reflector
        .get<string>(OPERATOR_ADAPTER_TAG, adapter.constructor) === adapterTag);
      if (!adapter) {
        throw new InternalServerErrorException(`Operator adapter '${adapterTag}' not found!`);
      }
      this.activeOperators.set(adapterTag, adapter);
    });
  }

  public getOperatorAdapter(id: string): OperatorAdapter {
    const operator = this.activeOperators.get(id);
    if (!operator) {
      throw new NotFoundException(`Operator (id=${id}) not found!`);
    }
    return operator;
  }

  public getOperators(): string[] {
    return Array.from(this.activeOperators.keys());
  }
}
