import type { Section } from '../types';
import type { StorageService } from './interfaces/storage-service.interface';

class StorageServiceImpl implements StorageService {
  private readonly SECTIONS_KEY = 'api-test-app-sections';
  private readonly RESULTS_KEY = 'api-test-app-results';

  saveSections(sections: Section[]): void {
    try {
      localStorage.setItem(this.SECTIONS_KEY, JSON.stringify(sections));
    } catch (error) {
      console.error('Failed to save sections:', error);
    }
  }

  loadSections(): Section[] | null {
    try {
      const data = localStorage.getItem(this.SECTIONS_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to load sections:', error);
      return null;
    }
  }

  saveResults(results: Record<string, any>): void {
    try {
      localStorage.setItem(this.RESULTS_KEY, JSON.stringify(results));
    } catch (error) {
      console.error('Failed to save results:', error);
    }
  }

  loadResults(): Record<string, any> | null {
    try {
      const data = localStorage.getItem(this.RESULTS_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to load results:', error);
      return null;
    }
  }

  clear(): void {
    try {
      localStorage.removeItem(this.SECTIONS_KEY);
      localStorage.removeItem(this.RESULTS_KEY);
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  }
}

export const storageService: StorageService = new StorageServiceImpl();

