import { SwaggerModule } from '@nestjs/swagger';
import * as swaggerUi from 'swagger-ui-express';

interface SwaggerDocumentOptions {
  include?: Function[];
}

export class SwaggerModuleExtended extends SwaggerModule {
  constructor() {
    super();
  }

  static setupCustom(path, app, document, options?: SwaggerDocumentOptions) {
    const validatePath = path => (path.charAt(0) !== '/' ? `/'${path}` : path);
    const finalPath = validatePath(path);
    const swaggerHtml = swaggerUi.generateHTML(document, options);
    app.use(finalPath, swaggerUi.serveFiles(document, options));
    app.use(finalPath, (req, res) => res.send(swaggerHtml));
    app.use(`${finalPath}-json`, (req, res) => res.json(document));
  }
}
