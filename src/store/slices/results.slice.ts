import type { StateCreator } from 'zustand';
import type { SectionResult, ScenarioResult } from '../../types';
import type { AppStore, ResultsSlice } from '../interfaces/store.interface';

export const createResultsSlice: StateCreator<AppStore, [], [], ResultsSlice> = (set) => ({
  results: {},
  setScenarioResult: (sectionId, endpointId, result) => set((state) => {
    const sectionResult = state.results[sectionId] ?? { sectionId, endpoints: [] };
    const epIdx = sectionResult.endpoints.findIndex((e) => e.endpointId === endpointId);
    if (epIdx === -1) {
      sectionResult.endpoints.push({ endpointId, results: [result] });
    } else {
      const existing = sectionResult.endpoints[epIdx];
      const idx = existing.results.findIndex((r) => r.scenarioId === result.scenarioId);
      if (idx === -1) existing.results.push(result);
      else existing.results[idx] = result;
    }
    return { results: { ...state.results, [sectionId]: sectionResult } };
  }),
  resetResultsForSection: (sectionId) => set((state) => {
    const copy = { ...state.results };
    delete copy[sectionId];
    return { results: copy };
  })
});

