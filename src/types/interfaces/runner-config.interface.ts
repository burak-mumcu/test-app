export type RunMode = 'sequential' | 'parallel' | 'conditional';

export interface RunnerConfig {
  mode: RunMode;
  stopOnFailure?: boolean;
  maxConcurrency?: number; // For parallel mode
  delayBetweenRequests?: number; // For sequential mode
}

