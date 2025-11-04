import { useState } from 'react';
import { useSection } from '../hooks';
import { useAppStore } from '../store';
import { testService } from '../services/test.service';
import { ReportView } from './report/ReportView';
import { EndpointView } from './endpoint/EndpointView';
import { RunnerConfigView } from './runner/RunnerConfigView';
import type { RunnerConfig } from '../types/interfaces/runner-config.interface';

interface Props { sectionId: string }

export function SectionView({ sectionId }: Props) {
  const { section, updateSection } = useSection(sectionId);
  const addEndpoint = useAppStore((s) => s.addEndpoint);
  const setScenarioResult = useAppStore((s) => s.setScenarioResult);
  const resetResultsForSection = useAppStore((s) => s.resetResultsForSection);
  const duplicateSection = useAppStore((s) => s.duplicateSection);
  const [showReport, setShowReport] = useState(false);
  const [runnerConfig, setRunnerConfig] = useState<RunnerConfig>({ mode: 'sequential' });

  const handleRunAll = async () => {
    resetResultsForSection(section.id);
    const variables = useAppStore.getState().getActiveEnvironmentVariables();
    await testService.runSection(section.baseUrl, section.endpoints, (result, endpointId) => {
      setScenarioResult(section.id, endpointId, result);
    }, variables, runnerConfig);
  };


  return (
    <div className="col">
      <div className="space-between">
        <div className="row" style={{ gap: 8 }}>
          <input className="w-160" value={section.name} onChange={(e) => updateSection({ name: e.target.value })} />
          <input className="w-100" value={section.baseUrl} onChange={(e) => updateSection({ baseUrl: e.target.value })} />
        </div>
        <div className="row" style={{ gap: 8 }}>
          <button className="success" onClick={handleRunAll}>▶ Run All</button>
          <button className="ghost" onClick={() => addEndpoint(section.id)}>+ Endpoint</button>
          <button className="ghost" onClick={() => duplicateSection(section.id)}>📋 Kopyala</button>
          <button className="ghost" onClick={() => setShowReport(!showReport)}>
            {showReport ? '📊 Raporu Gizle' : '📊 Raporu Göster'}
          </button>
        </div>
      </div>
      <div className="divider" />
      
      <RunnerConfigView config={runnerConfig} onUpdate={setRunnerConfig} />
      
      {showReport && (
        <>
          <ReportView sectionId={sectionId} onClose={() => setShowReport(false)} />
          <div className="divider" />
        </>
      )}
      
      <div className="list">
        {section.endpoints.map((ep) => (
          <EndpointView key={ep.id} sectionId={section.id} endpointId={ep.id} />
        ))}
      </div>
    </div>
  );
}
