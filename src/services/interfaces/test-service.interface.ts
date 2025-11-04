import type { Endpoint, Scenario, ScenarioResult } from '../../types';
import type { RunnerConfig } from '../../types/interfaces/runner-config.interface';

export interface TestService {
  runScenario(
    baseUrl: string,
    endpoint: Endpoint,
    scenario: Scenario,
    retryAttempt?: number,
    variables?: Record<string, string>
  ): Promise<ScenarioResult>;
  runEndpoint(
    baseUrl: string,
    endpoint: Endpoint,
    onResult: (result: ScenarioResult) => void,
    variables?: Record<string, string>,
    config?: RunnerConfig
  ): Promise<void>;
  runSection(
    baseUrl: string,
    endpoints: Endpoint[],
    onResult: (result: ScenarioResult, endpointId: string) => void,
    variables?: Record<string, string>,
    config?: RunnerConfig
  ): Promise<void>;
}
