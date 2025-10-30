import { useSections } from './hooks';
import { useAppStore } from './store';
import { SectionView } from './components/SectionView';

export function App() {
  const { sections, activeSectionId, activeSection, addSection, removeSection, setActiveSection } = useSections();
  const importFromJSON = useAppStore((s) => s.importFromJSON);

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
          if (importFromJSON(text)) {
            alert('Import başarılı!');
          } else {
            alert('Import başarısız! Geçerli bir JSON dosyası seçin.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div className="container">
      <div className="space-between" style={{ marginBottom: 16 }}>
        <h1>API Test App</h1>
        <div className="row" style={{ gap: 8 }}>
          <button className="ghost" onClick={handleImport}>Import</button>
          <button className="primary" onClick={() => addSection()}>Yeni Section</button>
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
        <div className="section panel" style={{ marginTop: 0 }}>
          <SectionView sectionId={activeSection.id} />
        </div>
      )}

      {sections.length === 0 && (
        <div className="panel" style={{ textAlign: 'center', padding: '48px' }}>
          <p className="muted">Henüz section yok. Yeni bir section ekleyin.</p>
          <button className="primary" onClick={() => addSection()} style={{ marginTop: '16px' }}>
            İlk Section'ı Ekle
          </button>
        </div>
      )}
    </div>
  );
}

