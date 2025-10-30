import { useAppStore } from '../store';
import type { Section } from '../types';

export function useSection(sectionId: string) {
  const section = useAppStore((s) => s.sections.find((x) => x.id === sectionId));
  const updateSection = useAppStore((s) => s.updateSection);
  
  if (!section) {
    throw new Error(`Section with id ${sectionId} not found`);
  }

  return {
    section,
    updateSection: (patch: Partial<Section>) => updateSection(sectionId, patch)
  };
}

