# 📖 API Referansı

API Test App'in programatik API'sini ve TypeScript interface'lerini bu bölümde bulabilirsiniz.

## 📋 İçindekiler

- [Store API](#store-api)
- [Services](#services)
- [Hooks](#hooks)
- [Types](#types)

---

## Store API

### Zustand Store

Store, Zustand kullanılarak oluşturulmuştur ve slice pattern ile organize edilmiştir.

#### Kullanım

```typescript
import { useAppStore } from './store';

// Selector ile kullanım
const sections = useAppStore((state) => state.sections);
const activeSection = useAppStore((state) => state.activeSectionId);

// Action çağırma
const addSection = useAppStore((state) => state.addSection);
addSection('Yeni Section', 'http://localhost:3000');
```

### Section Slice

#### `sections: Section[]`

Tüm section'ları getirir.

```typescript
const sections = useAppStore((state) => state.sections);
```

#### `activeSectionId: string | null`

Aktif section ID'sini getirir.

```typescript
const activeId = useAppStore((state) => state.activeSectionId);
```

#### `addSection(name?: string, baseUrl?: string): void`

Yeni section ekler ve otomatik aktif yapar.

```typescript
addSection('Production API', 'https://api.example.com');
```

#### `removeSection(sectionId: string): void`

Section'ı siler. Aktif section silinirse, başka bir section aktif olur.

```typescript
removeSection('section-123');
```

#### `updateSection(sectionId: string, patch: Partial<Section>): void`

Section'ı günceller.

```typescript
updateSection('section-123', {
  name: 'Updated Name',
  baseUrl: 'https://new-url.com'
});
```

#### `setActiveSection(sectionId: string | null): void`

Aktif section'ı değiştirir.

```typescript
setActiveSection('section-456');
```

#### `duplicateSection(sectionId: string): void`

Section'ı kopyalar.

```typescript
duplicateSection('section-123');
```

#### `createSectionTemplate(sectionId: string, templateName: string): void`

Section'ı template olarak kaydeder.

```typescript
createSectionTemplate('section-123', 'Auth Template');
```

#### `loadSectionFromTemplate(templateName: string): void`

Template'den section yükler.

```typescript
loadSectionFromTemplate('Auth Template');
```

### Endpoint Slice

#### `addEndpoint(sectionId: string, endpoint?: Partial<Endpoint>): void`

Endpoint ekler.

```typescript
addEndpoint('section-123', {
  name: 'Get Users',
  path: '/api/users',
  method: 'GET'
});
```

#### `removeEndpoint(sectionId: string, endpointId: string): void`

Endpoint'i siler.

```typescript
removeEndpoint('section-123', 'endpoint-456');
```

#### `updateEndpoint(sectionId: string, endpointId: string, patch: Partial<Endpoint>): void`

Endpoint'i günceller.

```typescript
updateEndpoint('section-123', 'endpoint-456', {
  method: 'POST',
  path: '/api/users/new'
});
```

#### `duplicateEndpoint(sectionId: string, endpointId: string): void`

Endpoint'i kopyalar.

```typescript
duplicateEndpoint('section-123', 'endpoint-456');
```

#### `bulkRemoveEndpoints(sectionId: string, endpointIds: string[]): void`

Birden fazla endpoint'i toplu siler.

```typescript
bulkRemoveEndpoints('section-123', [
  'endpoint-1',
  'endpoint-2',
  'endpoint-3'
]);
```

### Scenario Slice

#### `addScenario(sectionId: string, endpointId: string, scenario?: Partial<Scenario>): void`

Senaryo ekler.

```typescript
addScenario('section-123', 'endpoint-456', {
  name: '200 OK',
  expectedStatus: 200,
  headers: { 'Authorization': 'Bearer token' },
  requestBody: JSON.stringify({ name: 'John' })
});
```

#### `removeScenario(sectionId: string, endpointId: string, scenarioId: string): void`

Senaryoyu siler.

```typescript
removeScenario('section-123', 'endpoint-456', 'scenario-789');
```

#### `updateScenario(sectionId: string, endpointId: string, scenarioId: string, patch: Partial<Scenario>): void`

Senaryoyu günceller.

```typescript
updateScenario('section-123', 'endpoint-456', 'scenario-789', {
  expectedStatus: 201,
  testConfig: {
    timeout: 5000,
    retryCount: 2
  }
});
```

#### `duplicateScenario(sectionId: string, endpointId: string, scenarioId: string): void`

Senaryoyu kopyalar.

```typescript
duplicateScenario('section-123', 'endpoint-456', 'scenario-789');
```

#### `bulkRemoveScenarios(sectionId: string, endpointId: string, scenarioIds: string[]): void`

Birden fazla senaryoyu toplu siler.

```typescript
bulkRemoveScenarios('section-123', 'endpoint-456', [
  'scenario-1',
  'scenario-2'
]);
```

### Results Slice

#### `results: Record<string, SectionResult>`

Tüm test sonuçlarını getirir.

```typescript
const results = useAppStore((state) => state.results);
const sectionResult = results['section-123'];
```

#### `setScenarioResult(sectionId: string, endpointId: string, result: ScenarioResult): void`

Test sonucunu kaydeder.

```typescript
setScenarioResult('section-123', 'endpoint-456', {
  scenarioId: 'scenario-789',
  status: 'pass',
  actualStatus: 200,
  responseTime: 245,
  startedAt: Date.now(),
  finishedAt: Date.now()
});
```

#### `resetResultsForSection(sectionId: string): void`

Section'ın tüm test sonuçlarını temizler.

```typescript
resetResultsForSection('section-123');
```

### Persistence Slice

#### `loadFromStorage(): void`

LocalStorage'dan verileri yükler.

```typescript
useAppStore.getState().loadFromStorage();
```

#### `saveToStorage(): void`

Verileri localStorage'a kaydeder.

```typescript
useAppStore.getState().saveToStorage();
```

#### `exportToJSON(): string`

Verileri JSON string olarak export eder.

```typescript
const json = useAppStore.getState().exportToJSON();
console.log(json);
```

#### `importFromJSON(json: string): boolean`

JSON string'den verileri import eder.

```typescript
const success = importFromJSON(jsonString);
if (success) {
  console.log('Import başarılı!');
}
```

#### `clearStorage(): void`

Tüm verileri ve localStorage'ı temizler.

```typescript
clearStorage();
```

---

## Services

### Test Service

#### `runScenario(baseUrl: string, endpoint: Endpoint, scenario: Scenario): Promise<ScenarioResult>`

Tek bir senaryoyu çalıştırır.

```typescript
import { testService } from './services/test.service';

const result = await testService.runScenario(
  'https://api.example.com',
  endpoint,
  scenario
);

console.log(result.status); // 'pass' | 'fail'
console.log(result.responseTime); // milliseconds
```

#### `runEndpoint(baseUrl: string, endpoint: Endpoint, onResult: (result: ScenarioResult) => void): Promise<void>`

Endpoint'deki tüm senaryoları çalıştırır.

```typescript
await testService.runEndpoint(
  'https://api.example.com',
  endpoint,
  (result) => {
    console.log('Test sonucu:', result);
    // Her senaryo sonucu için çağrılır
  }
);
```

#### `runSection(baseUrl: string, endpoints: Endpoint[], onResult: (result: ScenarioResult, endpointId: string) => void): Promise<void>`

Section'daki tüm endpoint'leri ve senaryoları çalıştırır.

```typescript
await testService.runSection(
  'https://api.example.com',
  endpoints,
  (result, endpointId) => {
    console.log(`Endpoint ${endpointId} sonucu:`, result);
  }
);
```

### Storage Service

#### `saveSections(sections: Section[]): void`

Section'ları localStorage'a kaydeder.

```typescript
import { storageService } from './services/storage.service';

storageService.saveSections(sections);
```

#### `loadSections(): Section[] | null`

LocalStorage'dan section'ları yükler.

```typescript
const sections = storageService.loadSections();
```

#### `saveResults(results: Record<string, SectionResult>): void`

Test sonuçlarını kaydeder.

```typescript
storageService.saveResults(results);
```

#### `loadResults(): Record<string, SectionResult> | null`

Test sonuçlarını yükler.

```typescript
const results = storageService.loadResults();
```

#### `clear(): void`

Tüm localStorage verilerini temizler.

```typescript
storageService.clear();
```

### Report Service

#### `generateSectionReport(section: Section, sectionResult?: SectionResult): SectionReport`

Section için rapor oluşturur.

```typescript
import { reportService } from './services/report.service';

const report = reportService.generateSectionReport(section, sectionResult);
console.log(report.successRate); // %
console.log(report.averageResponseTime); // ms
```

#### `generateFullReport(sections: Section[], results: Record<string, SectionResult>): { summary: TestReport, sections: SectionReport[] }`

Tüm section'lar için tam rapor oluşturur.

```typescript
const fullReport = reportService.generateFullReport(sections, results);
console.log(fullReport.summary.totalTests);
```

---

## Hooks

### `useSections()`

Tüm section yönetimi hook'u.

```typescript
import { useSections } from './hooks';

function MyComponent() {
  const {
    sections,
    activeSectionId,
    activeSection,
    addSection,
    removeSection,
    setActiveSection
  } = useSections();

  return (
    <button onClick={() => addSection('New Section', 'http://localhost:3000')}>
      Add Section
    </button>
  );
}
```

### `useSection(sectionId: string)`

Tek bir section için hook.

```typescript
import { useSection } from './hooks';

function SectionComponent({ sectionId }: { sectionId: string }) {
  const { section, updateSection } = useSection(sectionId);

  return (
    <input
      value={section.name}
      onChange={(e) => updateSection({ name: e.target.value })}
    />
  );
}
```

### `useEndpoint(sectionId: string, endpointId: string)`

Endpoint hook'u.

```typescript
import { useEndpoint } from './hooks';

function EndpointComponent({ sectionId, endpointId }: Props) {
  const { endpoint, updateEndpoint, removeEndpoint } = useEndpoint(
    sectionId,
    endpointId
  );

  return (
    <div>
      <input
        value={endpoint.name}
        onChange={(e) => updateEndpoint({ name: e.target.value })}
      />
      <button onClick={() => removeEndpoint()}>Delete</button>
    </div>
  );
}
```

### `useScenario(sectionId: string, endpointId: string, scenarioId: string)`

Senaryo hook'u.

```typescript
import { useScenario } from './hooks';

function ScenarioComponent({ sectionId, endpointId, scenarioId }: Props) {
  const { scenario, updateScenario, removeScenario } = useScenario(
    sectionId,
    endpointId,
    scenarioId
  );

  return (
    <input
      value={scenario.name}
      onChange={(e) => updateScenario({ name: e.target.value })}
    />
  );
}
```

### `useTestResults(sectionId: string, endpointId: string, scenarioId: string)`

Test sonuçları hook'u.

```typescript
import { useTestResults } from './hooks';

function ResultComponent({ sectionId, endpointId, scenarioId }: Props) {
  const { result, setScenarioResult, resetResults } = useTestResults(
    sectionId,
    endpointId,
    scenarioId
  );

  if (!result) return <div>No result</div>;

  return (
    <div>
      <div>Status: {result.status}</div>
      <div>Time: {result.responseTime}ms</div>
    </div>
  );
}
```

---

## Types

### Section

```typescript
interface Section {
  id: string;
  name: string;
  baseUrl: string;
  endpoints: Endpoint[];
}
```

### Endpoint

```typescript
interface Endpoint {
  id: string;
  name: string;
  path: string;
  method: HttpMethod;
  scenarios: Scenario[];
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';
```

### Scenario

```typescript
interface Scenario {
  id: string;
  name: string;
  expectedStatus: number;
  requestBody?: string;
  headers?: Record<string, string>;
  testConfig?: TestConfig;
}

interface TestConfig {
  timeout?: number;
  retryCount?: number;
  retryDelay?: number;
  validateResponseBody?: boolean;
  validateResponseHeaders?: boolean;
  expectedResponseBody?: string;
  expectedResponseHeaders?: Record<string, string>;
}
```

### ScenarioResult

```typescript
interface ScenarioResult {
  scenarioId: string;
  status: 'pending' | 'pass' | 'fail';
  actualStatus?: number;
  errorMessage?: string;
  startedAt?: number;
  finishedAt?: number;
  responseTime?: number;
  responseBody?: string;
  responseHeaders?: Record<string, string>;
  retryCount?: number;
}
```

### SectionResult

```typescript
interface SectionResult {
  sectionId: string;
  endpoints: EndpointResult[];
}

interface EndpointResult {
  endpointId: string;
  results: ScenarioResult[];
}
```

---

Sonraki: [Gelişmiş Kullanım](./advanced-usage.md) →

