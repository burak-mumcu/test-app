# 🏗️ Mimari ve Tasarım

API Test App, modern yazılım geliştirme prensipleri ve SOLID prensipleri kullanılarak tasarlanmıştır.

## 📋 İçindekiler

- [Mimari Genel Bakış](#mimari-genel-bakış)
- [Dosya Yapısı](#dosya-yapısı)
- [SOLID Prensipleri](#solid-prensipleri)
- [Design Patterns](#design-patterns)
- [State Yönetimi](#state-yönetimi)
- [Service Layer](#service-layer)

---

## Mimari Genel Bakış

### Katmanlı Mimari

```
┌─────────────────────────────────────┐
│         Presentation Layer          │
│    (Components, Hooks, UI)          │
└─────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│          Business Layer             │
│         (Store, Services)            │
└─────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│           Data Layer                │
│    (Storage, Types, Utils)          │
└─────────────────────────────────────┘
```

### Teknoloji Stack

- **Frontend Framework**: React 18.3
- **Language**: TypeScript 5.6
- **State Management**: Zustand 4.5
- **Build Tool**: Vite 5.4
- **Styling**: CSS (custom properties)

---

## Dosya Yapısı

```
src/
├── components/           # UI Bileşenleri
│   ├── endpoint/        # Endpoint ile ilgili componentler
│   ├── report/          # Rapor componentleri
│   └── SectionView.tsx  # Section görünümü
│
├── hooks/               # Custom React Hooks
│   ├── useSection.hook.ts
│   ├── useSections.hook.ts
│   ├── useEndpoint.hook.ts
│   ├── useScenario.hook.ts
│   ├── useTestResults.hook.ts
│   └── useTestRunner.hook.ts
│
├── services/            # İş Mantığı Servisleri
│   ├── interfaces/      # Service interface'leri
│   ├── test.service.ts  # Test çalıştırma servisi
│   ├── storage.service.ts # Veri saklama servisi
│   └── report.service.ts  # Raporlama servisi
│
├── store/               # State Yönetimi
│   ├── interfaces/      # Store interface'leri
│   ├── slices/          # Zustand slice'ları
│   │   ├── section.slice.ts
│   │   ├── endpoint.slice.ts
│   │   ├── scenario.slice.ts
│   │   ├── results.slice.ts
│   │   └── persistence.slice.ts
│   └── index.ts         # Store export
│
├── types/               # TypeScript Tip Tanımları
│   ├── interfaces/      # Interface tanımları
│   ├── http-method.type.ts
│   └── index.ts         # Type export'ları
│
└── utils/               # Yardımcı Fonksiyonlar
    ├── header-parser.util.ts
    ├── response-validator.util.ts
    └── nanoid.ts
```

---

## SOLID Prensipleri

### Single Responsibility Principle (SRP)

Her modül tek bir sorumluluğa sahiptir:

```typescript
// ✅ İyi: Sadece test çalıştırma
class TestService {
  async runScenario() { /* ... */ }
}

// ✅ İyi: Sadece veri saklama
class StorageService {
  saveSections() { /* ... */ }
}

// ✅ İyi: Sadece rapor oluşturma
class ReportService {
  generateReport() { /* ... */ }
}
```

### Open/Closed Principle (OCP)

Interface'ler üzerinden genişletilebilir:

```typescript
// Interface tanımı
interface TestService {
  runScenario(): Promise<ScenarioResult>;
}

// Implementasyon
class TestServiceImpl implements TestService {
  // Mevcut implementasyon
}

// Genişletme (yeni özellik ekleme)
class ExtendedTestService implements TestService {
  // Yeni özellikler eklenebilir
  // Mevcut kod değiştirilmeden
}
```

### Liskov Substitution Principle (LSP)

Interface implementasyonları değiştirilebilir:

```typescript
// Herhangi bir TestService implementasyonu
// Aynı şekilde kullanılabilir
function runTests(service: TestService) {
  return service.runScenario();
}

// Farklı implementasyonlar sorunsuz çalışır
runTests(new TestServiceImpl());
runTests(new MockTestService());
runTests(new ExtendedTestService());
```

### Interface Segregation Principle (ISP)

Küçük, özelleşmiş interface'ler:

```typescript
// ✅ İyi: Küçük, özelleşmiş hook'lar
function useSection(sectionId: string) {
  // Sadece section ile ilgili
}

function useEndpoint(sectionId: string, endpointId: string) {
  // Sadece endpoint ile ilgili
}

// ❌ Kötü: Her şeyi içeren büyük hook
function useEverything() {
  // Tüm veriler ve metodlar
}
```

### Dependency Inversion Principle (DIP)

Abstraction'lara bağımlılık:

```typescript
// Component interface'e bağımlı
function MyComponent() {
  const testService: TestService = useTestService();
  // Implementasyon detaylarını bilmez
}

// Service interface tanımlı
interface TestService {
  runScenario(): Promise<ScenarioResult>;
}

// Concrete implementation
class TestServiceImpl implements TestService {
  // Detaylar burada
}
```

---

## Design Patterns

### Repository Pattern

Storage service, veri erişimini soyutlar:

```typescript
interface StorageService {
  saveSections(sections: Section[]): void;
  loadSections(): Section[] | null;
}

// Implementation detayları değiştirilebilir
// LocalStorage, IndexedDB, API, vb.
```

### Strategy Pattern

Farklı test stratejileri:

```typescript
interface TestService {
  runScenario(): Promise<ScenarioResult>;
}

// Farklı stratejiler
class SequentialTestService implements TestService {
  // Sıralı çalıştırma
}

class ParallelTestService implements TestService {
  // Paralel çalıştırma
}
```

### Observer Pattern

Store subscription:

```typescript
// State değişikliklerini dinle
useAppStore.subscribe((state) => {
  // Otomatik kaydetme
  state.saveToStorage();
});
```

### Factory Pattern

Store slice'ları factory function'lar ile oluşturulur:

```typescript
export const createSectionSlice: StateCreator<...> = (set, get) => {
  return {
    sections: [],
    addSection: () => { /* ... */ }
  };
};
```

---

## State Yönetimi

### Zustand Slice Pattern

Her domain için ayrı slice:

```typescript
// Section slice
createSectionSlice() → SectionSlice

// Endpoint slice
createEndpointSlice() → EndpointSlice

// Scenario slice
createScenarioSlice() → ScenarioSlice

// Results slice
createResultsSlice() → ResultsSlice

// Persistence slice
createPersistenceSlice() → PersistenceSlice
```

### Store Composition

```typescript
// Tüm slice'lar birleştirilir
export const useAppStore = create<AppStore>()((...a) => ({
  ...createSectionSlice(...a),
  ...createEndpointSlice(...a),
  ...createScenarioSlice(...a),
  ...createResultsSlice(...a),
  ...createPersistenceSlice(...a)
}));
```

### State Selectors

```typescript
// Optimized selectors
const sections = useAppStore((state) => state.sections);
const activeSection = useAppStore((state) => 
  state.sections.find(s => s.id === state.activeSectionId)
);
```

---

## Service Layer

### Service Interface'leri

```typescript
// Abstraction
interface TestService {
  runScenario(): Promise<ScenarioResult>;
}

// Implementation
class TestServiceImpl implements TestService {
  // Concrete implementation
}
```

### Service Injection

```typescript
// Service instance export
export const testService: TestService = new TestServiceImpl();

// Kullanım
import { testService } from './services/test.service';
```

---

## Veri Akışı

### Component → Hook → Store → Service

```
Component (UI)
    ↓
Hook (useSection, useEndpoint, etc.)
    ↓
Store (Zustand)
    ↓
Service (TestService, StorageService)
    ↓
External (API, LocalStorage)
```

### Örnek Akış

```typescript
// 1. Component'te hook kullan
function SectionView({ sectionId }: Props) {
  const { section, updateSection } = useSection(sectionId);
  // ...
}

// 2. Hook store'dan veri alır
export function useSection(sectionId: string) {
  const section = useAppStore((s) => s.sections.find(...));
  const updateSection = useAppStore((s) => s.updateSection);
  // ...
}

// 3. Store slice action çağırır
updateSection: (sectionId, patch) => set((state) => ({
  sections: state.sections.map(...)
}))

// 4. Service gerekirse çağrılır
await testService.runScenario(...);
```

---

## Type Safety

### Strict TypeScript

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

### Interface Definitions

```typescript
// Her entity için interface
interface Section {
  id: string;
  name: string;
  baseUrl: string;
  endpoints: Endpoint[];
}

// Type guards
function isSection(obj: any): obj is Section {
  return obj && typeof obj.id === 'string';
}
```

---

## Performance Optimizations

### Memoization

```typescript
// useMemo ile expensive calculations
const report = useMemo(
  () => reportService.generateSectionReport(section, results),
  [section, results]
);
```

### Lazy Loading

```typescript
// Code splitting
const ReportView = lazy(() => import('./components/report/ReportView'));
```

### Selective Re-renders

```typescript
// Sadece gerekli state'i subscribe et
const sections = useAppStore((state) => state.sections);
// Diğer state değişiklikleri bu component'i render etmez
```

---

## Test Edilebilirlik

### Dependency Injection

```typescript
// Service'ler inject edilebilir
function runTests(service: TestService) {
  return service.runScenario(...);
}

// Mock service ile test
const mockService: TestService = {
  runScenario: jest.fn()
};
runTests(mockService);
```

### Pure Functions

```typescript
// Pure function - test edilebilir
function validateResponseBody(actual: string, expected?: string): boolean {
  // Side effect yok
  // Deterministic
}
```

---

## Güvenlik

### Input Validation

```typescript
function parseHeaders(input: string): Record<string, string> | undefined {
  // Validation logic
  if (!input.trim()) return undefined;
  // ...
}
```

### XSS Prevention

```typescript
// React otomatik olarak XSS'i önler
<span>{section.name}</span>  // Güvenli
```

---

## Genişletilebilirlik

### Yeni Feature Ekleme

1. **Yeni Type**: `types/interfaces/` altına ekle
2. **Yeni Service**: `services/` altına interface ve implementasyon ekle
3. **Yeni Slice**: `store/slices/` altına ekle
4. **Yeni Hook**: `hooks/` altına ekle
5. **Yeni Component**: `components/` altına ekle

### Plugin System (Gelecek)

```typescript
interface Plugin {
  name: string;
  initialize(): void;
  onTestStart?(): void;
  onTestEnd?(result: ScenarioResult): void;
}

// Plugin registration
registerPlugin(myPlugin);
```

---

Sonraki: [README](./README.md) →

