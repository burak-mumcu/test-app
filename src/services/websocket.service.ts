import type { ScenarioResult } from '../types';

export interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: number;
}

export interface WebSocketService {
  connect(
    url: string,
    onMessage: (message: WebSocketMessage) => void,
    onError: (error: string) => void
  ): Promise<WebSocket>;
  send(ws: WebSocket, message: string): void;
  disconnect(ws: WebSocket): void;
}

class WebSocketServiceImpl implements WebSocketService {
  async connect(
    url: string,
    onMessage: (message: WebSocketMessage) => void,
    onError: (error: string) => void
  ): Promise<WebSocket> {
    return new Promise((resolve, reject) => {
      try {
        const ws = new WebSocket(url);

        ws.onopen = () => {
          resolve(ws);
        };

        ws.onmessage = (event) => {
          try {
            const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
            onMessage({
              type: 'message',
              data,
              timestamp: Date.now()
            });
          } catch {
            onMessage({
              type: 'message',
              data: event.data,
              timestamp: Date.now()
            });
          }
        };

        ws.onerror = (error) => {
          onError('WebSocket connection error');
          reject(error);
        };

        ws.onclose = () => {
          onMessage({
            type: 'close',
            data: 'Connection closed',
            timestamp: Date.now()
          });
        };
      } catch (error) {
        onError(error instanceof Error ? error.message : 'Failed to create WebSocket');
        reject(error);
      }
    });
  }

  send(ws: WebSocket, message: string): void {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(message);
    }
  }

  disconnect(ws: WebSocket): void {
    if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
      ws.close();
    }
  }
}

export const websocketService: WebSocketService = new WebSocketServiceImpl();

