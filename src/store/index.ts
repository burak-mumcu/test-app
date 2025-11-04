import { create } from 'zustand';
import { createEnvironmentSlice } from './slices/environment.slice';
import { createSectionSlice } from './slices/section.slice';
import { createEndpointSlice } from './slices/endpoint.slice';
import { createScenarioSlice } from './slices/scenario.slice';
import { createResultsSlice } from './slices/results.slice';
import { createPersistenceSlice } from './slices/persistence.slice';
import type { AppStore } from './interfaces/store.interface';

export const useAppStore = create<AppStore>()((...a) => ({
  ...createEnvironmentSlice(...a),
  ...createSectionSlice(...a),
  ...createEndpointSlice(...a),
  ...createScenarioSlice(...a),
  ...createResultsSlice(...a),
  ...createPersistenceSlice(...a)
}));

// Auto-save on state changes
useAppStore.subscribe((state) => {
  if (state.sections.length > 0 || state.environments.length > 0) {
    state.saveToStorage();
  }
});

// Load from storage on init
if (typeof window !== 'undefined') {
  useAppStore.getState().loadFromStorage();
}

