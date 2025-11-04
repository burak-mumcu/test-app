import { useState } from 'react';

interface Props {
  endpoint: string;
}

export function GRPCView({ endpoint }: Props) {
  const [service, setService] = useState('');
  const [method, setMethod] = useState('');
  const [request, setRequest] = useState('{}');
  const [metadata, setMetadata] = useState('{}');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCall = () => {
    setError('⚠️ gRPC desteği browser ortamında sınırlıdır. gRPC-Web veya bir proxy server gerektirir.\n\n' +
      'Alternatifler:\n' +
      '1. gRPC-Web kullanarak client oluşturun\n' +
      '2. Envoy Proxy gibi bir proxy kullanın\n' +
      '3. Backend\'de gRPC-to-REST bridge oluşturun\n\n' +
      'Bu özellik için Electron veya Node.js backend entegrasyonu gereklidir.');
    setResult(null);
  };

  return (
    <div className="panel">
      <div className="space-between" style={{ marginBottom: '12px' }}>
        <h3>gRPC Call</h3>
        <button className="success" onClick={handleCall} disabled={!service || !method}>
          Call Method
        </button>
      </div>

      <div className="col" style={{ gap: '12px' }}>
        <div className="small muted" style={{ padding: '8px', background: 'rgba(239,68,68,0.1)', borderRadius: '4px' }}>
          ⚠️ <strong>Not:</strong> gRPC desteği browser ortamında sınırlıdır. Tam özellikli gRPC desteği için Electron veya Node.js backend gereklidir.
        </div>

        <div>
          <label className="small" style={{ display: 'block', marginBottom: '4px' }}>Service Name:</label>
          <input
            className="w-100"
            value={service}
            onChange={(e) => setService(e.target.value)}
            placeholder="example.UserService"
          />
        </div>

        <div>
          <label className="small" style={{ display: 'block', marginBottom: '4px' }}>Method Name:</label>
          <input
            className="w-100"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            placeholder="GetUser"
          />
        </div>

        <div>
          <label className="small" style={{ display: 'block', marginBottom: '4px' }}>Request (JSON):</label>
          <textarea
            className="code"
            style={{ width: '100%', minHeight: '150px', fontFamily: 'monospace', fontSize: '12px' }}
            value={request}
            onChange={(e) => setRequest(e.target.value)}
            placeholder='{"id": "123"}'
          />
        </div>

        <div>
          <label className="small" style={{ display: 'block', marginBottom: '4px' }}>Metadata (JSON):</label>
          <textarea
            className="code"
            style={{ width: '100%', minHeight: '100px', fontFamily: 'monospace', fontSize: '12px' }}
            value={metadata}
            onChange={(e) => setMetadata(e.target.value)}
            placeholder='{"authorization": "Bearer token"}'
          />
        </div>

        <div>
          <label className="small" style={{ display: 'block', marginBottom: '4px' }}>Endpoint:</label>
          <input
            className="w-100"
            value={endpoint}
            readOnly
            style={{ background: '#131b2e' }}
          />
        </div>

        {error && (
          <div className="code" style={{ padding: '12px', background: 'rgba(239,68,68,0.1)', whiteSpace: 'pre-wrap', fontSize: '12px' }}>
            {error}
          </div>
        )}

        {result && (
          <div>
            <div className="small" style={{ fontWeight: 'bold', marginBottom: '8px' }}>Response:</div>
            <div className="code" style={{ padding: '12px', maxHeight: '400px', overflow: 'auto' }}>
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          </div>
        )}

        <div className="small muted" style={{ marginTop: '12px' }}>
          <strong>Kullanım:</strong> gRPC testleri için .proto dosyası yükleyip, service ve method seçerek request gönderebilirsiniz.
          Browser sınırlamaları nedeniyle bu özellik şu anda sadece UI olarak mevcuttur.
        </div>
      </div>
    </div>
  );
}

