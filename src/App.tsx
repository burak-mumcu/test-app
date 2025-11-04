import { useState } from 'react';
import { useSections } from './hooks';
import { useAppStore } from './store';
import { SectionView } from './components/SectionView';
import { EnvironmentView } from './components/environment/EnvironmentView';
import { GraphQLView } from './components/graphql/GraphQLView';
import { WebSocketView } from './components/websocket/WebSocketView';
import { GRPCView } from './components/grpc/GRPCView';
import { ResponseDiffView } from './components/diff/ResponseDiffView';
import { Sidebar, type MenuItem } from './components/layout/Sidebar';
import { importPostmanCollection, exportToPostmanCollection } from './utils/postman-converter.util';
import { importSwaggerSpec } from './utils/swagger-converter.util';
import { exportToHAR, exportToCSV, exportToHTML } from './utils/export-utils';

export function App() {
  const { sections, activeSectionId, activeSection, addSection, removeSection, setActiveSection } = useSections();
  const importFromJSON = useAppStore((s) => s.importFromJSON);
  const [activeMenuItem, setActiveMenuItem] = useState<MenuItem | null>('collections');

  const handleRemoveSection = (e: React.MouseEvent, sectionId: string) => {
    e.stopPropagation();
    removeSection(sectionId);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const text = event.target?.result as string;
          try {
            const data = JSON.parse(text);
            const state = useAppStore.getState();
            
            // Check if it's a Postman collection
            if (data.info && data.info.schema && data.item) {
              const { sections: importedSections, environments: importedEnvs } = importPostmanCollection(data);
              // Merge sections
              const newSections = [...state.sections, ...importedSections];
              useAppStore.setState({ sections: newSections });
              // Merge environments
              if (importedEnvs.length > 0) {
                const newEnvs = [...state.environments, ...importedEnvs];
                useAppStore.setState({ environments: newEnvs });
              }
              alert(`Postman Collection import edildi! ${importedSections.length} section eklendi.`);
            } 
            // Check if it's a Swagger/OpenAPI spec
            else if (data.openapi || data.swagger) {
              const { sections: importedSections, baseUrl } = importSwaggerSpec(data);
              if (importedSections.length > 0) {
                const newSections = [...state.sections, ...importedSections];
                useAppStore.setState({ sections: newSections });
                alert(`Swagger/OpenAPI import edildi! ${importedSections[0].endpoints.length} endpoint eklendi. Base URL: ${baseUrl}`);
              } else {
                alert('Swagger/OpenAPI dosyasında endpoint bulunamadı.');
              }
            }
            // Try as internal format
            else if (importFromJSON(text)) {
              alert('Import başarılı!');
            } else {
              alert('Import başarısız! Geçerli bir JSON dosyası seçin.');
            }
          } catch (error) {
            alert('Import başarısız! Geçerli bir JSON dosyası seçin.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleExport = (format: 'json' | 'postman' | 'har' | 'csv' | 'html') => {
    const state = useAppStore.getState();
    let blob: Blob;
    let filename: string;
    let mimeType: string;

    switch (format) {
      case 'json':
        const json = state.exportToJSON();
        blob = new Blob([json], { type: 'application/json' });
        filename = `api-test-${new Date().toISOString().split('T')[0]}.json`;
        mimeType = 'application/json';
        break;
      case 'postman':
        const collection = exportToPostmanCollection(state.sections);
        blob = new Blob([JSON.stringify(collection, null, 2)], { type: 'application/json' });
        filename = `postman-collection-${new Date().toISOString().split('T')[0]}.json`;
        mimeType = 'application/json';
        break;
      case 'har':
        const har = exportToHAR(state.sections, state.results);
        blob = new Blob([har], { type: 'application/json' });
        filename = `har-${new Date().toISOString().split('T')[0]}.har`;
        mimeType = 'application/json';
        break;
      case 'csv':
        const csv = exportToCSV(state.sections, state.results);
        blob = new Blob([csv], { type: 'text/csv' });
        filename = `report-${new Date().toISOString().split('T')[0]}.csv`;
        mimeType = 'text/csv';
        break;
      case 'html':
        const html = exportToHTML(state.sections, state.results);
        blob = new Blob([html], { type: 'text/html' });
        filename = `report-${new Date().toISOString().split('T')[0]}.html`;
        mimeType = 'text/html';
        break;
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderContent = () => {
    switch (activeMenuItem) {
      case 'collections':
        return (
          <div>
            <div className="space-between" style={{ marginBottom: 16 }}>
              <h2>Collections</h2>
              <div className="row" style={{ gap: 8 }}>
                <button className="ghost" onClick={handleImport}>📥 Import</button>
                <button className="primary" onClick={() => addSection()}>+ Yeni Section</button>
              </div>
            </div>

            {sections.length > 0 && (
              <div className="tabs-container">
                <div className="tabs">
                  {sections.map((section) => (
                    <div
                      key={section.id}
                      className={`tab ${activeSectionId === section.id ? 'active' : ''}`}
                      onClick={() => setActiveSection(section.id)}
                    >
                      <span className="tab-label">{section.name || 'Yeni Section'}</span>
                      <button
                        className="tab-close"
                        onClick={(e) => handleRemoveSection(e, section.id)}
                        title="Kapat"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection && (
              <div className="section panel modern-card" style={{ marginTop: 0 }}>
                <SectionView sectionId={activeSection.id} />
              </div>
            )}

            {sections.length === 0 && (
              <div className="panel modern-card" style={{ textAlign: 'center', padding: '48px' }}>
                <p className="muted">Henüz section yok. Yeni bir section ekleyin.</p>
                <button className="primary" onClick={() => addSection()} style={{ marginTop: '16px', width: '100%' }}>
                  İlk Section'ı Ekle
                </button>
              </div>
            )}
          </div>
        );

      case 'environment':
        return (
          <div>
            <h2 style={{ marginBottom: 16 }}>Environment Variables</h2>
            <EnvironmentView />
          </div>
        );

      case 'graphql':
        return (
          <div>
            <h2 style={{ marginBottom: 16 }}>GraphQL Query</h2>
            {activeSection ? (
              <GraphQLView endpoint={activeSection.baseUrl} />
            ) : (
              <div className="panel modern-card">
                <p className="muted">Önce bir section seçin veya oluşturun.</p>
              </div>
            )}
          </div>
        );

      case 'websocket':
        return (
          <div>
            <h2 style={{ marginBottom: 16 }}>WebSocket Connection</h2>
            {activeSection ? (
              <WebSocketView endpoint={activeSection.baseUrl.replace('http://', 'ws://').replace('https://', 'wss://')} />
            ) : (
              <div className="panel modern-card">
                <p className="muted">Önce bir section seçin veya oluşturun.</p>
              </div>
            )}
          </div>
        );

      case 'grpc':
        return (
          <div>
            <h2 style={{ marginBottom: 16 }}>gRPC Call</h2>
            {activeSection ? (
              <GRPCView endpoint={activeSection.baseUrl} />
            ) : (
              <div className="panel modern-card">
                <p className="muted">Önce bir section seçin veya oluşturun.</p>
              </div>
            )}
          </div>
        );

      case 'tools':
        return (
          <div>
            <h2 style={{ marginBottom: 16 }}>Tools</h2>
            <div className="panel modern-card">
              <h3 style={{ marginBottom: 12 }}>Response Diff Tool</h3>
              <ResponseDiffView />
            </div>
          </div>
        );

      case 'export':
        return (
          <div>
            <h2 style={{ marginBottom: 16 }}>Export</h2>
            <div className="panel modern-card">
              <div className="col" style={{ gap: 12 }}>
                <div>
                  <h3 style={{ marginBottom: 8 }}>Export Format</h3>
                  <p className="small muted" style={{ marginBottom: 16 }}>
                    Tüm collections'ı seçilen formatta export edin.
                  </p>
                </div>
                <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
                  <button className="primary" onClick={() => handleExport('json')}>
                    📄 JSON
                  </button>
                  <button className="primary" onClick={() => handleExport('postman')}>
                    📦 Postman
                  </button>
                  <button className="primary" onClick={() => handleExport('har')}>
                    📊 HAR
                  </button>
                  <button className="primary" onClick={() => handleExport('csv')}>
                    📈 CSV
                  </button>
                  <button className="primary" onClick={() => handleExport('html')}>
                    🌐 HTML
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar activeItem={activeMenuItem} onItemClick={setActiveMenuItem} />
      <div className="content-area">
        <div className="app-header">
          <h1>🚀 API Test App</h1>
          <div className="app-header-actions">
            {activeMenuItem === 'collections' && (
              <button className="ghost" onClick={handleImport}>📥 Import</button>
            )}
          </div>
        </div>
        <div className="content-main">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

