# Electron Desktop App

Bu proje Electron ile desktop uygulaması olarak build edilebilir.

## Kurulum

```bash
npm install
```

## Geliştirme

Electron ile geliştirme modunda çalıştırmak için:

```bash
npm run electron:dev
```

Bu komut Vite dev server'ı başlatır ve Electron uygulamasını açar.

## Build

### Tüm platformlar için:
```bash
npm run electron:build
```

### Windows için:
```bash
npm run electron:build:win
```

**Önemli:** Windows'ta build ederken, code signing hatası alırsanız (symbolic link hatası), PowerShell'i **Yönetici olarak** çalıştırın veya aşağıdaki çözümü deneyin:

```powershell
# Cache'i temizle
Remove-Item -Path "$env:LOCALAPPDATA\electron-builder\Cache\winCodeSign" -Recurse -Force -ErrorAction SilentlyContinue

# Build'i çalıştır
npm run electron:build:win
```

Alternatif olarak, build'i manuel olarak çalıştırabilirsiniz:

```powershell
$env:CSC_IDENTITY_AUTO_DISCOVERY='false'
npm run build
electron-builder --win --config.win.sign=false --config.win.forceCodeSigning=false
```

### macOS için:
```bash
npm run electron:build:mac
```

### Linux için:
```bash
npm run electron:build:linux
```

Build edilen dosyalar `release/` dizininde bulunur.

## Notlar

- Icon dosyaları `assets/` dizininde olmalıdır (icon.ico, icon.icns, icon.png)
- Electron uygulaması production modunda `dist/` dizinindeki build edilmiş dosyaları kullanır
- Development modunda `http://localhost:5173` adresindeki Vite dev server'ı kullanır
- Windows'ta code signing devre dışı bırakılmıştır (geliştirme amaçlı)

