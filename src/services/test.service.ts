import type { Endpoint, Scenario, ScenarioResult, TestConfig } from '../types';
import type { TestService } from './interfaces/test-service.interface';
import type { RunnerConfig, RunMode } from '../types/interfaces/runner-config.interface';
import { validateResponseBody, validateResponseHeaders } from '../utils/response-validator.util';
import { resolveVariables, resolveVariablesInObject } from '../utils/variable-resolver.util';
import { runPreRequestScript, runTestScript } from '../utils/script-runner.util';

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
    retryAttempt = 0,
    variables: Record<string, string> = {}
  ): Promise<ScenarioResult> {
    const startedAt = Date.now();
    const config = { ...this.defaultConfig, ...(scenario.testConfig ?? {}) };

    // Run pre-request script if exists
    let scriptVariables = variables;
    if (scenario.preRequestScript) {
      const preScriptResult = runPreRequestScript(scenario.preRequestScript, {
        variables: { ...variables }
      });
      if (!preScriptResult.success && preScriptResult.error) {
        return {
          scenarioId: scenario.id,
          status: 'fail',
          startedAt,
          finishedAt: Date.now(),
          responseTime: 0,
          errorMessage: `Pre-request script error: ${preScriptResult.error}`
        };
      }
      scriptVariables = preScriptResult.variables || variables;
    }

    // Resolve variables (after pre-request script)
    const resolvedBaseUrl = resolveVariables(baseUrl, scriptVariables);
    const resolvedPath = resolveVariables(endpoint.path, scriptVariables);
    const resolvedHeaders = scenario.headers 
      ? resolveVariablesInObject(scenario.headers, scriptVariables)
      : {};
    const resolvedBody = scenario.requestBody 
      ? resolveVariables(scenario.requestBody, scriptVariables)
      : undefined;

    try {
      const url = new URL(resolvedPath, resolvedBaseUrl).toString();
      const res = await this.fetchWithTimeout(
        url,
        {
          method: endpoint.method,
          headers: {
            'Content-Type': 'application/json',
            ...resolvedHeaders
          },
          body: ['POST', 'PUT', 'PATCH'].includes(endpoint.method)
            ? resolvedBody ?? undefined
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

      // Run test script if exists
      let testScriptPassed = true;
      let testScriptError: string | undefined;
      if (scenario.testScript) {
        const testScriptResult = runTestScript(scenario.testScript, {
          variables: scriptVariables,
          response: {
            status,
            body: responseBody || '',
            headers: responseHeaders,
            responseTime
          }
        });
        if (!testScriptResult.success) {
          testScriptPassed = false;
          testScriptError = testScriptResult.error;
        }
      }

      // Validate response
      let isValid = status === scenario.expectedStatus && testScriptPassed;
      let errorMessages: string[] = [];

      if (status !== scenario.expectedStatus) {
        errorMessages.push(`Beklenen ${scenario.expectedStatus} fakat ${status} döndü`);
      }

      if (testScriptError) {
        errorMessages.push(`Test script failed: ${testScriptError}`);
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
        return this.runScenario(baseUrl, endpoint, scenario, retryAttempt + 1, variables);
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
        return this.runScenario(baseUrl, endpoint, scenario, retryAttempt + 1, variables);
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
    onResult: (result: ScenarioResult) => void,
    variables: Record<string, string> = {},
    config: RunnerConfig = { mode: 'sequential' }
  ): Promise<void> {
    if (config.mode === 'parallel') {
      const maxConcurrency = config.maxConcurrency || 5;
      const scenarios = endpoint.scenarios;
      
      for (let i = 0; i < scenarios.length; i += maxConcurrency) {
        const batch = scenarios.slice(i, i + maxConcurrency);
        const promises = batch.map(async (scenario) => {
          onResult({ scenarioId: scenario.id, status: 'pending', startedAt: Date.now() });
          const result = await this.runScenario(baseUrl, endpoint, scenario, 0, variables);
          onResult(result);
          return result;
        });
        
        const results = await Promise.all(promises);
        
        if (config.stopOnFailure && results.some(r => r.status === 'fail')) {
          break;
        }
      }
    } else if (config.mode === 'conditional') {
      for (const scenario of endpoint.scenarios) {
        onResult({ scenarioId: scenario.id, status: 'pending', startedAt: Date.now() });
        const result = await this.runScenario(baseUrl, endpoint, scenario, 0, variables);
        onResult(result);
        
        if (config.stopOnFailure && result.status === 'fail') {
          break;
        }
        
        if (config.delayBetweenRequests) {
          await new Promise(resolve => setTimeout(resolve, config.delayBetweenRequests));
        }
      }
    } else {
      // Sequential
      for (const scenario of endpoint.scenarios) {
        onResult({ scenarioId: scenario.id, status: 'pending', startedAt: Date.now() });
        const result = await this.runScenario(baseUrl, endpoint, scenario, 0, variables);
        onResult(result);
        
        if (config.stopOnFailure && result.status === 'fail') {
          break;
        }
        
        if (config.delayBetweenRequests) {
          await new Promise(resolve => setTimeout(resolve, config.delayBetweenRequests));
        }
      }
    }
  }

  async runSection(
    baseUrl: string,
    endpoints: Endpoint[],
    onResult: (result: ScenarioResult, endpointId: string) => void,
    variables: Record<string, string> = {},
    config: RunnerConfig = { mode: 'sequential' }
  ): Promise<void> {
    if (config.mode === 'parallel') {
      const maxConcurrency = config.maxConcurrency || 5;
      const allScenarios: Array<{ endpoint: Endpoint; scenario: Scenario }> = [];
      
      endpoints.forEach(ep => {
        ep.scenarios.forEach(sc => {
          allScenarios.push({ endpoint: ep, scenario: sc });
        });
      });
      
      for (let i = 0; i < allScenarios.length; i += maxConcurrency) {
        const batch = allScenarios.slice(i, i + maxConcurrency);
        const promises = batch.map(async ({ endpoint, scenario }) => {
          onResult({ scenarioId: scenario.id, status: 'pending', startedAt: Date.now() }, endpoint.id);
          const result = await this.runScenario(baseUrl, endpoint, scenario, 0, variables);
          onResult(result, endpoint.id);
          return result;
        });
        
        const results = await Promise.all(promises);
        
        if (config.stopOnFailure && results.some(r => r.status === 'fail')) {
          break;
        }
      }
    } else {
      // Sequential or Conditional
      for (const ep of endpoints) {
        for (const sc of ep.scenarios) {
          onResult({ scenarioId: sc.id, status: 'pending', startedAt: Date.now() }, ep.id);
          const result = await this.runScenario(baseUrl, ep, sc, 0, variables);
          onResult(result, ep.id);
          
          if (config.stopOnFailure && result.status === 'fail') {
            return;
          }
          
          if (config.delayBetweenRequests) {
            await new Promise(resolve => setTimeout(resolve, config.delayBetweenRequests));
          }
        }
      }
    }
  }
}

export const testService: TestService = new TestServiceImpl();
