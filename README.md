# Mİ Hotel Boutique

Mİ Hotel Boutique için hazırlanmış çok sayfalı tanıtım ve rezervasyon sitesi.

## Gereksinimler

- Node.js `>=22.13.0`
- npm

## Yerel geliştirme

```bash
npm install
npm run dev
```

Site varsayılan olarak `http://localhost:3000` adresinde çalışır.

## Kontrol

```bash
npm test
```

Bu komut üretim derlemesini alır ve ana sayfalar için sunucu tarafı render testlerini çalıştırır.

## Performans ve üretim sunucusu

`npm run build` statik CSS/JavaScript için sıkıştırılmış kopyalar üretir.
`npm start` (Vinext) istemcinin `Accept-Encoding` başlığına göre bunları sunar.
Nginx gibi bir katman statik dosyaları doğrudan sunuyorsa bu katmanda da gzip/Brotli
ve `Vary: Accept-Encoding` ayarları ayrıca doğrulanmalıdır.

Ana sayfa için optimize edilmiş görseller `public/images/home-v1`, videolar
`public/videos/optimized-v1` altındadır. Yayımlandıktan sonra dosya içeriği
değiştirilecekse dizin sürümü de artırılmalıdır.
Orijinal fotoğraf ve videolar korunur. Üretim tarifleri:

- `node scripts/prepare-home-assets.mjs` — Sharp ile ana sayfa görsel varyantları.
- `node scripts/prepare-hero-videos.mjs` — Haricî FFmpeg/libx264 ile video kopyaları;
  var olan çıktıları ezmez. Gerekirse `FFMPEG_BINARY` ile çalıştırılabilir dosya seçilir.

Ana sayfa ilk olarak yüksek öncelikli WebP görseli gösterir; video bu görsel
yüklendikten sonra başlar. Veri tasarrufu, çok yavaş bağlantı veya azaltılmış
hareket tercihinde otomatik oynatma yapılmaz; oynat düğmesi kullanılabilir.
Canlı destek sağlayıcısı yalnızca sohbet düğmesiyle etkileşimde yüklenir.
Canlı PageSpeed sonuçları, bu değişiklikler yayımlandıktan sonra yeniden ölçülmelidir.

Mevcut Vinext sürümü public dosyalarını bir saat önbellekler. `next.config.ts`
üzerinden eklenen Cache-Control kuralı bu sürümde varsayılan başlıkla birleşip
çelişen iki `max-age` ürettiği için kullanılmıyor. Sürüm numaralı bu iki dizin için
daha uzun önbellek istenirse üretim reverse proxy/CDN katmanında mevcut Cache-Control
başlığı **değiştirilmelidir**, yanına ikinci bir başlık eklenmemelidir. Bu ayar
yerel kod değişikliğiyle canlı sunucuya uygulanmaz.

## Sayfalar

- `/` — Ana sayfa ve rezervasyon widget'ı
- `/odalar` — Eco, Double, Triple ve Aile Odası
- `/hakkimizda` — Otel yaklaşımı ve hizmetler
- `/konum-iletisim` — Konaklama bilgileri ve daha sonra tamamlanacak iletişim alanı

Rezervasyon işlemleri `mi-hotel-boutique.rezervasyonal.com` adresindeki resmî sistemde tamamlanır.
