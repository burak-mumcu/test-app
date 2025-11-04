import { useState } from 'react';
import type { Scenario } from '../../types';

interface Props {
  scenario: Scenario;
  onUpdate: (updates: Partial<Scenario>) => void;
}

export function ScenarioScripts({ scenario, onUpdate }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'pre' | 'test'>('pre');

  if (!expanded) {
    return (
      <button className="ghost small" onClick={() => setExpanded(true)} style={{ fontSize: '11px', marginTop: '4px' }}>
        📝 Scripts
      </button>
    );
  }

  return (
    <div className="panel" style={{ padding: '12px', marginTop: '8px', background: '#0b1220' }}>
      <div className="space-between" style={{ marginBottom: '8px' }}>
        <span className="small" style={{ fontWeight: 'bold' }}>Scripts</span>
        <button className="ghost small" onClick={() => setExpanded(false)}>✕</button>
      </div>

      <div className="row" style={{ gap: '4px', marginBottom: '8px' }}>
        <button
          className={activeTab === 'pre' ? 'primary' : 'ghost'}
          onClick={() => setActiveTab('pre')}
          style={{ fontSize: '12px', padding: '6px 12px' }}
        >
          Pre-request
        </button>
        <button
          className={activeTab === 'test' ? 'primary' : 'ghost'}
          onClick={() => setActiveTab('test')}
          style={{ fontSize: '12px', padding: '6px 12px' }}
        >
          Test
        </button>
      </div>

      {activeTab === 'pre' && (
        <div className="col" style={{ gap: '8px' }}>
          <div className="small muted">Pre-request script çalıştırılmadan önce çalışır. Variables değiştirebilirsiniz.</div>
          <textarea
            className="code"
            style={{ width: '100%', minHeight: '150px', fontFamily: 'monospace', fontSize: '12px' }}
            value={scenario.preRequestScript || ''}
            onChange={(e) => onUpdate({ preRequestScript: e.target.value })}
            placeholder={`// Örnek: Token üretme
variables.token = 'Bearer ' + Date.now();
variables.timestamp = Date.now().toString();`}
          />
        </div>
      )}

      {activeTab === 'test' && (
        <div className="col" style={{ gap: '8px' }}>
          <div className="small muted">Test script response'dan sonra çalışır. Assertion'lar için pm.expect kullanın.</div>
          <textarea
            className="code"
            style={{ width: '100%', minHeight: '150px', fontFamily: 'monospace', fontSize: '12px' }}
            value={scenario.testScript || ''}
            onChange={(e) => onUpdate({ testScript: e.target.value })}
            placeholder={`// Örnek: Assertion'lar
pm.expect(pm.response.status).to.equal(200);
pm.expect(pm.response.responseTime).to.beLessThan(1000);

// JSON response parse etme
const jsonData = JSON.parse(pm.response.body);
pm.expect(jsonData).toHaveProperty('success');`}
          />
        </div>
      )}
    </div>
  );
}

