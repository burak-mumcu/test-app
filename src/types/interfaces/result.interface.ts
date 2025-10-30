export type ScenarioResultStatus = 'pending' | 'pass' | 'fail';

export interface ScenarioResult {
  scenarioId: string;
  status: ScenarioResultStatus;
  actualStatus?: number;
  errorMessage?: string;
  startedAt?: number;
  finishedAt?: number;
  responseTime?: number; // milliseconds
  responseBody?: string;
  responseHeaders?: Record<string, string>;
  retryCount?: number;
}

export interface EndpointResult {
  endpointId: string;
  results: ScenarioResult[];
}

export interface SectionResult {
  sectionId: string;
  endpoints: EndpointResult[];
}

