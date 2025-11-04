import { useState } from 'react';
import { useAppStore } from '../../store';

export function EnvironmentView() {
  const {
    environments,
    activeEnvironmentId,
    addEnvironment,
    removeEnvironment,
    updateEnvironment,
    setActiveEnvironment,
    setEnvironmentVariable,
    removeEnvironmentVariable
  } = useAppStore();

  const activeEnv = environments.find(e => e.id === activeEnvironmentId);
  const [newVarKey, setNewVarKey] = useState('');
  const [newVarValue, setNewVarValue] = useState('');

  const handleAddVariable = () => {
    if (!activeEnv || !newVarKey.trim()) return;
    setEnvironmentVariable(activeEnv.id, newVarKey.trim(), newVarValue.trim());
    setNewVarKey('');
    setNewVarValue('');
  };

  const handleRemoveVariable = (key: string) => {
    if (!activeEnv) return;
    removeEnvironmentVariable(activeEnv.id, key);
  };

  return (
    <div className="panel">
      <div className="space-between" style={{ marginBottom: '16px' }}>
        <h3>Environment Variables</h3>
        <button className="primary" onClick={() => addEnvironment()}>Yeni Environment</button>
      </div>

      {/* Environment Selector */}
      <div className="row" style={{ gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {environments.map((env) => (
          <button
            key={env.id}
            className={activeEnvironmentId === env.id ? 'primary' : 'ghost'}
            onClick={() => setActiveEnvironment(env.id)}
            style={{ minWidth: '120px' }}
          >
            {env.name}
          </button>
        ))}
      </div>

      {activeEnv && (
        <>
          <div className="row" style={{ gap: '8px', marginBottom: '12px' }}>
            <input
              className="w-100"
              value={activeEnv.name}
              onChange={(e) => updateEnvironment(activeEnv.id, { name: e.target.value })}
              placeholder="Environment adı"
            />
            {environments.length > 1 && (
              <button
                className="ghost"
                onClick={() => removeEnvironment(activeEnv.id)}
                style={{ color: 'var(--red)' }}
              >
                Sil
              </button>
            )}
          </div>

          <div className="divider" />

          {/* Variables List */}
          <div className="col" style={{ gap: '8px', marginBottom: '16px' }}>
            {Object.entries(activeEnv.variables).map(([key, value]) => (
              <div key={key} className="row" style={{ gap: '8px', alignItems: 'center' }}>
                <input
                  className="w-160"
                  value={key}
                  readOnly
                  style={{ background: '#131b2e', cursor: 'not-allowed' }}
                />
                <input
                  className="w-100"
                  value={value}
                  onChange={(e) => setEnvironmentVariable(activeEnv.id, key, e.target.value)}
                  placeholder="Değer"
                />
                <button
                  className="ghost"
                  onClick={() => handleRemoveVariable(key)}
                  style={{ color: 'var(--red)' }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {/* Add Variable */}
          <div className="row" style={{ gap: '8px' }}>
            <input
              className="w-160"
              value={newVarKey}
              onChange={(e) => setNewVarKey(e.target.value)}
              placeholder="Değişken adı"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddVariable();
                }
              }}
            />
            <input
              className="w-100"
              value={newVarValue}
              onChange={(e) => setNewVarValue(e.target.value)}
              placeholder="Değer"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddVariable();
                }
              }}
            />
            <button className="primary" onClick={handleAddVariable}>Ekle</button>
          </div>

          <div className="muted small" style={{ marginTop: '12px' }}>
            Kullanım: URL'lerde, header'larda ve body'de <code>{'{{variableName}}'}</code> şeklinde kullanabilirsiniz.
          </div>
        </>
      )}
    </div>
  );
}

