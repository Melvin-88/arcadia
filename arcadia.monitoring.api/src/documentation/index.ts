import { DocumentBuilder } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { InitDocumentation } from './documentation.interface';
import { SwaggerModuleExtended } from './SwaggerModuleExtended';

export function initDocumentation(
  app: INestApplication,
  initData: InitDocumentation,
) {
  const options = new DocumentBuilder()
    .setTitle(initData.title)
    .setDescription(initData.description)
    .addServer(initData.basePath)
    .addBearerAuth(initData.bearerAuth);

  if (initData.tag && initData.tag.length) {
    initData.tag.forEach(singleTag => options.addTag(singleTag));
  }

  const swaggerOptions = options.build();

  const document = SwaggerModuleExtended.createDocument(app, swaggerOptions);
  SwaggerModuleExtended.setupCustom(initData.endpoint, app, document);
}
