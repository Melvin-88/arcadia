import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from './modules/config/config.module';
import { GameServerConnectorModule } from './modules/game.server.connector/game.server.connector.module';
import { LoggerModule } from './modules/logger/logger.module';

@Module({
  imports: [
    LoggerModule,
    GameServerConnectorModule,
    ConfigModule,
  ],
  controllers: [AppController],
})
export class AppModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(
      (req: any, res: any, next: any) => {
        req.executionTime = Date.now();
        next();
      },
    ).forRoutes('*');
  }
}
