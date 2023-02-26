import { Module } from '@nestjs/common';
import {
  getConfig,
  TypeOrmModule,
  ConnectionType,
  connectionNames,
  configOption,
  MachineRepository,
  ChipRepository,
} from 'arcadia-dal';
import { ConfigModule } from '../modules/config/config.module';
import { ConfigService } from '../modules/config/config.service';
import { ChipModule } from '../modules/administration/chip/chip.module';
import { MachinesModule } from '../modules/machines/machines.module';
import { AppController } from './app.controller';
import { LoggerModule } from '../modules/logger/logger.module';

@Module({
  imports: [
    ConfigModule.load('./.env', true),
    TypeOrmModule.forRootAsync({
      name: connectionNames.DATA,
      useFactory: (configService: ConfigService) => getConfig(ConnectionType.MAIN, <configOption>configService.get('core')),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([MachineRepository, ChipRepository], connectionNames.DATA),
    ChipModule,
    MachinesModule,
    LoggerModule,
  ],
  controllers: [AppController],
})

export class AppModule {}
