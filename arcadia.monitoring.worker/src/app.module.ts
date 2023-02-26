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
  AlertRepository,
  configOptionWithAudit, OperatorRepository,
} from 'arcadia-dal';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './modules/config/config.module';
import { TaskModule } from './modules/task/task.module';
import { AppLogger } from './modules/logger/logger.service';
import { CoreClientModule } from './modules/coreClient/coreClient.module';
import { ConfigService } from './modules/config/config.service';
import { EventLog, EventLogSchema } from './modules/schemas';
import { RobotEventLog, RobotEventLogSchema } from './modules/schemas/robotEventLog.schema';
import { ReportsModule } from './modules/reports/reports.module';

const configModule = ConfigModule.load('./.env');
@Module({
  imports: [
    configModule,
    TypeOrmModule.forRootAsync({
      name: connectionNames.DATA,
      useFactory: (configService: ConfigService) => getConfig(ConnectionType.MAIN, configService.get('core') as configOption),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      name: connectionNames.AUDIT,
      useFactory: (configService: ConfigService) => getConfig(ConnectionType.AUDIT, <configOptionWithAudit>configService.get('core')),
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({ uri: configService.get(['core', 'MONGODB_URI']) as string }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: EventLog.name, schema: EventLogSchema },
      { name: RobotEventLog.name, schema: RobotEventLogSchema },
    ]),
    ReportsModule,
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
    {
      provide: getRepositoryToken(AlertRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(AlertRepository),
      inject: [getConnectionToken(connectionNames.DATA)],
    },
    {
      provide: getRepositoryToken(OperatorRepository, connectionNames.DATA),
      useFactory: connection => connection.getCustomRepository(OperatorRepository),
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
