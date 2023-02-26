import { DynamicModule, Module } from '@nestjs/common';
import 'reflect-metadata';
import { ACTIVE_OPERATORS } from '../../constants/injection.tokens';
import { SPINOMENAL, SPINOMENAL_EMU } from '../../constants/operator.tags';
import { ConfigService } from '../config/config.service';
import { SpinEmuOperatorModule } from '../spinEmu/spin.emu.operator.module';
import { SpinomenalOperatorModule } from '../spinomenal/spinomenal.operator.module';
import { OperatorFactory } from './operator.factory';

@Module({})
export class OperatorFactoryModule {
  static async register(): Promise<DynamicModule> {
    const config = await ConfigService.load();
    const activeOperators = config.get(['core', 'ACTIVE_OPERATORS']) as string;
    const { imports, operators } = activeOperators
      .split(',')
      .reduce((accum: { imports: any[]; operators: string[] }, value) => {
        switch (value) {
          case SPINOMENAL:
            accum.imports.push(SpinomenalOperatorModule);
            accum.operators.push(SPINOMENAL);
            break;
          case SPINOMENAL_EMU:
            accum.imports.push(SpinEmuOperatorModule);
            accum.operators.push(SPINOMENAL_EMU);
            break;
          default:
        }
        return accum;
      }, { imports: [], operators: [] });
    return {
      module: OperatorFactoryModule,
      imports,
      providers: [OperatorFactory, { provide: ACTIVE_OPERATORS, useValue: operators }],
      exports: [OperatorFactory, ACTIVE_OPERATORS],
    };
  }
}
