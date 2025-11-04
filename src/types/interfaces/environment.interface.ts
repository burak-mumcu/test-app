export interface Environment {
  id: string;
  name: string;
  variables: Record<string, string>;
  isActive?: boolean;
}

export interface EnvironmentVariable {
  key: string;
  value: string;
  enabled?: boolean;
}

