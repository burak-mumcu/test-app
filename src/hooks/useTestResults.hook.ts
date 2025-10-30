import { useAppStore } from '../store';
import type { ScenarioResult } from '../types';

export function useTestResults(sectionId: string, endpointId: string, scenarioId: string) {
  const results = useAppStore((s) => s.results[sectionId]);
  const endpointResults = results?.endpoints.find((e) => e.endpointId === endpointId);
  const result: ScenarioResult | undefined = endpointResults?.results.find((r) => r.scenarioId === scenarioId);
  const setScenarioResult = useAppStore((s) => s.setScenarioResult);
  const resetResultsForSection = useAppStore((s) => s.resetResultsForSection);

  return {
    result,
    setScenarioResult: (result: ScenarioResult) => setScenarioResult(sectionId, endpointId, result),
    resetResults: () => resetResultsForSection(sectionId)
  };
}

