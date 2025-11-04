import type { TestConfig } from './test-config.interface';

export interface Scenario {
  id: string;
  name: string;
  expectedStatus: number;
  requestBody?: string;
  headers?: Record<string, string>;
  testConfig?: TestConfig;
  preRequestScript?: string; // JavaScript code to run before request
  testScript?: string; // JavaScript code to run after request (assertions)
}
