import type { Endpoint } from './endpoint.interface';

export interface Section {
  id: string;
  name: string;
  baseUrl: string;
  endpoints: Endpoint[];
}

