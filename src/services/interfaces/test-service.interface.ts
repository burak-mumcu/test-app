import type { Endpoint, Scenario, ScenarioResult } from '../../types';

export interface TestService {
  runScenario(baseUrl: string, endpoint: Endpoint, scenario: Scenario): Promise<ScenarioResult>;
  runEndpoint(baseUrl: string, endpoint: Endpoint, onResult: (result: ScenarioResult) => void): Promise<void>;
  runSection(baseUrl: string, endpoints: Endpoint[], onResult: (result: ScenarioResult, endpointId: string) => void): Promise<void>;
}
