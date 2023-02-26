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

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const logger: AppLogger = app.get(AppLogger);

  app.use(helmet());
  app.useLogger(logger);
  app.useGlobalFilters(new APIExceptionFilter(app.get(AppLogger)));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.enableCors();
  app.setGlobalPrefix('api');

  initDocumentation(app, {
    description: 'Arcadia monitoring API',
    title: 'Arcadia monitoring API',
    schemes: ['http'],
    basePath: '/',
    bearerAuth: <SecuritySchemeObject>{ type: 'oauth2' },
    endpoint: '/docs',
  });

  await app.listen(Number(process.env.PORT || 3000));
}

bootstrap();
