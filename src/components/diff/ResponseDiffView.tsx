import { useState } from 'react';
import { diffJSON } from '../../utils/diff.util';

export function ResponseDiffView() {
  const [response1, setResponse1] = useState('');
  const [response2, setResponse2] = useState('');
  const [diffResult, setDiffResult] = useState<any>(null);

  const handleDiff = () => {
    if (!response1.trim() || !response2.trim()) return;
    const result = diffJSON(response1, response2);
    setDiffResult(result);
  };

  return (
    <div className="panel">
      <div className="space-between" style={{ marginBottom: '12px' }}>
        <h3>Response Diff Tool</h3>
        <button className="primary" onClick={handleDiff} disabled={!response1.trim() || !response2.trim()}>
          Compare
        </button>
      </div>

      <div className="col" style={{ gap: '12px' }}>
        <div className="row" style={{ gap: '12px' }}>
          <div style={{ flex: 1 }}>
            <label className="small" style={{ display: 'block', marginBottom: '4px' }}>Response 1:</label>
            <textarea
              className="code"
              style={{ width: '100%', minHeight: '200px', fontFamily: 'monospace', fontSize: '12px' }}
              value={response1}
              onChange={(e) => setResponse1(e.target.value)}
              placeholder="Paste first response (JSON)"
            />
          </div>
          <div style={{ flex: 1 }}>
            <label className="small" style={{ display: 'block', marginBottom: '4px' }}>Response 2:</label>
            <textarea
              className="code"
              style={{ width: '100%', minHeight: '200px', fontFamily: 'monospace', fontSize: '12px' }}
              value={response2}
              onChange={(e) => setResponse2(e.target.value)}
              placeholder="Paste second response (JSON)"
            />
          </div>
        </div>

        {diffResult && (
          <div>
            <div className="small" style={{ fontWeight: 'bold', marginBottom: '8px' }}>Diff Result:</div>
            <div className="col" style={{ gap: '8px' }}>
              {diffResult.added.length > 0 && (
                <div>
                  <div className="small" style={{ color: 'var(--green)', marginBottom: '4px' }}>
                    Added ({diffResult.added.length}):
                  </div>
                  <div className="code" style={{ padding: '8px', fontSize: '11px' }}>
                    {diffResult.added.map((path: string, idx: number) => (
                      <div key={idx}>+ {path}</div>
                    ))}
                  </div>
                </div>
              )}
              {diffResult.removed.length > 0 && (
                <div>
                  <div className="small" style={{ color: 'var(--red)', marginBottom: '4px' }}>
                    Removed ({diffResult.removed.length}):
                  </div>
                  <div className="code" style={{ padding: '8px', fontSize: '11px' }}>
                    {diffResult.removed.map((path: string, idx: number) => (
                      <div key={idx}>- {path}</div>
                    ))}
                  </div>
                </div>
              )}
              {diffResult.modified.length > 0 && (
                <div>
                  <div className="small" style={{ color: 'var(--amber)', marginBottom: '4px' }}>
                    Modified ({diffResult.modified.length}):
                  </div>
                  <div className="code" style={{ padding: '8px', fontSize: '11px' }}>
                    {diffResult.modified.map((path: string, idx: number) => (
                      <div key={idx}>~ {path}</div>
                    ))}
                  </div>
                </div>
              )}
              {diffResult.unchanged.length > 0 && (
                <div>
                  <div className="small muted" style={{ marginBottom: '4px' }}>
                    Unchanged ({diffResult.unchanged.length}):
                  </div>
                  <div className="code" style={{ padding: '8px', fontSize: '11px', opacity: 0.6 }}>
                    {diffResult.unchanged.slice(0, 10).map((path: string, idx: number) => (
                      <div key={idx}>= {path}</div>
                    ))}
                    {diffResult.unchanged.length > 10 && (
                      <div>... and {diffResult.unchanged.length - 10} more</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

