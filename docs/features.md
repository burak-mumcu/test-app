# ✨ Özellikler ve Kullanım

API Test App'in tüm özelliklerini ve kullanım senaryolarını bu bölümde bulabilirsiniz.

## 📋 İçindekiler

- [Test Yönetimi](#-test-yönetimi)
- [Raporlama ve Analitik](#-raporlama-ve-analitik)
- [Veri Yönetimi](#-veri-yönetimi)
- [Kullanıcı Arayüzü](#-kullanıcı-arayüzü)
- [Gelişmiş Özellikler](#-gelişmiş-özellikler)

---

## 🔧 Test Yönetimi

### Section Yönetimi

#### Section Oluşturma

Her section bir API servisi veya environment'ı temsil eder.

```typescript
// Örnek Section Yapısı
{
  id: "section-123",
  name: "Production API",
  baseUrl: "https://api.example.com",
  endpoints: [...]
}
```

**Kullanım:**
1. Ana ekranda "Yeni Section" butonuna tıklayın
2. Section adı ve base URL girin
3. Yeni sekme otomatik olarak aktif olur

#### Section Kopyalama

Mevcut section'ları kopyalayarak benzer yapıları hızlıca oluşturabilirsiniz.

**Kullanım:**
- Section görünümünde "Kopyala" butonuna tıklayın
- Tüm endpoint'ler ve senaryolar kopyalanır
- ID'ler otomatik olarak yeniden oluşturulur

#### Template Sistemi

Section'ları template olarak kaydedip sonra kullanabilirsiniz.

**Template Kaydetme:**
```typescript
// Programatik kullanım (store)
createSectionTemplate(sectionId, "Auth Template");
```

**Template Yükleme:**
```typescript
loadSectionFromTemplate("Auth Template");
```

### Endpoint Yönetimi

#### HTTP Metodları

Desteklenen HTTP metodları:
- `GET` - Veri okuma
- `POST` - Yeni kayıt oluşturma
- `PUT` - Tam güncelleme
- `PATCH` - Kısmi güncelleme
- `DELETE` - Silme
- `HEAD` - Header bilgisi alma
- `OPTIONS` - CORS preflight

#### Path Yönetimi

Path'ler base URL'e otomatik eklenir:

```
Base URL: https://api.example.com
Path: /api/users/123
Final URL: https://api.example.com/api/users/123
```

> ⚠️ **Dikkat**: Path her zaman `/` ile başlamalıdır.

### Senaryo Yönetimi

#### Temel Senaryo

```typescript
{
  id: "scenario-456",
  name: "200 OK Response",
  expectedStatus: 200,
  headers: {
    "Authorization": "Bearer token123"
  },
  requestBody: JSON.stringify({ name: "John" })
}
```

#### Gelişmiş Senaryo (Test Config ile)

```typescript
{
  name: "Validated Response",
  expectedStatus: 200,
  testConfig: {
    timeout: 5000,              // 5 saniye timeout
    retryCount: 3,               // 3 kez tekrar dene
    retryDelay: 1000,             // 1 saniye bekle
    validateResponseBody: true,
    expectedResponseBody: '{"status":"success"}',
    validateResponseHeaders: true,
    expectedResponseHeaders: {
      "Content-Type": "application/json"
    }
  }
}
```

### Test Ayarları

#### Timeout

Request'in ne kadar süre bekleyeceğini belirler.

**Örnek:**
```typescript
testConfig: {
  timeout: 30000  // 30 saniye
}
```

#### Retry Mekanizması

Başarısız istekleri otomatik tekrar dener.

**Örnek:**
```typescript
testConfig: {
  retryCount: 3,      // 3 kez tekrar dene
  retryDelay: 1000    // Her deneme arasında 1 saniye bekle
}
```

**Çalışma Mantığı:**
1. İlk istek başarısız olursa
2. `retryDelay` kadar bekle
3. Tekrar dene
4. `retryCount` kadar tekrarla

#### Response Validation

**Body Validation:**
```typescript
testConfig: {
  validateResponseBody: true,
  expectedResponseBody: JSON.stringify({
    status: "success",
    data: { id: 123 }
  })
}
```

Response body, beklenen body ile karşılaştırılır. JSON formatı otomatik parse edilir.

**Header Validation:**
```typescript
testConfig: {
  validateResponseHeaders: true,
  expectedResponseHeaders: {
    "Content-Type": "application/json",
    "X-API-Version": "v1"
  }
}
```

Header'lar case-insensitive karşılaştırılır.

---

## 📊 Raporlama ve Analitik

### Test Raporu

Rapor görünümü şu bilgileri içerir:

#### Özet Metrikler

- **Toplam Test**: Çalıştırılan toplam test sayısı
- **Başarılı**: Başarılı test sayısı
- **Başarısız**: Başarısız test sayısı
- **Başarı Oranı**: Yüzde olarak başarı oranı
- **Ortalama Yanıt Süresi**: Tüm testlerin ortalama süresi

#### Performans Metrikleri

- **En Hızlı Test**: En kısa response time
- **En Yavaş Test**: En uzun response time
- **Toplam Süre**: Tüm testlerin toplam süresi

#### Endpoint Bazlı Raporlar

Her endpoint için:
- Test sayıları (başarılı/başarısız)
- Ortalama response time
- Senaryo bazlı detaylar

#### Senaryo Bazlı Detaylar

Her senaryo için:
- Test durumu (PASS/FAIL/PENDING)
- Response time
- Hata mesajı (varsa)
- Actual status code

### Rapor Görüntüleme

**Kullanım:**
1. Section görünümünde "Raporu Göster" butonuna tıklayın
2. Rapor panel açılır
3. Detaylı metrikleri görüntüleyin
4. "Raporu Gizle" ile kapatın

---

## 💾 Veri Yönetimi

### Otomatik Kaydetme

Tüm veriler otomatik olarak localStorage'a kaydedilir:

- ✅ Section'lar
- ✅ Endpoint'ler
- ✅ Senaryolar
- ✅ Test sonuçları
- ✅ Test ayarları

**Avantajlar:**
- Sayfa yenilendiğinde veriler korunur
- Tarayıcı kapatılsa bile veriler kaybolmaz
- Manuel kaydetme gerektirmez

### Export İşlemi

**JSON Formatı:**
```json
{
  "sections": [...],
  "results": {...},
  "exportedAt": "2024-01-15T10:30:00.000Z",
  "version": "1.0"
}
```

**Kullanım:**
1. Section görünümünde "Export" butonuna tıklayın
2. JSON dosyası otomatik indirilir
3. Dosya adı: `api-test-{section-name}-{date}.json`

**Kullanım Senaryoları:**
- Yedekleme
- Paylaşma
- Versiyonlama
- Farklı ortamlara taşıma

### Import İşlemi

**Kullanım:**
1. Ana ekranda "Import" butonuna tıklayın
2. JSON dosyasını seçin
3. Veriler otomatik yüklenir ve mevcut verilerle birleştirilir

> ⚠️ **Dikkat**: Import işlemi mevcut verileri üzerine yazmaz, ekler.

### Template Sistemi

Section'ları template olarak kaydedip daha sonra kullanabilirsiniz.

**Template Kaydetme:**
```typescript
// UI üzerinden (gelecekte eklenecek)
// Şimdilik programatik olarak:
createSectionTemplate(sectionId, "Auth API Template");
```

**Template Yükleme:**
```typescript
loadSectionFromTemplate("Auth API Template");
```

**Kullanım Senaryoları:**
- Standart API yapıları oluşturma
- Hızlı setup
- Best practice'leri paylaşma

### Kopyalama İşlemleri

#### Section Kopyalama

Tüm section'ı kopyalayın (endpoint'ler ve senaryolar dahil).

**Kullanım:**
- Section görünümünde "Kopyala" butonu

#### Endpoint Kopyalama

Belirli bir endpoint'i kopyalayın.

**Kullanım:**
- Endpoint içinde "Kopyala" butonu

#### Senaryo Kopyalama

Belirli bir senaryoyu kopyalayın.

**Kullanım:**
- Senaryo satırında "📋" butonu

---

## 🎨 Kullanıcı Arayüzü

### Chrome Tarzı Sekmeler

- Her section bir sekme olarak gösterilir
- Sadece aktif section görünür
- Sekme üzerinde "×" ile kapatılabilir
- Sekme ismine tıklayarak geçiş yapılabilir

### Dark Theme

- Göz dostu karanlık tema
- Yüksek kontrast
- Modern görünüm

### Responsive Tasarım

- Tüm ekran boyutlarına uyumlu
- Mobil cihazlarda çalışır
- Touch-friendly butonlar

---

## 🚀 Gelişmiş Özellikler

### Toplu İşlemler

#### Toplu Senaryo Silme

```typescript
bulkRemoveScenarios(sectionId, endpointId, [
  "scenario-1",
  "scenario-2",
  "scenario-3"
]);
```

#### Toplu Endpoint Silme

```typescript
bulkRemoveEndpoints(sectionId, [
  "endpoint-1",
  "endpoint-2"
]);
```

### Test Sonuçları

#### Detaylı Sonuç Bilgisi

Her test sonucu şunları içerir:

```typescript
{
  scenarioId: "scenario-123",
  status: "pass" | "fail" | "pending",
  actualStatus: 200,
  responseTime: 245,  // milliseconds
  responseBody: "{...}",
  responseHeaders: {...},
  retryCount: 0,
  errorMessage: undefined,
  startedAt: 1234567890,
  finishedAt: 1234568135
}
```

#### Sonuçları Temizleme

```typescript
resetResultsForSection(sectionId);
```

### Performans Optimizasyonu

- Lazy loading
- Memoization
- Efficient state updates

---

## 💡 İpuçları ve Best Practices

### 1. Section Organizasyonu

- Her environment için ayrı section (dev, staging, prod)
- Her servis için ayrı section
- İlgili endpoint'leri gruplandırın

### 2. Senaryo İsimlendirme

- Açıklayıcı isimler kullanın: `200 OK - Valid User`
- Status code'u isimde belirtin: `401 Unauthorized - Missing Token`
- Senaryo türünü belirtin: `Happy Path`, `Error Case`

### 3. Test Ayarları

- Production testleri için timeout'u artırın
- Flaky testler için retry mekanizması kullanın
- Validation'ı kritik endpoint'lerde kullanın

### 4. Veri Yönetimi

- Düzenli olarak export yapın
- Template'leri yaygın kullanın
- Versiyon kontrol için export'ları commit edin

---

## ❓ Sık Sorulan Sorular

### Test sonuçları nerede saklanıyor?

Test sonuçları localStorage'da saklanır ve otomatik olarak kaydedilir.

### Export edilen dosya formatı nedir?

JSON formatındadır ve tüm section verilerini içerir.

### Aynı anda birden fazla test çalıştırabilir miyim?

Evet, "Run All" ile tüm testler sırayla çalıştırılır. Paralel çalıştırma gelecek versiyonlarda eklenecektir.

### CORS hatası alıyorum, ne yapmalıyım?

Backend'inizde CORS ayarlarını kontrol edin veya development için CORS'u geçici olarak devre dışı bırakın.

---

Sonraki: [API Referansı](./api-reference.md) →

