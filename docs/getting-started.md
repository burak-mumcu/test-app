# 🚀 Hızlı Başlangıç

Bu kılavuz, API Test App'i kurmak ve ilk testlerinizi çalıştırmak için gereken tüm adımları içerir.

## Kurulum

### Gereksinimler

API Test App'i çalıştırmak için aşağıdakiler gereklidir:

- **Node.js** 18.0 veya üzeri
- **npm** 9.0 veya üzeri (veya yarn/pnpm)
- Modern bir web tarayıcısı (Chrome, Firefox, Edge, Safari)

### Adım 1: Repository'yi Klonlayın

```bash
git clone <repository-url>
cd test-app
```

### Adım 2: Bağımlılıkları Kurun

```bash
npm install
```

Bu komut tüm gerekli paketleri yükler:
- React 18.3
- TypeScript 5.6
- Vite 5.4
- Zustand 4.5

### Adım 3: Geliştirme Sunucusunu Başlatın

```bash
npm run dev
```

Uygulama varsayılan olarak `http://localhost:5173` adresinde çalışacaktır.

### Adım 4: Tarayıcıda Açın

Tarayıcınızda `http://localhost:5173` adresine gidin. Ana ekranı görmelisiniz.

## İlk Testinizi Oluşturun

### 1. Section Oluşturma

1. Ana ekranda **"Yeni Section"** butonuna tıklayın
2. Yeni sekme oluşturulacaktır
3. Section adını girin (örn: `Auth Service`)
4. Base URL'i girin (örn: `http://localhost:3000`)

> 💡 **İpucu**: Base URL, tüm endpoint'lerinizin temel adresidir. Path'ler bu URL'e eklenecektir.

### 2. Endpoint Ekleme

1. Section içinde **"Endpoint Ekle"** butonuna tıklayın
2. HTTP metodunu seçin (GET, POST, PUT, PATCH, DELETE)
3. Endpoint adını girin (örn: `Get Users`)
4. Path'i girin (örn: `/api/users`)

> 💡 **Not**: Path `/` ile başlamalıdır. Base URL otomatik olarak eklenir.

### 3. Senaryo Oluşturma

1. Endpoint içinde **"Senaryo Ekle"** butonuna tıklayın
2. Senaryo adını girin (örn: `200 OK`)
3. Beklenen status code'u girin (örn: `200`)
4. (Opsiyonel) Request headers ekleyin:
   - Format: `Header-Name: value, Another-Header: value`
   - Örnek: `Authorization: Bearer token123, X-API-Key: key456`
5. (Opsiyonel) Request body ekleyin (JSON formatında)

### 4. Test Çalıştırma

#### Tek Endpoint Testi

1. Endpoint'in yanındaki **"Run"** butonuna tıklayın
2. Senaryolar sırayla çalıştırılacaktır
3. Sonuçlar anında görüntülenecektir:
   - ✅ **PASS**: Test başarılı
   - ❌ **FAIL**: Test başarısız
   - ⏳ **PENDING**: Test henüz çalıştırılmadı

#### Tüm Testleri Çalıştırma

1. Section içinde **"Run All"** butonuna tıklayın
2. Section'daki tüm endpoint'ler ve senaryolar çalıştırılacaktır

## Sonuçları İnceleme

### Senaryo Sonuçları

Her senaryo için şu bilgiler gösterilir:

- **Status**: PASS, FAIL veya PENDING
- **Actual Status**: Gerçek HTTP status code
- **Response Time**: Yanıt süresi (milisaniye)
- **Error Message**: Hata varsa detaylı mesaj

### Rapor Görüntüleme

1. Section içinde **"Raporu Göster"** butonuna tıklayın
2. Detaylı test raporu görüntülenecektir:
   - Toplam test sayısı
   - Başarılı/başarısız sayıları
   - Başarı oranı
   - Performans metrikleri
   - Endpoint bazlı detaylar

## Veri Yönetimi

### Otomatik Kaydetme

Tüm değişiklikler otomatik olarak localStorage'a kaydedilir:
- Section'lar
- Endpoint'ler
- Senaryolar
- Test sonuçları

Sayfayı yenilediğinizde tüm verileriniz korunur.

### Export İşlemi

1. Section içinde **"Export"** butonuna tıklayın
2. JSON dosyası indirilecektir
3. Bu dosya tüm section verilerini içerir

### Import İşlemi

1. Ana ekranda **"Import"** butonuna tıklayın
2. Önceden export ettiğiniz JSON dosyasını seçin
3. Veriler yüklenecektir

## Gelişmiş Özellikler

### Test Ayarları

Her senaryo için gelişmiş ayarlar yapabilirsiniz:

1. Senaryo satırında **"⚙️ Test Ayarları"** butonuna tıklayın
2. Şu ayarları yapabilirsiniz:
   - **Timeout**: Request timeout süresi (ms)
   - **Retry Sayısı**: Başarısız istekler için tekrar sayısı
   - **Retry Gecikme**: Tekrarlar arası bekleme süresi (ms)
   - **Response Body Validation**: Response body doğrulama
   - **Response Header Validation**: Response header doğrulama

### Kopyalama İşlemleri

- **Section Kopyalama**: Section içinde "Kopyala" butonu
- **Endpoint Kopyalama**: Endpoint içinde "Kopyala" butonu
- **Senaryo Kopyalama**: Senaryo satırında "📋" butonu

Kopyalanan öğeler "(Kopya)" ekiyle işaretlenir.

## Sorun Giderme

### CORS Hatası

Eğer test ettiğiniz API CORS hatası veriyorsa:

1. Backend'inizde CORS ayarlarını kontrol edin
2. Geliştirme için CORS middleware ekleyin
3. Veya browser extension kullanarak CORS'u devre dışı bırakın (sadece geliştirme için)

### Timeout Hatası

Timeout hatası alıyorsanız:

1. Senaryo ayarlarından timeout süresini artırın
2. API'nizin yanıt süresini kontrol edin
3. Network bağlantınızı kontrol edin

### Import/Export Sorunları

JSON dosyası import edilemiyorsa:

1. Dosya formatını kontrol edin (geçerli JSON olmalı)
2. Dosyanın boş olmadığından emin olun
3. Browser console'da hata mesajlarını kontrol edin

## Sonraki Adımlar

Artık temel kullanımı öğrendiniz! Şunları deneyebilirsiniz:

- [Gelişmiş Özellikler](./advanced-usage.md) kılavuzuna bakın
- [API Referansı](./api-reference.md) ile detaylı bilgi edinin
- [Mimari](./architecture.md) hakkında bilgi alın

---

**Hazırsınız!** 🎉 İlk API testlerinizi çalıştırmaya başlayabilirsiniz.

