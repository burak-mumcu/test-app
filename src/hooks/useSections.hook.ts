import { useAppStore } from '../store';

export function useSections() {
  const sections = useAppStore((s) => s.sections);
  const activeSectionId = useAppStore((s) => s.activeSectionId);
  const addSection = useAppStore((s) => s.addSection);
  const removeSection = useAppStore((s) => s.removeSection);
  const setActiveSection = useAppStore((s) => s.setActiveSection);

  return {
    sections,
    activeSectionId,
    addSection,
    removeSection,
    setActiveSection,
    activeSection: sections.find((s) => s.id === activeSectionId) ?? null
  };
}

