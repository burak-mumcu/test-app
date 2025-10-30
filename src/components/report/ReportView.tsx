import { useSections } from '../../hooks';
import { useAppStore } from '../../store';
import { reportService } from '../../services/report.service';
import type { SectionReport } from '../../services/report.service';

interface Props {
  sectionId: string;
  onClose: () => void;
}

export function ReportView({ sectionId, onClose }: Props) {
  const { sections } = useSections();
  const results = useAppStore((s) => s.results);
  
  const section = sections.find((s) => s.id === sectionId);
  if (!section) return null;

  const sectionResult = results[sectionId];
  const report = reportService.generateSectionReport(section, sectionResult);

  return (
    <div className="panel" style={{ marginTop: '16px' }}>
      <div className="space-between" style={{ marginBottom: '16px' }}>
        <h2>{report.sectionName} - Test Raporu</h2>
        <button className="ghost" onClick={onClose}>Kapat</button>
      </div>

      {/* Summary Cards */}
      <div className="row" style={{ gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <div className="panel" style={{ flex: 1, minWidth: '120px', padding: '12px' }}>
          <div className="small muted">Toplam Test</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{report.totalTests}</div>
        </div>
        <div className="panel" style={{ flex: 1, minWidth: '120px', padding: '12px', background: 'rgba(34,197,94,.15)' }}>
          <div className="small muted">Başarılı</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--green)' }}>{report.passed}</div>
        </div>
        <div className="panel" style={{ flex: 1, minWidth: '120px', padding: '12px', background: 'rgba(239,68,68,.15)' }}>
          <div className="small muted">Başarısız</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--red)' }}>{report.failed}</div>
        </div>
        <div className="panel" style={{ flex: 1, minWidth: '120px', padding: '12px' }}>
          <div className="small muted">Başarı Oranı</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{report.successRate.toFixed(1)}%</div>
        </div>
        {report.averageResponseTime > 0 && (
          <div className="panel" style={{ flex: 1, minWidth: '120px', padding: '12px' }}>
            <div className="small muted">Ort. Yanıt Süresi</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{report.averageResponseTime.toFixed(0)}ms</div>
          </div>
        )}
      </div>

      {/* Performance Metrics */}
      {(report.fastestTest !== null || report.slowestTest !== null) && (
        <div className="panel" style={{ marginBottom: '16px', padding: '12px' }}>
          <div className="small muted" style={{ marginBottom: '8px' }}>Performans Metrikleri</div>
          <div className="row" style={{ gap: '16px' }}>
            {report.fastestTest !== null && (
              <div>
                <span className="small muted">En Hızlı: </span>
                <span className="tag pass">{report.fastestTest}ms</span>
              </div>
            )}
            {report.slowestTest !== null && (
              <div>
                <span className="small muted">En Yavaş: </span>
                <span className="tag fail">{report.slowestTest}ms</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Endpoint Reports */}
      <div className="col" style={{ gap: '12px' }}>
        {report.endpointReports.map((epReport) => (
          <div key={epReport.endpointId} className="panel" style={{ padding: '12px' }}>
            <div className="space-between" style={{ marginBottom: '8px' }}>
              <div style={{ fontWeight: 'bold' }}>{epReport.endpointName}</div>
              <div className="row" style={{ gap: '8px' }}>
                <span className={`tag ${epReport.passed > 0 ? 'pass' : ''}`}>{epReport.passed} ✓</span>
                <span className={`tag ${epReport.failed > 0 ? 'fail' : ''}`}>{epReport.failed} ✗</span>
                {epReport.averageResponseTime > 0 && (
                  <span className="small muted">{epReport.averageResponseTime.toFixed(0)}ms</span>
                )}
              </div>
            </div>
            <div className="col" style={{ gap: '4px' }}>
              {epReport.scenarioReports.map((scReport) => (
                <div key={scReport.scenarioId} className="row" style={{ gap: '8px', alignItems: 'center' }}>
                  <span className={`tag ${scReport.status}`} style={{ minWidth: '60px' }}>
                    {scReport.status.toUpperCase()}
                  </span>
                  <span>{scReport.scenarioName}</span>
                  {scReport.responseTime !== undefined && (
                    <span className="small muted">{scReport.responseTime}ms</span>
                  )}
                  {scReport.errorMessage && (
                    <span className="small" style={{ color: 'var(--red)' }}>{scReport.errorMessage}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

