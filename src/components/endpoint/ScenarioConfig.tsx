import { useState } from 'react';
import type { TestConfig } from '../../types';

interface Props {
  config?: TestConfig;
  onUpdate: (config: TestConfig) => void;
}

export function ScenarioConfig({ config, onUpdate }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [localConfig, setLocalConfig] = useState<TestConfig>(config || {
    timeout: 30000,
    retryCount: 0,
    retryDelay: 1000,
    validateResponseBody: false,
    validateResponseHeaders: false
  });

  const handleUpdate = (updates: Partial<TestConfig>) => {
    const newConfig = { ...localConfig, ...updates };
    setLocalConfig(newConfig);
    onUpdate(newConfig);
  };

  if (!expanded) {
    return (
      <button className="ghost small" onClick={() => setExpanded(true)} style={{ fontSize: '11px' }}>
        ⚙️ Test Ayarları
      </button>
    );
  }

  return (
    <div className="panel" style={{ padding: '12px', marginTop: '8px', background: '#0b1220' }}>
      <div className="space-between" style={{ marginBottom: '8px' }}>
        <span className="small" style={{ fontWeight: 'bold' }}>Test Ayarları</span>
        <button className="ghost small" onClick={() => setExpanded(false)}>✕</button>
      </div>
      <div className="col" style={{ gap: '8px' }}>
        <div className="row" style={{ gap: '8px', alignItems: 'center' }}>
          <label className="small" style={{ minWidth: '120px' }}>Timeout (ms):</label>
          <input
            type="number"
            className="w-80"
            value={localConfig.timeout ?? 30000}
            onChange={(e) => handleUpdate({ timeout: Number(e.target.value) })}
          />
        </div>
        <div className="row" style={{ gap: '8px', alignItems: 'center' }}>
          <label className="small" style={{ minWidth: '120px' }}>Retry Sayısı:</label>
          <input
            type="number"
            className="w-80"
            value={localConfig.retryCount ?? 0}
            onChange={(e) => handleUpdate({ retryCount: Number(e.target.value) })}
          />
        </div>
        <div className="row" style={{ gap: '8px', alignItems: 'center' }}>
          <label className="small" style={{ minWidth: '120px' }}>Retry Gecikme (ms):</label>
          <input
            type="number"
            className="w-80"
            value={localConfig.retryDelay ?? 1000}
            onChange={(e) => handleUpdate({ retryDelay: Number(e.target.value) })}
          />
        </div>
        <div className="row" style={{ gap: '8px', alignItems: 'center' }}>
          <label className="small" style={{ minWidth: '120px' }}>Response Body Doğrula:</label>
          <input
            type="checkbox"
            checked={localConfig.validateResponseBody ?? false}
            onChange={(e) => handleUpdate({ validateResponseBody: e.target.checked })}
          />
        </div>
        {localConfig.validateResponseBody && (
          <div className="row" style={{ gap: '8px' }}>
            <label className="small" style={{ minWidth: '120px' }}>Beklenen Body:</label>
            <textarea
              className="w-100"
              rows={3}
              value={localConfig.expectedResponseBody ?? ''}
              onChange={(e) => handleUpdate({ expectedResponseBody: e.target.value })}
              placeholder="JSON response body"
            />
          </div>
        )}
        <div className="row" style={{ gap: '8px', alignItems: 'center' }}>
          <label className="small" style={{ minWidth: '120px' }}>Response Headers Doğrula:</label>
          <input
            type="checkbox"
            checked={localConfig.validateResponseHeaders ?? false}
            onChange={(e) => handleUpdate({ validateResponseHeaders: e.target.checked })}
          />
        </div>
        {localConfig.validateResponseHeaders && (
          <div className="row" style={{ gap: '8px' }}>
            <label className="small" style={{ minWidth: '120px' }}>Beklenen Headers:</label>
            <input
              className="w-100"
              placeholder="Content-Type: application/json, X-Auth: token"
              value={Object.entries(localConfig.expectedResponseHeaders ?? {}).map(([k, v]) => `${k}: ${v}`).join(', ')}
              onChange={(e) => {
                const headers: Record<string, string> = {};
                e.target.value.split(',').forEach((part) => {
                  const [k, ...v] = part.split(':');
                  if (k && v.length > 0) headers[k.trim()] = v.join(':').trim();
                });
                handleUpdate({ expectedResponseHeaders: headers });
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

