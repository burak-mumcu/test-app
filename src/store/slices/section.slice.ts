import type { StateCreator } from 'zustand';
import { nanoid } from '../../utils/nanoid';
import type { Section } from '../../types';
import type { AppStore, SectionSlice } from '../interfaces/store.interface';

export const createSectionSlice: StateCreator<AppStore, [], [], SectionSlice> = (set, get) => {
  const firstSectionId = nanoid();
  
  return {
    sections: [
      {
        id: firstSectionId,
        name: 'Örnek Servis',
        baseUrl: 'http://localhost:3123',
        endpoints: [
          {
            id: nanoid(),
            name: 'Health',
            path: '/health',
            method: 'GET',
            scenarios: [
              { id: nanoid(), name: '200 OK', expectedStatus: 200 },
              { id: nanoid(), name: '401 Unauthorized', expectedStatus: 401 }
            ]
          }
        ]
      }
    ],
    activeSectionId: firstSectionId,
    addSection: (name = 'Yeni Section', baseUrl = 'http://localhost:3123') =>
      set((state) => {
        const newSectionId = nanoid();
        const newSections = [
          ...state.sections,
          { id: newSectionId, name, baseUrl, endpoints: [] }
        ];
        return {
          sections: newSections,
          activeSectionId: newSectionId
        };
      }),
    removeSection: (sectionId) => set((state) => {
      const newSections = state.sections.filter((s) => s.id !== sectionId);
      let newActiveId = state.activeSectionId;
      if (newActiveId === sectionId) {
        newActiveId = newSections.length > 0 ? newSections[0].id : null;
      }
      return {
        sections: newSections,
        activeSectionId: newActiveId
      };
    }),
    updateSection: (sectionId, patch) => set((state) => ({
      sections: state.sections.map((s) => (s.id === sectionId ? { ...s, ...patch } : s))
    })),
    setActiveSection: (sectionId) => set({ activeSectionId: sectionId }),
    duplicateSection: (sectionId) => set((state) => {
      const section = state.sections.find((s) => s.id === sectionId);
      if (!section) return state;
      
      const newSectionId = nanoid();
      const duplicated: Section = {
        ...section,
        id: newSectionId,
        name: `${section.name} (Kopya)`,
        endpoints: section.endpoints.map((ep) => ({
          ...ep,
          id: nanoid(),
          scenarios: ep.scenarios.map((sc) => ({ ...sc, id: nanoid() }))
        }))
      };
      
      return {
        sections: [...state.sections, duplicated],
        activeSectionId: newSectionId
      };
    }),
    createSectionTemplate: (sectionId, templateName) => {
      const section = get().sections.find((s) => s.id === sectionId);
      if (!section) return;
      
      try {
        const templates = JSON.parse(localStorage.getItem('api-test-templates') || '{}');
        templates[templateName] = section;
        localStorage.setItem('api-test-templates', JSON.stringify(templates));
      } catch (error) {
        console.error('Failed to save template:', error);
      }
    },
    loadSectionFromTemplate: (templateName) => set((state) => {
      try {
        const templates = JSON.parse(localStorage.getItem('api-test-templates') || '{}');
        const template = templates[templateName];
        if (!template) return state;
        
        const newSectionId = nanoid();
        const newSection: Section = {
          ...template,
          id: newSectionId,
          name: template.name,
          endpoints: template.endpoints.map((ep: any) => ({
            ...ep,
            id: nanoid(),
            scenarios: ep.scenarios.map((sc: any) => ({ ...sc, id: nanoid() }))
          }))
        };
        
        return {
          sections: [...state.sections, newSection],
          activeSectionId: newSectionId
        };
      } catch (error) {
        console.error('Failed to load template:', error);
        return state;
      }
    })
  };
};

