import type { GraphQLRequest, GraphQLScenario } from '../types/interfaces/graphql-request.interface';
import type { ScenarioResult } from '../types';
import { resolveVariables } from '../utils/variable-resolver.util';
import { runPreRequestScript, runTestScript } from '../utils/script-runner.util';

export interface GraphQLService {
  runQuery(
    endpoint: string,
    request: GraphQLRequest,
    variables: Record<string, string>
  ): Promise<ScenarioResult>;
}

class GraphQLServiceImpl implements GraphQLService {
  async runQuery(
    endpoint: string,
    request: GraphQLRequest,
    variables: Record<string, string> = {}
  ): Promise<ScenarioResult> {
    const startedAt = Date.now();

    try {
      // Resolve variables in query and variables
      const resolvedQuery = resolveVariables(request.query, variables);
      let resolvedVariables = request.variables || {};
      if (request.variables) {
        const varsString = JSON.stringify(request.variables);
        const resolvedVarsString = resolveVariables(varsString, variables);
        resolvedVariables = JSON.parse(resolvedVarsString);
      }

      // Run pre-request script if exists
      let scriptVariables = variables;
      if (request.preRequestScript) {
        const preScriptResult = runPreRequestScript(request.preRequestScript, {
          variables: { ...variables }
        });
        if (!preScriptResult.success && preScriptResult.error) {
          return {
            scenarioId: '',
            status: 'fail',
            startedAt,
            finishedAt: Date.now(),
            responseTime: 0,
            errorMessage: `Pre-request script error: ${preScriptResult.error}`
          };
        }
        scriptVariables = preScriptResult.variables || variables;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: resolvedQuery,
          variables: resolvedVariables,
          operationName: request.operationName
        })
      });

      const finishedAt = Date.now();
      const responseTime = finishedAt - startedAt;
      const status = response.status;

      let responseBody: string | undefined;
      let responseHeaders: Record<string, string> = {};

      try {
        responseBody = await response.clone().text();
        response.headers.forEach((value, key) => {
          responseHeaders[key] = value;
        });
      } catch {
        // Ignore errors reading response
      }

      // Run test script if exists
      let testScriptPassed = true;
      let testScriptError: string | undefined;
      if (request.testScript) {
        const testScriptResult = runTestScript(request.testScript, {
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

      // Parse GraphQL response
      let graphqlErrors: string[] = [];
      try {
        const jsonResponse = JSON.parse(responseBody || '{}');
        if (jsonResponse.errors && Array.isArray(jsonResponse.errors)) {
          graphqlErrors = jsonResponse.errors.map((e: any) => e.message || String(e));
        }
      } catch {
        // Not JSON or parsing failed
      }

      const isValid = status === 200 && testScriptPassed && graphqlErrors.length === 0;
      const errorMessages: string[] = [];

      if (status !== 200) {
        errorMessages.push(`HTTP ${status}`);
      }

      if (graphqlErrors.length > 0) {
        errorMessages.push(`GraphQL errors: ${graphqlErrors.join(', ')}`);
      }

      if (testScriptError) {
        errorMessages.push(`Test script failed: ${testScriptError}`);
      }

      return {
        scenarioId: '',
        status: isValid ? 'pass' : 'fail',
        actualStatus: status,
        startedAt,
        finishedAt,
        responseTime,
        responseBody,
        responseHeaders,
        errorMessage: errorMessages.length > 0 ? errorMessages.join('; ') : undefined
      };
    } catch (err: unknown) {
      const finishedAt = Date.now();
      const errorMessage = err instanceof Error ? err.message : 'Bilinmeyen hata';

      return {
        scenarioId: '',
        status: 'fail',
        startedAt,
        finishedAt,
        responseTime: finishedAt - startedAt,
        errorMessage
      };
    }
  }
}

export const graphqlService: GraphQLService = new GraphQLServiceImpl();

