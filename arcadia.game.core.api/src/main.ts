import { ShutdownSignal, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SecuritySchemeObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import 'reflect-metadata';
import { AppModule } from './app.module';
import { initDocumentation } from './documentation';
import { APIExceptionFilter } from './filters/exception.filter';
import { AppLogger } from './modules/logger/logger.service';
import { ServerRMQ } from './modules/rmq.server/rmq.server';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

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
  app.useGlobalFilters(new APIExceptionFilter(app.get(AppLogger)));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.enableCors();
  app.setGlobalPrefix('api');

  initDocumentation(app, {
    description: 'Arcadia game core API',
    title: 'Arcadia game core API',
    schemes: ['http'],
    basePath: 'api',
    bearerAuth: <SecuritySchemeObject>{ type: 'oauth2' },
    endpoint: '/docs',
  });

  await app.startAllMicroservicesAsync();
  await app.listen(Number(process.env.PORT || 3000));
}

bootstrap();
