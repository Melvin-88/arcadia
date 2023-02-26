import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import * as helmet from 'helmet';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SecuritySchemeObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { AppModule } from './app.module';
import { initDocumentation } from './documentation';
import { MyLogger } from './modules/logger/logger.service';
import { APIExceptionFilter } from './filters/exception.filter';
import { validationExceptionFactory } from './factories/validation.exception.factory';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(helmet());
  app.useLogger(app.get(MyLogger));
  app.useGlobalFilters(new APIExceptionFilter(app.get(MyLogger)));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      exceptionFactory: validationExceptionFactory,
    }),
  );
  app.enableCors();
  app.setGlobalPrefix('api');

  initDocumentation(app, {
    description: 'Arcadia backoffice API',
    title: 'Arcadia backoffice API',
    schemes: ['http', 'https'],
    basePath: '/',
    bearerAuth: <SecuritySchemeObject>{ type: 'apiKey', name: 'Authorization' },
    endpoint: '/docs',
  });

  await app.listen(Number(process.env.PORT || 3000));
}

bootstrap();
