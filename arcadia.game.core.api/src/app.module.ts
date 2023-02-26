import { Inject, MiddlewareConsumer, Module } from '@nestjs/common';
import {
  configOption,
  Connection,
  connectionNames,
  ConnectionType,
  getConfig,
  InjectConnection,
  MysqlDriver,
  TypeOrmModule,
} from 'arcadia-dal';
import { AppController } from './app.controller';
import { AuthModule } from './modules/auth/auth.module';
import { BoHandlerModule } from './modules/bo.handler/bo.handler.module';
import { ConfigModule } from './modules/config/config.module';
import { ConfigService } from './modules/config/config.service';
import { EventBusModule } from './modules/event.bus/event.bus.module';
import { RedisCacheModule } from './modules/global.cache/redis.cache.module';
import { LoggerModule } from './modules/logger/logger.module';
import { AppLogger } from './modules/logger/logger.service';
import { MessagingModule } from './modules/messaging/messaging.module';
import { PlayerClientModule } from './modules/player.client/player.client.module';
import { QueueManagerModule } from './modules/queue.manager/queue.manager.module';
import { StatusHandlingModule } from './modules/robot.status.handling/status.handling.module';
import { RobotErrorHandlingModule } from './modules/robotErrorHandling/robotErrorHandlingModule';

@Module({
  imports: [
    ConfigModule.load('./.env'),
    TypeOrmModule.forRootAsync({
      name: connectionNames.DATA,
      useFactory: (configService: ConfigService) => getConfig(ConnectionType.MAIN, configService.get('core') as configOption),
      inject: [ConfigService],
    }),
    LoggerModule,
    RedisCacheModule,
    MessagingModule,
    QueueManagerModule,
    AuthModule,
    BoHandlerModule,
    PlayerClientModule,
    StatusHandlingModule,
    RobotErrorHandlingModule,
    EventBusModule,
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

  public configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply((req: any, res: any, next: any) => {
        req.executionTime = Date.now();
        next();
      })
      .forRoutes('*');
  }
}
