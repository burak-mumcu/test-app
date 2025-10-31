# 🚀 Gelişmiş Kullanım

Bu bölüm, API Test App'in gelişmiş özelliklerini ve kullanım senaryolarını kapsar.

## 📋 İçindekiler

- [Programatik Kullanım](#programatik-kullanım)
- [Otomasyon](#otomasyon)
- [Özelleştirme](#özelleştirme)
- [Best Practices](#best-practices)

---

## Programatik Kullanım

### Store Doğrudan Kullanımı

Component dışında store'u kullanmak için:

```typescript
import { useAppStore } from './store';

// Store'a doğrudan erişim
const store = useAppStore.getState();

// Section ekleme
store.addSection('My API', 'https://api.example.com');

// Test çalıştırma
const section = store.sections[0];
const endpoint = section.endpoints[0];
// ... test logic
```

### Service'leri Doğrudan Kullanma

Test service'ini component dışında kullanma:

```typescript
import { testService } from './services/test.service';
import { reportService } from './services/report.service';

// Test çalıştırma
const result = await testService.runScenario(
  'https://api.example.com',
  endpoint,
  scenario
);

// Rapor oluşturma
const report = reportService.generateSectionReport(section, results);
```

---

## Otomasyon

### Toplu Test Senaryosu

Tüm section'ları otomatik çalıştırma:

```typescript
async function runAllTests() {
  const store = useAppStore.getState();
  const { testService } = await import('./services/test.service');

  for (const section of store.sections) {
    console.log(`Testing section: ${section.name}`);
    
    await testService.runSection(
      section.baseUrl,
      section.endpoints,
      (result, endpointId) => {
        store.setScenarioResult(section.id, endpointId, result);
      }
    );
  }
  
  console.log('All tests completed!');
}
```

### Programatik Export

Scheduled export işlemi:

```typescript
function scheduleExport() {
  const store = useAppStore.getState();
  
  // Her gün saat 00:00'da export yap
  setInterval(() => {
    const json = store.exportToJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Burada export işlemini gerçekleştirin
    // Örneğin: API'ye yükleme, email gönderme, vb.
    
    console.log('Scheduled export completed');
  }, 24 * 60 * 60 * 1000); // 24 saat
}
```

### Validation Script

Test sonuçlarını doğrulama:

```typescript
function validateResults(sectionId: string): boolean {
  const store = useAppStore.getState();
  const results = store.results[sectionId];
  
  if (!results) return false;
  
  let allPassed = true;
  
  results.endpoints.forEach(endpointResult => {
    endpointResult.results.forEach(result => {
      if (result.status !== 'pass') {
        allPassed = false;
        console.error(`Failed: ${result.scenarioId}`, result.errorMessage);
      }
    });
  });
  
  return allPassed;
}
```

---

## Özelleştirme

### Custom Test Service

Mevcut test service'ini extend ederek özelleştirme:

```typescript
import { testService } from './services/test.service';
import type { TestService } from './services/interfaces/test-service.interface';

class CustomTestService implements TestService {
  async runScenario(...) {
    // Custom logic ekleyin
    // Örneğin: Request logging, custom headers, vb.
    
    const result = await testService.runScenario(...);
    
    // Custom post-processing
    if (result.status === 'fail') {
      // Hata bildirimi gönder
      this.sendNotification(result);
    }
    
    return result;
  }
  
  private sendNotification(result: any) {
    // Notification logic
  }
}

export const customTestService = new CustomTestService();
```

### Custom Storage Backend

LocalStorage yerine farklı bir backend kullanma:

```typescript
import type { StorageService } from './services/interfaces/storage-service.interface';

class APIBackendStorage implements StorageService {
  async saveSections(sections: Section[]) {
    await fetch('/api/sections', {
      method: 'POST',
      body: JSON.stringify(sections)
    });
  }
  
  async loadSections(): Promise<Section[] | null> {
    const response = await fetch('/api/sections');
    return await response.json();
  }
  
  // ... diğer metodlar
}
```

### Custom Hook Oluşturma

Özel hook oluşturma:

```typescript
import { useSections } from './hooks';
import { testService } from './services/test.service';

export function useAutoTest(sectionId: string, interval: number = 60000) {
  const { sections } = useSections();
  const [isRunning, setIsRunning] = useState(false);
  
  useEffect(() => {
    if (!isRunning) return;
    
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;
    
    const intervalId = setInterval(async () => {
      await testService.runSection(
        section.baseUrl,
        section.endpoints,
        (result, endpointId) => {
          // Store'a kaydet
        }
      );
    }, interval);
    
    return () => clearInterval(intervalId);
  }, [isRunning, sectionId]);
  
  return { isRunning, setIsRunning };
}
```

---

## Best Practices

### 1. Test Organizasyonu

```typescript
// ✅ İyi: Açıklayıcı isimler
{
  name: "GET /users - 200 OK - Valid Token",
  expectedStatus: 200
}

// ❌ Kötü: Belirsiz isimler
{
  name: "Test 1",
  expectedStatus: 200
}
```

### 2. Error Handling

```typescript
async function safeTestRun() {
  try {
    await testService.runSection(baseUrl, endpoints, onResult);
  } catch (error) {
    console.error('Test failed:', error);
    // Error reporting
  }
}
```

### 3. Timeout Ayarları

```typescript
// ✅ İyi: Senaryoya göre timeout
const slowEndpointConfig = {
  timeout: 30000  // 30 saniye
};

const fastEndpointConfig = {
  timeout: 5000   // 5 saniye
};

// ❌ Kötü: Her zaman default timeout
```

### 4. Retry Stratejisi

```typescript
// ✅ İyi: Flaky testler için retry
const flakyTestConfig = {
  retryCount: 3,
  retryDelay: 1000
};

// ❌ Kötü: Her test için retry
```

### 5. Validation Kullanımı

```typescript
// ✅ İyi: Kritik endpoint'lerde validation
const criticalEndpointConfig = {
  validateResponseBody: true,
  validateResponseHeaders: true
};

// ❌ Kötü: Gereksiz validation
```

### 6. Section Organizasyonu

```typescript
// ✅ İyi: Environment bazlı
sections: [
  { name: "Development", baseUrl: "http://dev.api.com" },
  { name: "Staging", baseUrl: "http://staging.api.com" },
  { name: "Production", baseUrl: "https://api.com" }
]

// ❌ Kötü: Karışık organizasyon
```

### 7. Template Kullanımı

```typescript
// ✅ İyi: Standart yapıları template olarak kaydet
createSectionTemplate(sectionId, "RESTful API Standard");
createSectionTemplate(sectionId, "GraphQL API Standard");

// ❌ Kötü: Her seferinde sıfırdan oluştur
```

---

## Senaryolar

### CI/CD Entegrasyonu

```bash
# package.json
{
  "scripts": {
    "test:api": "node scripts/run-tests.js",
    "test:api:ci": "node scripts/run-tests-ci.js"
  }
}
```

```javascript
// scripts/run-tests-ci.js
import { useAppStore } from './src/store';
import { testService } from './src/services/test.service';

async function runCITests() {
  useAppStore.getState().loadFromStorage();
  
  const sections = useAppStore.getState().sections;
  let hasFailures = false;
  
  for (const section of sections) {
    await testService.runSection(
      section.baseUrl,
      section.endpoints,
      (result, endpointId) => {
        useAppStore.getState().setScenarioResult(
          section.id,
          endpointId,
          result
        );
        
        if (result.status === 'fail') {
          hasFailures = true;
          console.error(`❌ ${result.scenarioId} failed`);
        }
      }
    );
  }
  
  process.exit(hasFailures ? 1 : 0);
}

runCITests();
```

### Performance Monitoring

```typescript
function monitorPerformance(sectionId: string) {
  const store = useAppStore.getState();
  const results = store.results[sectionId];
  
  if (!results) return;
  
  const allTimes: number[] = [];
  
  results.endpoints.forEach(epResult => {
    epResult.results.forEach(result => {
      if (result.responseTime) {
        allTimes.push(result.responseTime);
      }
    });
  });
  
  const avg = allTimes.reduce((a, b) => a + b, 0) / allTimes.length;
  const max = Math.max(...allTimes);
  const min = Math.min(...allTimes);
  
  console.log({
    average: avg,
    max,
    min,
    total: allTimes.length
  });
  
  // Alert if average is too high
  if (avg > 1000) {
    console.warn('⚠️ Average response time is high:', avg);
  }
}
```

---

Sonraki: [Mimari](./architecture.md) →

