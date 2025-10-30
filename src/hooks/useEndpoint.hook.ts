import { useSection } from './useSection.hook';
import { useAppStore } from '../store';
import type { Endpoint } from '../types';

export function useEndpoint(sectionId: string, endpointId: string) {
  const { section } = useSection(sectionId);
  const endpoint = section.endpoints.find((e) => e.id === endpointId);
  const updateEndpoint = useAppStore((s) => s.updateEndpoint);
  const removeEndpoint = useAppStore((s) => s.removeEndpoint);

  if (!endpoint) {
    throw new Error(`Endpoint with id ${endpointId} not found`);
  }

  return {
    endpoint,
    updateEndpoint: (patch: Partial<Endpoint>) => updateEndpoint(sectionId, endpointId, patch),
    removeEndpoint: () => removeEndpoint(sectionId, endpointId)
  };
}

