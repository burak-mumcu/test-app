import type { StateCreator } from 'zustand';
import { nanoid } from '../../utils/nanoid';
import type { Endpoint } from '../../types';
import type { AppStore, EndpointSlice } from '../interfaces/store.interface';

export const createEndpointSlice: StateCreator<AppStore, [], [], EndpointSlice> = (set) => ({
  addEndpoint: (sectionId, endpoint = {}) => set((state) => ({
    sections: state.sections.map((s) => {
      if (s.id !== sectionId) return s;
      const ep: Endpoint = {
        id: nanoid(),
        name: endpoint.name ?? 'Yeni Endpoint',
        path: endpoint.path ?? '/path',
        method: endpoint.method ?? 'GET',
        scenarios: endpoint.scenarios ?? []
      };
      return { ...s, endpoints: [...s.endpoints, ep] };
    })
  })),
  removeEndpoint: (sectionId, endpointId) => set((state) => ({
    sections: state.sections.map((s) =>
      s.id === sectionId ? { ...s, endpoints: s.endpoints.filter((e) => e.id !== endpointId) } : s
    )
  })),
  updateEndpoint: (sectionId, endpointId, patch) => set((state) => ({
    sections: state.sections.map((s) =>
      s.id === sectionId
        ? { ...s, endpoints: s.endpoints.map((e) => (e.id === endpointId ? { ...e, ...patch } : e)) }
        : s
    )
  })),
  duplicateEndpoint: (sectionId, endpointId) => set((state) => ({
    sections: state.sections.map((s) => {
      if (s.id !== sectionId) return s;
      const endpoint = s.endpoints.find((e) => e.id === endpointId);
      if (!endpoint) return s;
      
      const duplicated: Endpoint = {
        ...endpoint,
        id: nanoid(),
        name: `${endpoint.name} (Kopya)`,
        scenarios: endpoint.scenarios.map((sc) => ({ ...sc, id: nanoid() }))
      };
      
      return { ...s, endpoints: [...s.endpoints, duplicated] };
    })
  })),
  bulkRemoveEndpoints: (sectionId, endpointIds) => set((state) => ({
    sections: state.sections.map((s) =>
      s.id === sectionId
        ? { ...s, endpoints: s.endpoints.filter((e) => !endpointIds.includes(e.id)) }
        : s
    )
  }))
});

