# API Test App

React + Vite + TypeScript ile basit API test aracı. Section tabanlı yapı ile her section bir baseUrl altında endpoint ve senaryoları barındırır. "Run All" ile section'daki tüm senaryoları çalıştırabilirsiniz.

## Başlangıç

1. Bağımlılıkları kurun:

```bash
npm install
```

2. Geliştirme sunucusunu başlatın:

```bash
npm run dev
```

3. Tarayıcıdan uygulamayı açın: `http://localhost:5173`

## Kullanım
- Yeni section ekleyin, `name` ve `baseUrl` değerlerini girin (örn: `http://localhost:3123`).
- Section içine endpoint ekleyin (method, name, path).
- Her endpoint için birden fazla senaryo ekleyin (expected status, opsiyonel header ve body).
- "Run All" ile tüm senaryoları; endpoint içinden "Run" ile sadece o endpoint'in senaryolarını çalıştırın.
- Sonuçlar PASS/FAIL rozetleri ve actual status ile görüntülenir.

## Notlar
- CORS kısıtları tarayıcıda istekleri engelleyebilir. Gerekirse test ettiğiniz servislerde CORS ayarlarını açın.
- Body alanına düz metin yazılır. JSON gönderiyorsanız geçerli JSON yazdığınızdan emin olun ve `Content-Type` zaten `application/json` olarak set edilir.

## Scriptler
- `npm run dev` – geliştirme
- `npm run build` – prod derleme
- `npm run preview` – prod derlemesini yerelde görüntüleme
- `npm run lint` – temel lint
