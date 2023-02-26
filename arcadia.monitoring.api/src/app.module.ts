import { Inject, MiddlewareConsumer, Module } from '@nestjs/common';
import {
  configOption,
  connectionNames,
  ConnectionType,
  getConfig,
  TypeOrmModule,
  Connection,
  MysqlDriver,
  InjectConnection,
} from 'arcadia-dal';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from './modules/config/config.module';
import { LoggerModule } from './modules/logger/logger.module';
import { AppLogger } from './modules/logger/logger.service';
import { VideoServerModule } from './modules/videoServer/videoServer.module';
import { ConfigService } from './modules/config/config.service';
import { EventLogsModule } from './modules/eventLogs/eventLogs.module';
import { AlertsModule } from './modules/alerts/alerts.module';
import { ReportModule } from './modules/reports/report.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.load('./.env'),
    TypeOrmModule.forRootAsync({
      name: connectionNames.DATA,
      useFactory: (configService: ConfigService) => getConfig(ConnectionType.MAIN, configService.get('core') as configOption),
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({ uri: configService.get(['core', 'MONGODB_URI']) as string }),
      inject: [ConfigService],
    }),
    LoggerModule,
    VideoServerModule,
    EventLogsModule,
    AppLogger,
    AlertsModule,
    ReportModule,
  ],
  controllers: [AppController],
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

  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply((req: any, res: any, next: any) => {
        req.executionTime = Date.now();
        next();
      })
      .forRoutes('*');
  }
}
