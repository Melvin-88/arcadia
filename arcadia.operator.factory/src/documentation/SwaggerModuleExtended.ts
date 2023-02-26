/* eslint-disable consistent-return */
import * as loadPackageUtil from '@nestjs/common/utils/load-package.util';
import { SwaggerModule } from '@nestjs/swagger';
import * as swaggerUi from 'swagger-ui-express';

interface SwaggerDocumentOptions {
  include?: ((...args: any[]) => any)[];
}

export class SwaggerModuleExtended extends SwaggerModule {
  static setupCustom(path, app, document, options?: SwaggerDocumentOptions) {
    const validatePath = path => (path.charAt(0) !== '/' ? `/'${path}` : path);
    const httpServer = app.getHttpServer();
    if (app.getType() === 'fastify') {
      return this.setupFastifyCustom(path, httpServer, document);
    }
    const finalPath = validatePath(path);
    const swaggerHtml = swaggerUi.generateHTML(document, options);
    app.use(finalPath, swaggerUi.serveFiles(document, options));
    app.use(finalPath, (req, res) => res.send(swaggerHtml));
    app.use(`${finalPath}-json`, (req, res) => res.json(document));
  }

  static setupFastifyCustom(path, httpServer, document) {
    httpServer.register(
      loadPackageUtil.loadPackage('fastify-swagger', 'SwaggerModule'),
      {
        swagger: document,
        exposeRoute: true,
        routePrefix: path,
        mode: 'static',
        specification: {
          document,
        },
      },
    );
  }
}
