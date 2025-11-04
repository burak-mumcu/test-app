import { StateCreator } from 'zustand';
import { nanoid } from '../../utils/nanoid';
import type { Environment } from '../../types/interfaces/environment.interface';
import type { AppStore, EnvironmentSlice } from '../interfaces/store.interface';

export const createEnvironmentSlice: StateCreator<AppStore, [], [], EnvironmentSlice> = (set, get) => {
  const defaultEnvId = nanoid();
  const defaultEnv: Environment = {
    id: defaultEnvId,
    name: 'Default',
    variables: {},
    isActive: true
  };

  return {
    environments: [defaultEnv],
    activeEnvironmentId: defaultEnvId,

    addEnvironment: (name = 'Yeni Environment') => set((state) => {
      const newEnv: Environment = {
        id: nanoid(),
        name,
        variables: {},
        isActive: false
      };
      return {
        environments: [...state.environments, newEnv]
      };
    }),

    removeEnvironment: (environmentId) => set((state) => {
      if (state.environments.length <= 1) {
        // Don't allow removing the last environment
        return state;
      }
      const newEnvironments = state.environments.filter(e => e.id !== environmentId);
      const newActiveId = environmentId === state.activeEnvironmentId
        ? (newEnvironments[0]?.id || null)
        : state.activeEnvironmentId;
      return {
        environments: newEnvironments,
        activeEnvironmentId: newActiveId
      };
    }),

    updateEnvironment: (environmentId, patch) => set((state) => ({
      environments: state.environments.map(env =>
        env.id === environmentId ? { ...env, ...patch } : env
      )
    })),

    setActiveEnvironment: (environmentId) => set((state) => ({
      environments: state.environments.map(env => ({
        ...env,
        isActive: env.id === environmentId
      })),
      activeEnvironmentId: environmentId
    })),

    setEnvironmentVariable: (environmentId, key, value) => set((state) => ({
      environments: state.environments.map(env =>
        env.id === environmentId
          ? { ...env, variables: { ...env.variables, [key]: value } }
          : env
      )
    })),

    removeEnvironmentVariable: (environmentId, key) => set((state) => {
      const env = state.environments.find(e => e.id === environmentId);
      if (!env) return state;

      const { [key]: removed, ...rest } = env.variables;
      return {
        environments: state.environments.map(e =>
          e.id === environmentId ? { ...e, variables: rest } : e
        )
      };
    }),

    getActiveEnvironmentVariables: () => {
      const state = get();
      const activeEnv = state.environments.find(e => e.id === state.activeEnvironmentId);
      return activeEnv?.variables || {};
    }
  };
};

