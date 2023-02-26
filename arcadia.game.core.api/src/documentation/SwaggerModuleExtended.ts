import { INestApplication } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { OpenAPIObject } from '@nestjs/swagger/dist/interfaces';
import * as swaggerUi from 'swagger-ui-express';

interface SwaggerDocumentOptions {
  include?: ((...args: any[]) => any)[];
}

export class SwaggerModuleExtended extends SwaggerModule {
  static setupCustom(
    path: string, app: INestApplication, document: OpenAPIObject,
    options?: SwaggerDocumentOptions): void {
    const validatePath = path => (path.charAt(0) !== '/' ? `/'${path}` : path);
    const finalPath = validatePath(path);
    const swaggerHtml = swaggerUi.generateHTML(document, options);
    app.use(finalPath, swaggerUi.serveFiles(document, options));
    app.use(finalPath, (req, res) => res.send(swaggerHtml));
    app.use(`${finalPath}-json`, (req, res) => res.json(document));
  }
}
