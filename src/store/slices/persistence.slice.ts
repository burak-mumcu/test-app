import type { StateCreator } from 'zustand';
import { storageService } from '../../services/storage.service';
import type { AppStore, PersistenceSlice } from '../interfaces/store.interface';

export const createPersistenceSlice: StateCreator<AppStore, [], [], PersistenceSlice> = (set, get) => ({
  loadFromStorage: () => {
    const sections = storageService.loadSections();
    const results = storageService.loadResults();
    
    if (sections && sections.length > 0) {
      set({
        sections,
        activeSectionId: sections[0]?.id ?? null
      });
    }
    
    if (results) {
      set({ results });
    }
  },
  saveToStorage: () => {
    const state = get();
    storageService.saveSections(state.sections);
    storageService.saveResults(state.results);
  },
  exportToJSON: () => {
    const state = get();
    return JSON.stringify({
      sections: state.sections,
      results: state.results,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    }, null, 2);
  },
  importFromJSON: (json: string) => {
    try {
      const data = JSON.parse(json);
      if (data.sections && Array.isArray(data.sections)) {
        set({
          sections: data.sections,
          activeSectionId: data.sections[0]?.id ?? null,
          results: data.results ?? {}
        });
        storageService.saveSections(data.sections);
        storageService.saveResults(data.results ?? {});
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
    set({
      sections: [],
      activeSectionId: null,
      results: {}
    });
  }
});

