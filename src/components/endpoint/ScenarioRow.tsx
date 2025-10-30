import { useScenario, useTestResults } from '../../hooks';
import { parseHeaders, formatHeaders } from '../../utils/header-parser.util';
import { ScenarioConfig } from './ScenarioConfig';
import { useAppStore } from '../../store';

interface Props { sectionId: string; endpointId: string; scenarioId: string }

export function ScenarioRow({ sectionId, endpointId, scenarioId }: Props) {
  const { scenario, updateScenario, removeScenario } = useScenario(sectionId, endpointId, scenarioId);
  const { result } = useTestResults(sectionId, endpointId, scenarioId);
  const duplicateScenario = useAppStore((s) => s.duplicateScenario);

  const statusClass = result?.status === 'pass' ? 'pass' : result?.status === 'fail' ? 'fail' : 'pending';
  const statusText = result?.status ? result.status.toUpperCase() : 'PENDING';

  return (
    <div className="col" style={{ gap: '4px' }}>
      <div className="scenario">
        <span className={`tag ${statusClass}`}>{statusText}</span>
        <input className="w-160" value={scenario.name} onChange={(e) => updateScenario({ name: e.target.value })} />
        <input className="w-80" type="number" value={scenario.expectedStatus} onChange={(e) => updateScenario({ expectedStatus: Number(e.target.value) })} />
        <input className="w-100" placeholder="Header: value, x-auth: 123" value={formatHeaders(scenario.headers)} onChange={(e) => updateScenario({ headers: parseHeaders(e.target.value) })} />
        <input className="w-100" placeholder="JSON body" value={scenario.requestBody ?? ''} onChange={(e) => updateScenario({ requestBody: e.target.value })} />
        {result?.responseTime !== undefined && (
          <span className="small muted nowrap">{result.responseTime}ms</span>
        )}
        {result?.actualStatus !== undefined && (
          <span className="small muted nowrap">status: {result.actualStatus}</span>
        )}
        {result?.errorMessage && (<span className="small" style={{ color: 'var(--red)' }}>{result.errorMessage}</span>)}
        <button className="ghost" onClick={() => duplicateScenario(sectionId, endpointId, scenarioId)} title="Kopyala">📋</button>
        <button className="ghost" onClick={() => removeScenario()} title="Senaryoyu Sil">Sil</button>
      </div>
      <ScenarioConfig
        config={scenario.testConfig}
        onUpdate={(config) => updateScenario({ testConfig: config })}
      />
    </div>
  );
}


