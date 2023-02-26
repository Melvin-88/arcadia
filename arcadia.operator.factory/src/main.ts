import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SecuritySchemeObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import * as helmet from 'helmet';
import 'reflect-metadata';
import { AppModule } from './app.module';
import { initDocumentation } from './documentation';
import { APIExceptionFilter } from './filters/exception.filter';
import { AppLogger } from './modules/logger/logger.service';

async function bootstrap(): Promise<NestExpressApplication> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(helmet());
  app.useLogger(app.get(AppLogger));
  app.useGlobalFilters(new APIExceptionFilter(app.get(AppLogger)));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.setGlobalPrefix('api');
  app.enableCors();

  initDocumentation(app, {
    description: 'Arcadia operator factory',
    title: 'Arcadia operator factory',
    schemes: ['http'],
    basePath: 'api',
    bearerAuth: <SecuritySchemeObject>{ type: 'oauth2' },
    endpoint: '/docs',
  });

  await app.listen(Number(process.env.PORT || 3000));
  return app;
}

bootstrap().then(app => app.get(AppLogger).log('Bootstrap complete'));
