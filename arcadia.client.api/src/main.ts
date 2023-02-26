import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as rateLimit from 'express-rate-limit';
import * as helmet from 'helmet';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';
import { APIExceptionFilter } from './filters/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const maxReqRate = ConfigService.get(['core', 'MAX_REQUEST_RATE']) as string;
  app.use(
    rateLimit({
      windowMs: 1000,
      max: maxReqRate,
    }),
  );
  app.use(helmet());
  app.useGlobalFilters(new APIExceptionFilter(new Logger('EXCEPTION')));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.enableCors();
  app.setGlobalPrefix('api');

  const options = new DocumentBuilder()
    .setTitle('Arcadia Client API')
    .setDescription('Arcadia Client API')
    .setVersion('1.0')
    .addServer('/')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  const swaggerEndpoint = ConfigService.get(['core', 'SWAGGER_ENDPOINT']) as string;
  SwaggerModule.setup(swaggerEndpoint, app, document);

  const port: number = parseInt(ConfigService.get(['core', 'PORT']) as string, 10);
  await app.listen(port, () => console.log(`Listening port ${port}`));
}

bootstrap();
