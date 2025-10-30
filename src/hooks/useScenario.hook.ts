import { useSection } from './useSection.hook';
import { useAppStore } from '../store';
import type { Scenario } from '../types';

export function useScenario(sectionId: string, endpointId: string, scenarioId: string) {
  const { section } = useSection(sectionId);
  const endpoint = section.endpoints.find((e) => e.id === endpointId);
  const scenario = endpoint?.scenarios.find((sc) => sc.id === scenarioId);
  const updateScenario = useAppStore((s) => s.updateScenario);
  const removeScenario = useAppStore((s) => s.removeScenario);

  if (!scenario) {
    throw new Error(`Scenario with id ${scenarioId} not found`);
  }

  return {
    scenario,
    updateScenario: (patch: Partial<Scenario>) => updateScenario(sectionId, endpointId, scenarioId, patch),
    removeScenario: () => removeScenario(sectionId, endpointId, scenarioId)
  };
}

