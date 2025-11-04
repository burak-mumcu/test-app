/**
 * Swagger/OpenAPI converter utilities
 */

import type { Section, Endpoint } from '../types';
import { nanoid } from './nanoid';

export interface SwaggerSpec {
  openapi?: string;
  swagger?: string;
  info?: {
    title?: string;
    version?: string;
  };
  servers?: Array<{ url: string }>;
  paths?: Record<string, Record<string, any>>;
}

/**
 * Converts Swagger/OpenAPI spec to our internal format
 */
export function importSwaggerSpec(spec: SwaggerSpec): {
  sections: Section[];
  baseUrl: string;
} {
  const sections: Section[] = [];
  const baseUrl = spec.servers?.[0]?.url || '';

  if (!spec.paths) {
    return { sections, baseUrl };
  }

  const endpoints: Endpoint[] = [];

  Object.entries(spec.paths).forEach(([path, methods]) => {
    Object.entries(methods).forEach(([method, operation]) => {
      if (!['get', 'post', 'put', 'patch', 'delete', 'head', 'options'].includes(method.toLowerCase())) {
        return;
      }

      const op = operation as any;
      const endpoint: Endpoint = {
        id: nanoid(),
        name: op.operationId || op.summary || `${method.toUpperCase()} ${path}`,
        path,
        method: method.toUpperCase() as any,
        scenarios: [
          {
            id: nanoid(),
            name: 'Default',
            expectedStatus: getDefaultStatus(method),
            headers: extractHeaders(op),
            requestBody: extractRequestBody(op)
          }
        ]
      };

      endpoints.push(endpoint);
    });
  });

  if (endpoints.length > 0) {
    const section: Section = {
      id: nanoid(),
      name: spec.info?.title || 'Imported from Swagger/OpenAPI',
      baseUrl,
      endpoints
    };
    sections.push(section);
  }

  return { sections, baseUrl };
}

function getDefaultStatus(method: string): number {
  const statusMap: Record<string, number> = {
    get: 200,
    post: 201,
    put: 200,
    patch: 200,
    delete: 204,
    head: 200,
    options: 200
  };
  return statusMap[method.toLowerCase()] || 200;
}

function extractHeaders(operation: any): Record<string, string> | undefined {
  const headers: Record<string, string> = {};
  
  // Extract security requirements
  if (operation.security) {
    operation.security.forEach((sec: any) => {
      Object.keys(sec).forEach(key => {
        if (key === 'bearerAuth') {
          headers['Authorization'] = 'Bearer {{token}}';
        } else if (key === 'apiKey') {
          headers['X-API-Key'] = '{{apiKey}}';
        }
      });
    });
  }

  // Extract Content-Type from request body
  if (operation.requestBody) {
    const content = operation.requestBody.content;
    if (content) {
      const contentType = Object.keys(content)[0];
      if (contentType) {
        headers['Content-Type'] = contentType;
      }
    }
  }

  return Object.keys(headers).length > 0 ? headers : undefined;
}

function extractRequestBody(operation: any): string | undefined {
  if (!operation.requestBody || !operation.requestBody.content) {
    return undefined;
  }

  const content = operation.requestBody.content;
  const schema = content['application/json']?.schema || content['application/xml']?.schema;
  
  if (schema) {
    // Generate example JSON from schema
    return JSON.stringify(generateExampleFromSchema(schema), null, 2);
  }

  return undefined;
}

function generateExampleFromSchema(schema: any): any {
  if (schema.example) {
    return schema.example;
  }

  if (schema.type === 'object' && schema.properties) {
    const example: any = {};
    Object.entries(schema.properties).forEach(([key, prop]: [string, any]) => {
      example[key] = generateExampleFromSchema(prop);
    });
    return example;
  }

  if (schema.type === 'array') {
    return schema.items ? [generateExampleFromSchema(schema.items)] : [];
  }

  // Default values based on type
  const typeDefaults: Record<string, any> = {
    string: '',
    number: 0,
    integer: 0,
    boolean: false,
    null: null
  };

  return typeDefaults[schema.type] ?? null;
}

