import { useState } from 'react';
import type { RunnerConfig, RunMode } from '../../types/interfaces/runner-config.interface';

interface Props {
  config: RunnerConfig;
  onUpdate: (config: RunnerConfig) => void;
}

export function RunnerConfigView({ config, onUpdate }: Props) {
  const [expanded, setExpanded] = useState(false);

  if (!expanded) {
    return (
      <button className="ghost small" onClick={() => setExpanded(true)} style={{ fontSize: '11px' }}>
        ⚡ Runner: {config.mode}
      </button>
    );
  }

  return (
    <div className="panel" style={{ padding: '12px', marginBottom: '12px', background: '#0b1220' }}>
      <div className="space-between" style={{ marginBottom: '8px' }}>
        <span className="small" style={{ fontWeight: 'bold' }}>Runner Configuration</span>
        <button className="ghost small" onClick={() => setExpanded(false)}>✕</button>
      </div>
      <div className="col" style={{ gap: '8px' }}>
        <div className="row" style={{ gap: '8px', alignItems: 'center' }}>
          <label className="small" style={{ minWidth: '120px' }}>Mode:</label>
          <select
            className="w-160"
            value={config.mode}
            onChange={(e) => onUpdate({ ...config, mode: e.target.value as RunMode })}
          >
            <option value="sequential">Sequential (Sıralı)</option>
            <option value="parallel">Parallel (Paralel)</option>
            <option value="conditional">Conditional (Koşullu)</option>
          </select>
        </div>

        {config.mode === 'parallel' && (
          <div className="row" style={{ gap: '8px', alignItems: 'center' }}>
            <label className="small" style={{ minWidth: '120px' }}>Max Concurrency:</label>
            <input
              type="number"
              className="w-80"
              value={config.maxConcurrency || 5}
              onChange={(e) => onUpdate({ ...config, maxConcurrency: Number(e.target.value) })}
              min="1"
              max="20"
            />
          </div>
        )}

        <div className="row" style={{ gap: '8px', alignItems: 'center' }}>
          <label className="small" style={{ minWidth: '120px' }}>Stop on Failure:</label>
          <input
            type="checkbox"
            checked={config.stopOnFailure ?? false}
            onChange={(e) => onUpdate({ ...config, stopOnFailure: e.target.checked })}
          />
        </div>

        <div className="row" style={{ gap: '8px', alignItems: 'center' }}>
          <label className="small" style={{ minWidth: '120px' }}>Delay (ms):</label>
          <input
            type="number"
            className="w-80"
            value={config.delayBetweenRequests || 0}
            onChange={(e) => onUpdate({ ...config, delayBetweenRequests: Number(e.target.value) })}
            min="0"
          />
        </div>
      </div>
    </div>
  );
}

