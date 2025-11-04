import { useState } from 'react';
import { graphqlService } from '../../services/graphql.service';
import { useAppStore } from '../../store';
import type { GraphQLRequest } from '../../types/interfaces/graphql-request.interface';

interface Props {
  endpoint: string;
  onResult?: (result: any) => void;
}

export function GraphQLView({ endpoint, onResult }: Props) {
  const [query, setQuery] = useState('');
  const [variables, setVariables] = useState('{}');
  const [operationName, setOperationName] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleRun = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      let parsedVariables = {};
      try {
        parsedVariables = JSON.parse(variables || '{}');
      } catch {
        // Invalid JSON, use empty object
      }

      const request: GraphQLRequest = {
        query,
        variables: parsedVariables,
        operationName: operationName || undefined
      };

      const variablesFromStore = useAppStore.getState().getActiveEnvironmentVariables();
      const testResult = await graphqlService.runQuery(endpoint, request, variablesFromStore);
      
      const resultData = {
        ...testResult,
        responseData: testResult.responseBody ? JSON.parse(testResult.responseBody) : null
      };
      
      setResult(resultData);
      if (onResult) {
        onResult(resultData);
      }
    } catch (error) {
      setResult({
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel">
      <div className="space-between" style={{ marginBottom: '12px' }}>
        <h3>GraphQL Query</h3>
        <button className="success" onClick={handleRun} disabled={loading || !query.trim()}>
          {loading ? 'Çalıştırılıyor...' : 'Run Query'}
        </button>
      </div>

      <div className="col" style={{ gap: '12px' }}>
        <div>
          <label className="small" style={{ display: 'block', marginBottom: '4px' }}>Operation Name (optional):</label>
          <input
            className="w-100"
            value={operationName}
            onChange={(e) => setOperationName(e.target.value)}
            placeholder="getUser"
          />
        </div>

        <div>
          <label className="small" style={{ display: 'block', marginBottom: '4px' }}>Query:</label>
          <textarea
            className="code"
            style={{ width: '100%', minHeight: '200px', fontFamily: 'monospace', fontSize: '12px' }}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`query GetUser($id: ID!) {
  user(id: $id) {
    id
    name
    email
  }
}`}
          />
        </div>

        <div>
          <label className="small" style={{ display: 'block', marginBottom: '4px' }}>Variables (JSON):</label>
          <textarea
            className="code"
            style={{ width: '100%', minHeight: '100px', fontFamily: 'monospace', fontSize: '12px' }}
            value={variables}
            onChange={(e) => setVariables(e.target.value)}
            placeholder='{"id": "123"}'
          />
        </div>

        {result && (
          <div>
            <div className="small" style={{ fontWeight: 'bold', marginBottom: '8px' }}>
              Result: {result.status === 'pass' ? '✅ Success' : '❌ Failed'}
            </div>
            <div className="code" style={{ padding: '12px', maxHeight: '400px', overflow: 'auto' }}>
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                {result.responseData ? JSON.stringify(result.responseData, null, 2) : result.responseBody || result.error}
              </pre>
            </div>
            {result.responseTime !== undefined && (
              <div className="small muted" style={{ marginTop: '8px' }}>
                Response Time: {result.responseTime}ms
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

