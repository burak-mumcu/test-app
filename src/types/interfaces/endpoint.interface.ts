import type { Scenario } from './scenario.interface';
import type { HttpMethod } from '../http-method.type';

export interface Endpoint {
  id: string;
  name: string;
  path: string;
  method: HttpMethod;
  scenarios: Scenario[];
}

