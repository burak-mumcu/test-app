import type { StateCreator } from 'zustand';
import { storageService } from '../../services/storage.service';
import type { AppStore, PersistenceSlice } from '../interfaces/store.interface';

export const createPersistenceSlice: StateCreator<AppStore, [], [], PersistenceSlice> = (set, get) => ({
  loadFromStorage: () => {
    const sections = storageService.loadSections();
    const results = storageService.loadResults();
    const savedEnvironments = localStorage.getItem('api-test-environments');
    
    if (sections && sections.length > 0) {
      set({
        sections,
        activeSectionId: sections[0]?.id ?? null
      });
    }
    
    if (results) {
      set({ results });
    }

    if (savedEnvironments) {
      try {
        const envs = JSON.parse(savedEnvironments);
        if (Array.isArray(envs) && envs.length > 0) {
          set({
            environments: envs,
            activeEnvironmentId: envs.find((e: any) => e.isActive)?.id || envs[0]?.id || null
          });
        }
      } catch (error) {
        console.error('Failed to load environments:', error);
      }
    }
  },
  saveToStorage: () => {
    const state = get();
    storageService.saveSections(state.sections);
    storageService.saveResults(state.results);
    localStorage.setItem('api-test-environments', JSON.stringify(state.environments));
  },
  exportToJSON: () => {
    const state = get();
    return JSON.stringify({
      sections: state.sections,
      results: state.results,
      environments: state.environments,
      exportedAt: new Date().toISOString(),
      version: '1.1'
    }, null, 2);
  },
  importFromJSON: (json: string) => {
    try {
      const data = JSON.parse(json);
      if (data.sections && Array.isArray(data.sections)) {
        set({
          sections: data.sections,
          activeSectionId: data.sections[0]?.id ?? null,
          results: data.results ?? {},
          environments: data.environments && Array.isArray(data.environments) && data.environments.length > 0
            ? data.environments
            : get().environments,
          activeEnvironmentId: data.environments && Array.isArray(data.environments) && data.environments.length > 0
            ? (data.environments.find((e: any) => e.isActive)?.id || data.environments[0]?.id || null)
            : get().activeEnvironmentId
        });
        storageService.saveSections(data.sections);
        storageService.saveResults(data.results ?? {});
        if (data.environments && Array.isArray(data.environments)) {
          localStorage.setItem('api-test-environments', JSON.stringify(data.environments));
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to import JSON:', error);
      return false;
    }
  },
  clearStorage: () => {
    storageService.clear();
    localStorage.removeItem('api-test-environments');
    set({
      sections: [],
      activeSectionId: null,
      results: {}
    });
  }
});

