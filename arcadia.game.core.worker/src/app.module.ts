import { Inject, Module } from '@nestjs/common';
import {
  ConnectionType,
  getConfig,
  TypeOrmModule,
  connectionNames,
  getRepositoryToken,
  SessionRepository,
  getConnectionToken,
  configOption,
  Connection,
  MysqlDriver,
  InjectConnection,
} from 'arcadia-dal';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './modules/config/config.module';
import { TaskModule } from './modules/task/task.module';
import { AppLogger } from './modules/logger/logger.service';
import { CoreClientModule } from './modules/coreClient/coreClient.module';
import { ConfigService } from './modules/config/config.service';

const configModule = ConfigModule.load('./.env');
@Module({
  imports: [
    configModule,
    TypeOrmModule.forRootAsync({
      name: connectionNames.DATA,
      useFactory: (configService: ConfigService) => getConfig(ConnectionType.MAIN, configService.get('core') as configOption),
      inject: [ConfigService],
    }),
    TaskModule,
    CoreClientModule,
    AppLogger,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: getRepositoryToken(SessionRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(SessionRepository),
      inject: [getConnectionToken(connectionNames.DATA)],
    },
  ],
})
export class AppModule {
  constructor(
    @InjectConnection(connectionNames.DATA) private readonly connection: Connection,
    @Inject(AppLogger) private readonly logger: AppLogger,
  ) {
    if (connection.driver.isReplicated) {
      const mysqlDriver = connection.driver as MysqlDriver;
      mysqlDriver.poolCluster.on('offline', nodeId => logger.error(`Can not connect to Database node(${nodeId}). Reconnecting`, ''));
    }
  }
}
