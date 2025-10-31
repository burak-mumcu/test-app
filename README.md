# API Test App

<div align="center">

![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6+-blue.svg)
![React](https://img.shields.io/badge/React-18.3+-61dafb.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

**Modern, güçlü ve esnek API test aracı**

[Kurulum](#-kurulum) • [Hızlı Başlangıç](#-hızlı-başlangıç) • [Dokümantasyon](./docs/SUMMARY.md) • [Özellikler](#-özellikler)

</div>

---

## 📖 Hakkında

API Test App, REST API'lerinizi test etmek için tasarlanmış modern bir web uygulamasıdır. Chrome tarzı sekme sistemi, gelişmiş test özellikleri ve detaylı raporlama ile API testlerinizi kolayca yönetin.

### 🎯 Temel Özellikler

- ✅ **Section Tabanlı Yapı** - Her section bir base URL altında organize edilir
- ✅ **Chrome Tarzı Sekmeler** - Kolay navigasyon ve yönetim
- ✅ **Gelişmiş Test Özellikleri** - Timeout, retry, validation desteği
- ✅ **Detaylı Raporlama** - Performans metrikleri ve analitik
- ✅ **Otomatik Kaydetme** - LocalStorage ile otomatik veri persistance
- ✅ **Import/Export** - JSON formatında veri aktarımı
- ✅ **Toplu İşlemler** - Kopyalama, toplu silme, template sistemi

## 🚀 Kurulum

### Gereksinimler

- Node.js 18+ 
- npm veya yarn

### Adımlar

```bash
# Repository'yi klonlayın
git clone <repository-url>
cd test-app

# Bağımlılıkları kurun
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```

Uygulama `http://localhost:5173` adresinde çalışacaktır.

## 🏃 Hızlı Başlangıç

### 1. İlk Section'ı Oluşturun

1. Uygulamayı açın
2. "Yeni Section" butonuna tıklayın
3. Section adı ve base URL'i girin (örn: `http://localhost:3000`)

### 2. Endpoint Ekleyin

1. Section içinde "Endpoint Ekle" butonuna tıklayın
2. HTTP metodunu seçin (GET, POST, PUT, vb.)
3. Endpoint adı ve path'i girin (örn: `/api/users`)

### 3. Senaryo Ekleyin

1. Endpoint içinde "Senaryo Ekle" butonuna tıklayın
2. Senaryo adı ve beklenen status code'u girin
3. (Opsiyonel) Request headers ve body ekleyin

### 4. Testleri Çalıştırın

- **Run All**: Section'daki tüm testleri çalıştırır
- **Run**: Sadece o endpoint'in testlerini çalıştırır

Sonuçlar anında görüntülenir ve localStorage'a otomatik kaydedilir.

## ✨ Özellikler

### 🔧 Test Yönetimi

- **Timeout Ayarları**: Her senaryo için özelleştirilebilir timeout
- **Retry Mekanizması**: Başarısız istekleri otomatik tekrar dene
- **Response Validation**: Body ve header doğrulama
- **Performans Ölçümü**: Response time tracking

### 📊 Raporlama ve Analitik

- **Test Raporu**: Detaylı başarı/başarısızlık analizi
- **Performans Metrikleri**: Ortalama, en hızlı, en yavaş response time
- **Başarı Oranı**: Test başarı yüzdesi
- **Endpoint Bazlı Raporlar**: Her endpoint için detaylı analiz

### 💾 Veri Yönetimi

- **Otomatik Kaydetme**: Tüm değişiklikler otomatik kaydedilir
- **JSON Export/Import**: Verileri dışa/içe aktarma
- **Template Sistemi**: Section'ları template olarak kaydetme
- **Kopyalama**: Section, endpoint ve senaryo kopyalama

### 🎨 Kullanıcı Arayüzü

- **Chrome Tarzı Sekmeler**: Kolay navigasyon
- **Responsive Tasarım**: Tüm ekran boyutlarına uyumlu
- **Dark Theme**: Göz dostu karanlık tema
- **Intuitive UX**: Kullanımı kolay arayüz

## 📚 Dokümantasyon

Detaylı dokümantasyon için [docs](./docs/SUMMARY.md) klasörüne bakın:

- [Hızlı Başlangıç](./docs/getting-started.md)
- [Özellikler ve Kullanım](./docs/features.md)
- [API Referansı](./docs/api-reference.md)
- [Gelişmiş Kullanım](./docs/advanced-usage.md)
- [Mimari ve Geliştirme](./docs/architecture.md)

## 🛠️ Geliştirme

### Proje Yapısı

```
src/
├── components/      # React bileşenleri
├── hooks/          # Custom React hooks
├── services/        # İş mantığı servisleri
├── store/          # Zustand state yönetimi
├── types/          # TypeScript tip tanımları
└── utils/          # Yardımcı fonksiyonlar
```

### Scriptler

```bash
npm run dev      # Geliştirme sunucusu
npm run build    # Production build
npm run preview  # Build önizleme
npm run lint     # Lint kontrolü
```

### Mimari

Proje SOLID prensiplerine uygun olarak tasarlanmıştır:

- **Single Responsibility**: Her modül tek bir sorumluluğa sahip
- **Open/Closed**: Interface'ler üzerinden genişletilebilir
- **Liskov Substitution**: Interface implementasyonları değiştirilebilir
- **Interface Segregation**: Küçük, özelleşmiş interface'ler
- **Dependency Inversion**: Abstraction'lara bağımlılık

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! Lütfen:

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](./LICENSE) dosyasına bakın.

## 🙏 Teşekkürler

- React ve TypeScript topluluğuna
- Tüm açık kaynak kütüphanelerin geliştiricilerine

---

<div align="center">

**Yıldız vermeyi unutmayın ⭐**

[⬆ Yukarı Çık](#api-test-app)

</div>
