import { SecuritySchemeObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export interface IInitDocumentation {
  endpoint: string;
  title: string;
  description: string;
  basePath: string;
  schemes: ['http', 'https'] | ['http' | 'https'];
  bearerAuth: SecuritySchemeObject;
  tag?: string[];
}
