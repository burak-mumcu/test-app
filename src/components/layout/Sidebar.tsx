import { useState } from 'react';

export type MenuItem = 'collections' | 'environment' | 'graphql' | 'websocket' | 'grpc' | 'tools' | 'export';

interface Props {
  activeItem: MenuItem | null;
  onItemClick: (item: MenuItem | null) => void;
}

export function Sidebar({ activeItem, onItemClick }: Props) {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems: Array<{ id: MenuItem; label: string; icon: string }> = [
    { id: 'collections', label: 'Collections', icon: '📁' },
    { id: 'environment', label: 'Environment', icon: '🌍' },
    { id: 'graphql', label: 'GraphQL', icon: '🔷' },
    { id: 'websocket', label: 'WebSocket', icon: '⚡' },
    { id: 'grpc', label: 'gRPC', icon: '⚙️' },
    { id: 'tools', label: 'Tools', icon: '🛠️' },
    { id: 'export', label: 'Export', icon: '📤' }
  ];

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span className="logo-icon">🚀</span>
          {!collapsed && <span className="logo-text">API Test</span>}
        </div>
        <button 
          className="sidebar-toggle"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          {collapsed ? '▶' : '◀'}
        </button>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <button
            key={item.id}
            className={`sidebar-item ${activeItem === item.id ? 'active' : ''}`}
            onClick={() => onItemClick(activeItem === item.id ? null : item.id)}
            title={collapsed ? item.label : ''}
          >
            <span className="sidebar-icon">{item.icon}</span>
            {!collapsed && <span className="sidebar-label">{item.label}</span>}
          </button>
        ))}
      </nav>
    </div>
  );
}

