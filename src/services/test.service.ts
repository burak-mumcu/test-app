import type { Endpoint, Scenario, ScenarioResult, TestConfig } from '../types';
import type { TestService } from './interfaces/test-service.interface';
import { validateResponseBody, validateResponseHeaders } from '../utils/response-validator.util';

class TestServiceImpl implements TestService {
  private defaultConfig: Required<TestConfig> = {
    timeout: 30000,
    retryCount: 0,
    retryDelay: 1000,
    validateResponseBody: false,
    validateResponseHeaders: false,
    expectedResponseBody: '',
    expectedResponseHeaders: {}
  };

  private async fetchWithTimeout(
    url: string,
    options: RequestInit,
    timeout: number
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  async runScenario(
    baseUrl: string,
    endpoint: Endpoint,
    scenario: Scenario,
    retryAttempt = 0
  ): Promise<ScenarioResult> {
    const startedAt = Date.now();
    const config = { ...this.defaultConfig, ...(scenario.testConfig ?? {}) };

    try {
      const url = new URL(endpoint.path, baseUrl).toString();
      const res = await this.fetchWithTimeout(
        url,
        {
          method: endpoint.method,
          headers: {
            'Content-Type': 'application/json',
            ...(scenario.headers ?? {})
          },
          body: ['POST', 'PUT', 'PATCH'].includes(endpoint.method)
            ? scenario.requestBody ?? undefined
            : undefined
        },
        config.timeout
      );

      const finishedAt = Date.now();
      const responseTime = finishedAt - startedAt;
      const status = res.status;

      // Read response body and headers
      let responseBody: string | undefined;
      let responseHeaders: Record<string, string> = {};

      try {
        responseBody = await res.clone().text();
        res.headers.forEach((value, key) => {
          responseHeaders[key] = value;
        });
      } catch {
        // Ignore errors reading response
      }

      // Validate response
      let isValid = status === scenario.expectedStatus;
      let errorMessages: string[] = [];

      if (status !== scenario.expectedStatus) {
        errorMessages.push(`Beklenen ${scenario.expectedStatus} fakat ${status} döndü`);
      }

      if (config.validateResponseBody && responseBody) {
        const bodyValid = validateResponseBody(responseBody, config.expectedResponseBody);
        if (!bodyValid) {
          isValid = false;
          errorMessages.push('Response body validation failed');
        }
      }

      if (config.validateResponseHeaders) {
        const { valid, errors } = validateResponseHeaders(responseHeaders, config.expectedResponseHeaders);
        if (!valid) {
          isValid = false;
          errorMessages.push(...errors);
        }
      }

      // Retry logic
      if (!isValid && retryAttempt < config.retryCount) {
        await new Promise((resolve) => setTimeout(resolve, config.retryDelay));
        return this.runScenario(baseUrl, endpoint, scenario, retryAttempt + 1);
      }

      return {
        scenarioId: scenario.id,
        status: isValid ? 'pass' : 'fail',
        actualStatus: status,
        startedAt,
        finishedAt,
        responseTime,
        responseBody,
        responseHeaders,
        retryCount: retryAttempt,
        errorMessage: errorMessages.length > 0 ? errorMessages.join('; ') : undefined
      };
    } catch (err: unknown) {
      const finishedAt = Date.now();
      const errorMessage = err instanceof Error ? err.message : 'Bilinmeyen hata';

      // Retry on network errors
      if (retryAttempt < config.retryCount) {
        await new Promise((resolve) => setTimeout(resolve, config.retryDelay));
        return this.runScenario(baseUrl, endpoint, scenario, retryAttempt + 1);
      }

      return {
        scenarioId: scenario.id,
        status: 'fail',
        startedAt,
        finishedAt,
        responseTime: finishedAt - startedAt,
        retryCount: retryAttempt,
        errorMessage
      };
    }
  }

  async runEndpoint(
    baseUrl: string,
    endpoint: Endpoint,
    onResult: (result: ScenarioResult) => void
  ): Promise<void> {
    for (const scenario of endpoint.scenarios) {
      onResult({ scenarioId: scenario.id, status: 'pending', startedAt: Date.now() });
      const result = await this.runScenario(baseUrl, endpoint, scenario);
      onResult(result);
    }
  }

  async runSection(
    baseUrl: string,
    endpoints: Endpoint[],
    onResult: (result: ScenarioResult, endpointId: string) => void
  ): Promise<void> {
    for (const ep of endpoints) {
      for (const sc of ep.scenarios) {
        onResult({ scenarioId: sc.id, status: 'pending', startedAt: Date.now() }, ep.id);
        const result = await this.runScenario(baseUrl, ep, sc);
        onResult(result, ep.id);
      }
    }
  }
}

export const testService: TestService = new TestServiceImpl();
