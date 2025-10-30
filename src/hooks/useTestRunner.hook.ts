import { useCallback } from 'react';
import { testService } from '../services/test.service';
import { useTestResults } from './useTestResults.hook';
import type { Endpoint } from '../types';

export function useTestRunner(sectionId: string, endpointId: string) {
  const { setScenarioResult, resetResults } = useTestResults(sectionId, endpointId, '');

  const runEndpoint = useCallback(async (baseUrl: string, endpoint: Endpoint) => {
    resetResults();
    await testService.runEndpoint(baseUrl, endpoint, (result) => {
      setScenarioResult(result);
    });
  }, [setScenarioResult, resetResults]);

  return { runEndpoint };
}

