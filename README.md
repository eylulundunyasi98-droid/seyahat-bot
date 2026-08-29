# 🌍 Global Seyahat Fırsat Botu

Telegram + Cloudflare Workers + D1 + Travelpayouts ile **dünya genelinde** çalışan, para kazandıran seyahat botu.

**Bot:** [@avcisi_firsat_bot](https://t.me/avcisi_firsat_bot) • **Worker:** `https://seyahat-bot.eylulundunyasi98.workers.dev` • **Kanal:** `-1004391209534`

---

## ✨ Özellikler

| # | Özellik | Açıklama | API |
|---|---------|----------|-----|
| 1 | **Global Şehir Kodlayıcı** | 200+ şehir Türkçe/İngilizce → IATA (IST, NYC, TYO) | Travelpayouts |
| 2 | **Çoklu Dil** | `/dil` → TR/EN/DE, otomatik algılama | D1 `users.language_code` |
| 3 | **Para Birimi** | `/para TRY\|USD\|EUR\|GBP` anlık kur çevirimi | open.er-api.com |
| 4 | **Reply Keyboard Menü** | `/start` → 12 butonlu ana menü | Telegram |
| 5 | **Fiyat Grafiği** | `/grafik İstanbul - Paris` → QuickChart 30 gün | QuickChart.io + D1 `price_history` |
| 6 | **Hava + Kur Kartı** | `/hava Paris` → 3 gün tahmin + kur + otel | Open-Meteo + ExchangeRate |
| 7 | **Sesli Komut** | Sesli mesaj → Whisper → rota parse | OpenAI Whisper + Telegram getFile |
| 8 | **Viral Paylaşım** | `📢 Arkadaşlara Gönder` inline switch | Telegram forwardMessage |
| 9 | **Günün Bombası** | Her gün 09:00 kanala görsel+buton | Cron `0 9 * * *` |
| 10 | **Alternatif Rota** | Şehir yazınca en ucuz 5 alternatif | Travelpayouts |
| 11 | **Fiyat Alarmı** | `/takip Rota - Fiyat` + 6 saatte kontrol | Cron `0 */6 * * *` |
| 12 | **Çoklu Marka** | Aviasales / Booking / RentalCars / Klook | Travelpayouts Links API |

---

## 📁 Dosya Yapısı

```
seyahat-bot/
├── src/
│   ├── index.ts       # Worker fetch + scheduled handler
│   ├── telegram.ts    # sendMessage/Photo/Voice/Invoice/forward + keyboards
│   ├── api.ts         # Travelpayouts, Open-Meteo, ExchangeRate, QuickChart, Whisper
│   ├── db.ts          # D1 sorguları (users, favorites, price_history, alerts...)
│   ├── commands.ts    # /start, /takip, /grafik, /hava, sesli, inline_query
│   ├── cron.ts        # checkPriceAlerts + sendDailyDigest
│   └── constants.ts   # CHANNEL_ID, GLOBAL_TRENDING_ROUTES
├── migrations/
│   └── 0001_initial_schema.sql
├── .github/workflows/
│   ├── cron.yml       # 6 saatte bir fiyat kontrolü (GitHub Actions)
│   └── deploy.yml     # push → wrangler deploy
├── wrangler.toml
├── package.json
└── README.md
```

---

## 🗄️ D1 Şeması

`migrations/0001_initial_schema.sql` otomatik oluşturur:

- `users(user_id PK, username, first_name, language_code, currency, is_premium)`
- `favorites(id, user_id, route, origin_code, destination_code, target_price)`
- `price_history(id, route, price, currency, checked_at)` → grafik
- `price_alerts(id, user_id, route, target_price, currency, is_triggered)`
- `daily_coupons(id, route, price, flight_link, ...)`
- `voice_requests(id, user_id, file_id, transcript, parsed_route, success)`
- `subscriptions`, `shares`, `translations_cache`

---

## 🚀 Kurulum

### 1. Cloudflare Login
```bash
npm install -g wrangler
wrangler login
# veya API token ile:
export CLOUDFLARE_API_TOKEN=YOUR_CLOUDFLARE_API_TOKEN
```

### 2. D1 Tablolarını Oluştur
```bash
npx wrangler d1 execute travel_db --remote --file=./migrations/0001_initial_schema.sql
```

### 3. Secrets Ekle
```bash
npx wrangler secret put TELEGRAM_BOT_TOKEN
# → YOUR_TELEGRAM_BOT_TOKEN

npx wrangler secret put TRAVELPAYOUTS_API_TOKEN
# → YOUR_TRAVELPAYOUTS_TOKEN

npx wrangler secret put TRAVELPAYOUTS_MARKER
# → YOUR_MARKER (örn: seyahat)

npx wrangler secret put OPENAI_API_KEY
# → (opsiyonel, sesli komut için) sk-...
```

### 4. Deploy
```bash
npm install --legacy-peer-deps
npx wrangler deploy
# → https://seyahat-bot.eylulundunyasi98.workers.dev
```

### 5. Webhook Ayarla
Tarayıcıda aç:
```
https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_TOKEN>/setWebhook?url=https://seyahat-bot.eylulundunyasi98.workers.dev
```
Kontrol:
```
https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_TOKEN>/getWebhookInfo
```

### 6. GitHub Secrets (Actions için)
Repo → Settings → Secrets and variables → Actions → New secret:

| Name | Value |
|------|-------|
| `TELEGRAM_BOT_TOKEN` | `YOUR_TELEGRAM_BOT_TOKEN` |
| `TRAVELPAYOUTS_API_TOKEN` | `YOUR_TRAVELPAYOUTS_TOKEN` |
| `TRAVELPAYOUTS_MARKER` | `YOUR_MARKER` |
| `CLOUDFLARE_API_TOKEN` | `YOUR_CLOUDFLARE_API_TOKEN` |
| `CLOUDFLARE_ACCOUNT_ID` | `YOUR_ACCOUNT_ID` |
| `OPENAI_API_KEY` | `sk-...` (opsiyonel) |

---

## 🧪 Test

```bash
# Health check
curl https://seyahat-bot.eylulundunyasi98.workers.dev/health

# Webhook simülasyonu
curl -X POST https://seyahat-bot.eylulundunyasi98.workers.dev \
  -H "Content-Type: application/json" \
  -d '{"message":{"chat":{"id":123},"from":{"id":123,"language_code":"tr"},"text":"/start"}}'

# Manuel cron (yetkili)
curl -X GET "https://seyahat-bot.eylulundunyasi98.workers.dev/cron?type=alerts" \
  -H "Authorization: Bearer YOUR_TELEGRAM_BOT_TOKEN"
```

Bot komutları:
- `/start` → Menü
- `İstanbul - Paris` → Görsel + 4 buton (uçuş/otel/araç/aktivite) + paylaş
- `Paris` → Hava 3 gün + kur + otel
- `/grafik İstanbul - Paris` → QuickChart grafiği
- `/hava Tokyo` → Open-Meteo
- `/kur` → EUR/TRY/USD/GBP
- `/dil` → TR/EN/DE
- `/para USD` → Para birimi değiştir
- `/takip İstanbul - Paris - 1000 TL` → Alarm kur
- Sesli mesaj: "Yarın İstanbul'dan Roma'ya kaç para?" → Otomatik parse
- Inline: `@avcisi_firsat_bot Istanbul - Paris` → Viral paylaşım

---

## ⏰ Cron

- **Cloudflare Cron Trigger** (`wrangler.toml`): `["0 */6 * * *", "0 9 * * *"]`
  - `0 */6 * * *` → `checkPriceAlerts()` + `saveHistoryForFavorites()`
  - `0 9 * * *` → `sendDailyDigest()` → kanala `🔥 GÜNÜN BOMBASI`
- **GitHub Actions** (`.github/workflows/cron.yml`): yedek, 6 saatte bir worker `/cron` endpointini tetikler.

---

## 🔐 Güvenlik

- Tüm token'lar `wrangler secret` ile şifreli, koda gömülü değil
- `try/catch` + log, hata durumunda kullanıcıya `⚠️` mesajı
- Rota doğrulama: `getCityCode() === 'ANY'` ise uyarı
- D1 `INSERT OR IGNORE/REPLACE`, SQL injection korumalı `prepare().bind()`

---

## 🌍 Dünya Geneli

- Şehir kodlayıcı 200+ şehir, Türkçe karakter normalize (`ı→i, ğ→g`)
- `getCityCoords()` → Open-Meteo için lat/lon
- Para birimi çevirimi `open.er-api.com`
- Dil algılama `message.from.language_code`

Örnekler: `New York - Tokyo`, `Berlin - Dubai`, `Londra - Sidney` hepsi çalışır.

---

## 📦 Deploy

`git push` → `.github/workflows/deploy.yml` → `cloudflare/wrangler-action@v3` otomatik deploy.

Manuel:
```bash
npx wrangler deploy
```

---

## 🆘 Sorun Giderme

- `Unauthorized is not valid JSON` → Travelpayouts token/marker kontrol et, `createAffiliateLink` fallback URL döndürür
- `D1_ERROR` → `migrations/0001_initial_schema.sql` yeniden çalıştır
- Sesli çalışmıyor → `OPENAI_API_KEY` secret ekle, yoksa metin yaz
- Kanal mesajı gitmiyor → Botu kanala **admin** olarak ekle

---

## 📄 Lisans

MIT — Özgürce kullan, affiliate gelir senin! 💰
