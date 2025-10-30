import type { Section } from '../../types';

export interface StorageService {
  saveSections(sections: Section[]): void;
  loadSections(): Section[] | null;
  saveResults(results: Record<string, any>): void;
  loadResults(): Record<string, any> | null;
  clear(): void;
}

