import type { Section, Endpoint, Scenario, SectionResult, ScenarioResult } from '../../types';

export interface SectionSlice {
  sections: Section[];
  activeSectionId: string | null;
  addSection: (name?: string, baseUrl?: string) => void;
  removeSection: (sectionId: string) => void;
  updateSection: (sectionId: string, patch: Partial<Section>) => void;
  setActiveSection: (sectionId: string | null) => void;
  duplicateSection: (sectionId: string) => void;
  createSectionTemplate: (sectionId: string, templateName: string) => void;
  loadSectionFromTemplate: (templateName: string) => void;
}

export interface EndpointSlice {
  addEndpoint: (sectionId: string, endpoint?: Partial<Endpoint>) => void;
  removeEndpoint: (sectionId: string, endpointId: string) => void;
  updateEndpoint: (sectionId: string, endpointId: string, patch: Partial<Endpoint>) => void;
  duplicateEndpoint: (sectionId: string, endpointId: string) => void;
  bulkRemoveEndpoints: (sectionId: string, endpointIds: string[]) => void;
}

export interface ScenarioSlice {
  addScenario: (sectionId: string, endpointId: string, scenario?: Partial<Scenario>) => void;
  removeScenario: (sectionId: string, endpointId: string, scenarioId: string) => void;
  updateScenario: (sectionId: string, endpointId: string, scenarioId: string, patch: Partial<Scenario>) => void;
  duplicateScenario: (sectionId: string, endpointId: string, scenarioId: string) => void;
  bulkRemoveScenarios: (sectionId: string, endpointId: string, scenarioIds: string[]) => void;
}

export interface ResultsSlice {
  results: Record<string, SectionResult>;
  setScenarioResult: (sectionId: string, endpointId: string, result: ScenarioResult) => void;
  resetResultsForSection: (sectionId: string) => void;
}

export interface PersistenceSlice {
  loadFromStorage: () => void;
  saveToStorage: () => void;
  exportToJSON: () => string;
  importFromJSON: (json: string) => boolean;
  clearStorage: () => void;
}

export interface AppStore extends SectionSlice, EndpointSlice, ScenarioSlice, ResultsSlice, PersistenceSlice {}

