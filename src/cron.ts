import { Env } from './index';
import { getFavorites } from './db';
import { sendTelegram } from './telegram';

// Bu dosya GitHub Actions'da çalışacak, Cloudflare Worker değil.
// Bu yüzden D1'e doğrudan bağlanamaz, Cloudflare Worker üzerinden HTTP isteğiyle veri alır.
// Basitçe: Fiyatları kontrol edip Telegram mesajı gönderir.

async function run(env: Env) {
  const favorites = await getFavorites(env);
  for (const fav of favorites as any[]) {
    // Fiyat kontrolü yap (Aviasales API vb.)
    // Şimdilik sadece örnek mesaj gönderelim
    await sendTelegram(env, fav.user_id, `📢 ${fav.route} rotasında fiyat düşüşü olabilir! Kontrol et.`);
  }
}

// Bu script GitHub Actions'ta çalışacaksa Cloudflare Worker'ın URL'sine istek atmalı.
// Ama şimdilik basit bir örnek.