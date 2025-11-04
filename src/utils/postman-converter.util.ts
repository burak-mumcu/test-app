/**
 * Postman Collection v2.1 converter utilities
 */

import type { Section, Endpoint, Scenario } from '../types';
import { nanoid } from './nanoid';

export interface PostmanCollection {
  info: {
    name: string;
    schema: string;
    _exporter_id?: string;
  };
  item: PostmanItem[];
  variable?: PostmanVariable[];
}

export interface PostmanItem {
  name: string;
  item?: PostmanItem[];
  request?: PostmanRequest;
  response?: any[];
}

export interface PostmanRequest {
  method: string;
  header?: Array<{ key: string; value: string; type?: string }>;
  body?: {
    mode: string;
    raw?: string;
    formdata?: any[];
    urlencoded?: any[];
  };
  url: {
    raw?: string;
    host?: string[];
    path?: string[];
    query?: Array<{ key: string; value: string }>;
  };
}

export interface PostmanVariable {
  key: string;
  value: string;
  type?: string;
}

/**
 * Converts Postman Collection to our internal format
 */
export function importPostmanCollection(collection: PostmanCollection): {
  sections: Section[];
  environments: any[];
} {
  const sections: Section[] = [];
  const environments: any[] = [];

  // Extract environment variables
  if (collection.variable) {
    const env: any = {
      id: nanoid(),
      name: collection.info.name + ' Environment',
      variables: {},
      isActive: true
    };
    collection.variable.forEach(v => {
      env.variables[v.key] = v.value || '';
    });
    environments.push(env);
  }

  // Convert items to sections
  const processItems = (items: PostmanItem[], baseUrl: string = ''): Endpoint[] => {
    const endpoints: Endpoint[] = [];

    items.forEach(item => {
      if (item.item) {
        // It's a folder - create a section
        const section: Section = {
          id: nanoid(),
          name: item.name,
          baseUrl: baseUrl,
          endpoints: processItems(item.item, baseUrl)
        };
        sections.push(section);
      } else if (item.request) {
        // It's a request - create an endpoint
        const request = item.request;
        const url = request.url?.raw || '';
        const path = url.startsWith('http') ? new URL(url).pathname : url;
        
        const endpoint: Endpoint = {
          id: nanoid(),
          name: item.name,
          method: (request.method || 'GET').toUpperCase() as any,
          path: path || '/',
          scenarios: []
        };

        // Create scenario from request
        const scenario: Scenario = {
          id: nanoid(),
          name: 'Default',
          expectedStatus: 200,
          headers: request.header?.reduce((acc, h) => {
            acc[h.key] = h.value || '';
            return acc;
          }, {} as Record<string, string>),
          requestBody: request.body?.raw || request.body?.mode === 'formdata' 
            ? JSON.stringify(request.body.formdata)
            : undefined
        };

        endpoint.scenarios.push(scenario);
        endpoints.push(endpoint);
      }
    });

    return endpoints;
  };

  if (collection.item) {
    const endpoints = processItems(collection.item);
    if (endpoints.length > 0 || sections.length === 0) {
      // Create a default section if no folders found
      const defaultSection: Section = {
        id: nanoid(),
        name: collection.info.name || 'Imported Collection',
        baseUrl: '',
        endpoints
      };
      sections.push(defaultSection);
    }
  }

  return { sections, environments };
}

/**
 * Converts our internal format to Postman Collection
 */
export function exportToPostmanCollection(sections: Section[]): PostmanCollection {
  const items: PostmanItem[] = [];

  sections.forEach(section => {
    if (section.endpoints.length === 0) return;

    const sectionItems: PostmanItem[] = section.endpoints.map(ep => {
      const scenarios = ep.scenarios.length > 0 ? ep.scenarios : [{
        id: nanoid(),
        name: 'Default',
        expectedStatus: 200,
        headers: {},
        requestBody: undefined
      }];

      const firstScenario = scenarios[0];
      const headers = firstScenario.headers || {};
      const headerArray = Object.entries(headers).map(([key, value]) => ({
        key,
        value: String(value),
        type: 'text'
      }));

      const url = section.baseUrl + ep.path;
      const urlObj = new URL(url, 'http://placeholder.com');

      return {
        name: ep.name,
        request: {
          method: ep.method,
          header: headerArray.length > 0 ? headerArray : undefined,
          body: firstScenario.requestBody ? {
            mode: 'raw',
            raw: firstScenario.requestBody
          } : undefined,
          url: {
            raw: url,
            host: urlObj.hostname ? [urlObj.hostname] : undefined,
            path: urlObj.pathname.split('/').filter(p => p),
            query: Array.from(urlObj.searchParams.entries()).map(([key, value]) => ({
              key,
              value
            }))
          }
        }
      };
    });

    items.push({
      name: section.name,
      item: sectionItems
    });
  });

  return {
    info: {
      name: 'API Test App Export',
      schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
    },
    item: items
  };
}

