import { useState, useEffect, useRef } from 'react';
import { websocketService } from '../../services/websocket.service';
import type { WebSocketMessage } from '../../services/websocket.service';

interface Props {
  endpoint: string;
}

export function WebSocketView({ endpoint }: Props) {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    return () => {
      if (wsRef.current) {
        websocketService.disconnect(wsRef.current);
      }
    };
  }, []);

  const handleConnect = async () => {
    try {
      setError(null);
      const ws = await websocketService.connect(
        endpoint,
        (message) => {
          setMessages(prev => [...prev, message]);
        },
        (err) => {
          setError(err);
          setConnected(false);
        }
      );
      wsRef.current = ws;
      setConnected(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection failed');
      setConnected(false);
    }
  };

  const handleDisconnect = () => {
    if (wsRef.current) {
      websocketService.disconnect(wsRef.current);
      wsRef.current = null;
      setConnected(false);
    }
  };

  const handleSend = () => {
    if (wsRef.current && messageInput.trim()) {
      try {
        // Try to parse as JSON, if fails send as string
        let messageToSend = messageInput;
        try {
          JSON.parse(messageInput);
          messageToSend = messageInput;
        } catch {
          messageToSend = JSON.stringify({ message: messageInput });
        }
        
        websocketService.send(wsRef.current, messageToSend);
        setMessageInput('');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to send message');
      }
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <div className="panel">
      <div className="space-between" style={{ marginBottom: '12px' }}>
        <h3>WebSocket Connection</h3>
        <div className="row" style={{ gap: '8px' }}>
          {!connected ? (
            <button className="success" onClick={handleConnect}>
              Connect
            </button>
          ) : (
            <button className="warning" onClick={handleDisconnect}>
              Disconnect
            </button>
          )}
          {messages.length > 0 && (
            <button className="ghost" onClick={clearMessages}>
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="col" style={{ gap: '12px' }}>
        <div className="row" style={{ gap: '8px', alignItems: 'center' }}>
          <span className={`tag ${connected ? 'pass' : 'pending'}`}>
            {connected ? 'Connected' : 'Disconnected'}
          </span>
          <input
            className="w-100"
            value={endpoint}
            readOnly
            style={{ background: '#131b2e' }}
          />
        </div>

        {error && (
          <div className="small" style={{ color: 'var(--red)' }}>
            Error: {error}
          </div>
        )}

        {connected && (
          <div className="row" style={{ gap: '8px' }}>
            <input
              className="w-100"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSend();
                }
              }}
              placeholder="Message (JSON or text)"
            />
            <button className="primary" onClick={handleSend} disabled={!messageInput.trim()}>
              Send
            </button>
          </div>
        )}

        <div style={{ maxHeight: '400px', overflow: 'auto' }}>
          <div className="small muted" style={{ marginBottom: '8px' }}>
            Messages ({messages.length}):
          </div>
          {messages.length === 0 ? (
            <div className="muted small">No messages yet</div>
          ) : (
            <div className="col" style={{ gap: '4px' }}>
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className="code"
                  style={{
                    padding: '8px',
                    background: msg.type === 'close' ? 'rgba(239,68,68,0.15)' : '#0b1220',
                    fontSize: '11px'
                  }}
                >
                  <div className="small muted">
                    [{new Date(msg.timestamp).toLocaleTimeString()}] {msg.type}
                  </div>
                  <pre style={{ margin: '4px 0 0 0', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                    {typeof msg.data === 'object' ? JSON.stringify(msg.data, null, 2) : String(msg.data)}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

