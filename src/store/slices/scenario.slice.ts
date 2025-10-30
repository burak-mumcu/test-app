import type { StateCreator } from 'zustand';
import { nanoid } from '../../utils/nanoid';
import type { Scenario } from '../../types';
import type { AppStore, ScenarioSlice } from '../interfaces/store.interface';

export const createScenarioSlice: StateCreator<AppStore, [], [], ScenarioSlice> = (set) => ({
  addScenario: (sectionId, endpointId, scenario = {}) => set((state) => ({
    sections: state.sections.map((s) => {
      if (s.id !== sectionId) return s;
      return {
        ...s,
        endpoints: s.endpoints.map((e) => {
          if (e.id !== endpointId) return e;
          const sc: Scenario = {
            id: nanoid(),
            name: scenario.name ?? 'Yeni Senaryo',
            expectedStatus: scenario.expectedStatus ?? 200,
            requestBody: scenario.requestBody,
            headers: scenario.headers,
            testConfig: scenario.testConfig
          };
          return { ...e, scenarios: [...e.scenarios, sc] };
        })
      };
    })
  })),
  removeScenario: (sectionId, endpointId, scenarioId) => set((state) => ({
    sections: state.sections.map((s) =>
      s.id === sectionId
        ? {
            ...s,
            endpoints: s.endpoints.map((e) =>
              e.id === endpointId ? { ...e, scenarios: e.scenarios.filter((sc) => sc.id !== scenarioId) } : e
            )
          }
        : s
    )
  })),
  updateScenario: (sectionId, endpointId, scenarioId, patch) => set((state) => ({
    sections: state.sections.map((s) =>
      s.id === sectionId
        ? {
            ...s,
            endpoints: s.endpoints.map((e) =>
              e.id === endpointId
                ? { ...e, scenarios: e.scenarios.map((sc) => (sc.id === scenarioId ? { ...sc, ...patch } : sc)) }
                : e
            )
          }
        : s
    )
  })),
  duplicateScenario: (sectionId, endpointId, scenarioId) => set((state) => ({
    sections: state.sections.map((s) => {
      if (s.id !== sectionId) return s;
      return {
        ...s,
        endpoints: s.endpoints.map((e) => {
          if (e.id !== endpointId) return e;
          const scenario = e.scenarios.find((sc) => sc.id === scenarioId);
          if (!scenario) return e;
          
          const duplicated: Scenario = {
            ...scenario,
            id: nanoid(),
            name: `${scenario.name} (Kopya)`
          };
          
          return { ...e, scenarios: [...e.scenarios, duplicated] };
        })
      };
    })
  })),
  bulkRemoveScenarios: (sectionId, endpointId, scenarioIds) => set((state) => ({
    sections: state.sections.map((s) =>
      s.id === sectionId
        ? {
            ...s,
            endpoints: s.endpoints.map((e) =>
              e.id === endpointId
                ? { ...e, scenarios: e.scenarios.filter((sc) => !scenarioIds.includes(sc.id)) }
                : e
            )
          }
        : s
    )
  }))
});

