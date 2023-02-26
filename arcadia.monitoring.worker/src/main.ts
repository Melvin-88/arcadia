import { NestFactory } from '@nestjs/core';
import { ShutdownSignal, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { AppLogger } from './modules/logger/logger.service';
import { ServerRMQ } from './rabbitMQ.strategy';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger: AppLogger = app.get(AppLogger);
  app.enableShutdownHooks([ShutdownSignal.SIGTERM]);
  app.connectMicroservice({
    strategy: new ServerRMQ({
      noAck: false,
      queueOptions: {
        durable: true,
      },
      socketOptions: {
        heartbeatIntervalInSeconds: 5,
        reconnectTimeInSeconds: 5,
      },
    },
    logger),
  });

  app.useLogger(logger);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.enableCors();
  app.setGlobalPrefix('api');

  await app.startAllMicroservicesAsync();
  await app.listen(Number(process.env.PORT || 3000));
}
bootstrap();
