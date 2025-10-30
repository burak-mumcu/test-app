import { useEndpoint, useSection } from '../../hooks';
import { useAppStore } from '../../store';
import type { Scenario } from '../../types';
import { testService } from '../../services/test.service';
import { ScenarioRow } from './ScenarioRow';

interface Props { sectionId: string; endpointId: string }

const methods = ['GET','POST','PUT','PATCH','DELETE','HEAD','OPTIONS'] as const;

export function EndpointView({ sectionId, endpointId }: Props) {
  const { section } = useSection(sectionId);
  const { endpoint, updateEndpoint, removeEndpoint } = useEndpoint(sectionId, endpointId);
  const addScenario = useAppStore((s) => s.addScenario);
  const setScenarioResult = useAppStore((s) => s.setScenarioResult);
  const resetResultsForSection = useAppStore((s) => s.resetResultsForSection);

  const run = async () => {
    resetResultsForSection(sectionId);
    await testService.runEndpoint(section.baseUrl, endpoint, (result) => {
      setScenarioResult(sectionId, endpoint.id, result);
    });
  };

  return (
    <div className="panel">
      <div className="space-between">
        <div className="row" style={{ gap: 8 }}>
          <select className="w-120" value={endpoint.method} onChange={(e) => updateEndpoint({ method: e.target.value as any })}>
            {methods.map((m) => (<option key={m} value={m}>{m}</option>))}
          </select>
          <input className="w-160" value={endpoint.name} onChange={(e) => updateEndpoint({ name: e.target.value })} />
          <input className="w-100" value={endpoint.path} onChange={(e) => updateEndpoint({ path: e.target.value })} />
        </div>
        <div className="row" style={{ gap: 8 }}>
          <button className="success" onClick={run}>Run</button>
          <button className="ghost" onClick={() => addScenario(sectionId, endpointId)}>Senaryo Ekle</button>
          <button className="ghost" onClick={() => useAppStore.getState().duplicateEndpoint(sectionId, endpointId)}>Kopyala</button>
          <button className="ghost" onClick={() => removeEndpoint()}>Sil</button>
        </div>
      </div>
      <div className="divider" />
      <div className="col" style={{ gap: 8 }}>
        {endpoint.scenarios.map((sc: Scenario) => (
          <ScenarioRow key={sc.id} sectionId={sectionId} endpointId={endpointId} scenarioId={sc.id} />
        ))}
      </div>
    </div>
  );
}

