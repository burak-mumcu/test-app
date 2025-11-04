/**
 * Curl command generator utility
 */

import type { Endpoint, Scenario, Section } from '../types';

export interface CurlOptions {
  includeHeaders?: boolean;
  includeBody?: boolean;
  pretty?: boolean;
}

/**
 * Generates a curl command from endpoint and scenario
 */
export function generateCurl(
  section: Section,
  endpoint: Endpoint,
  scenario: Scenario,
  options: CurlOptions = {}
): string {
  const { includeHeaders = true, includeBody = true, pretty = true } = options;

  const url = new URL(endpoint.path, section.baseUrl).toString();
  let curl = `curl -X ${endpoint.method}`;

  // Add headers
  if (includeHeaders && scenario.headers) {
    Object.entries(scenario.headers).forEach(([key, value]) => {
      curl += ` \\\n  -H "${key}: ${value}"`;
    });
  }

  // Add body
  if (includeBody && scenario.requestBody && ['POST', 'PUT', 'PATCH'].includes(endpoint.method)) {
    if (pretty) {
      curl += ` \\\n  -d '${scenario.requestBody}'`;
    } else {
      curl += ` -d '${scenario.requestBody}'`;
    }
  }

  // Add URL
  if (pretty) {
    curl += ` \\\n  "${url}"`;
  } else {
    curl += ` "${url}"`;
  }

  return curl;
}

/**
 * Generates multiple curl commands for an endpoint
 */
export function generateCurlCommands(
  section: Section,
  endpoint: Endpoint,
  options: CurlOptions = {}
): string[] {
  return endpoint.scenarios.map(scenario => 
    generateCurl(section, endpoint, scenario, options)
  );
}

