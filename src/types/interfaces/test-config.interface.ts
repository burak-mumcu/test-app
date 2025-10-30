export interface TestConfig {
  timeout?: number; // milliseconds
  retryCount?: number;
  retryDelay?: number; // milliseconds
  validateResponseBody?: boolean;
  validateResponseHeaders?: boolean;
  expectedResponseBody?: string; // JSON string
  expectedResponseHeaders?: Record<string, string>;
}

