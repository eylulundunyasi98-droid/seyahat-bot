// src/ui.ts - Tasarım sistemi: tek yerden tüm caption, buton, ton
export const BRAND = {
  name: "Seyahat Fırsat Botu",
  username: "avcisi_firsat_bot",
  channel: "-1004391209534",
  colors: { primary: "#0ea5e9", accent: "#f59e0b", success: "#10b981" },
};

export function welcomeCaption(firstName: string, lang: string = "tr"): string {
  const name = firstName ? `, ${firstName}` : "";
  const tr = `Merhaba${name}! 👋\n\n<b>${BRAND.name}</b>'a hoş geldin.\nDünya genelinde 200+ şehir için en kibar fırsatları hazırladım.\n\n✈️ <b>Ne istersin?</b>\n• <code>İstanbul - Paris</code> yaz → görsel + şeffaf butonlar\n• <code>Paris</code> yaz → hava + kur + otel kartı\n• Sesli gönder → otomatik anlarım\n\n👇 Menüden seç veya direkt yaz, gerisini bana bırak.`;
  const en = `Hello${name}! 👋 Welcome to <b>${BRAND.name}</b>.\nSend <code>London - Paris</code> for deals or <code>Paris</code> for weather+FX.`;
  const de = `Hallo${name}! 👋 Willkommen bei <b>${BRAND.name}</b>.`;
  return lang === "en" ? en : lang === "de" ? de : tr;
}

export function routeCaption(from: string, to: string, currency: string, rateText?: string): string {
  return `✈️ <b>${from} → ${to}</b> için en taze fırsatları buldum${rateText ? `\n${rateText}` : ""}\n\n👇 Aşağıdaki şeffaf butonlarla tek tıkla inceleyebilirsin. Linkler güvenli ve sana özel.\n<i>İpucu: <code>/takip ${from} - ${to} - 1500 ${currency}</code> ile fiyat alarmı kurabilirsin.</i>`;
}

export function weatherCaption(city: string): string {
  return `🌤️ <b>${city}</b> için hazırladığım kart aşağıda. Hava + kur + otel tek yerde.`;
}

export function chartCaption(route: string, min: number, currency: string, lang: string = "tr"): string {
  const tr = `📈 <b>${route}</b> — Son 30 gün\n📉 En düşük: <b>${min} ${currency}</b>\nGrafik sana ne zaman alman gerektiğini kibarca fısıldar.`;
  const en = `📈 <b>${route}</b> — Last 30 days\n📉 Lowest: <b>${min} ${currency}</b>`;
  return lang === "en" ? en : tr;
}

export function alertCaption(route: string, target: number, current: number, currency: string): string {
  return `🚨 <b>Fiyat düştü!</b>\n📍 ${route}\n🎯 Hedefin: <b>${target} ${currency}</b>\n💰 Şimdi: <b>${current} ${currency}</b>\n\nKibar hatırlatma: Bu fırsat hızla tükenebilir.`;
}

export function dailyCaption(route: string, price: number, currency: string, date: string): string {
  return `🔥 <b>GÜNÜN KÜRESEL BOMBASI</b> • ${date}\n\n📍 <b>${route}</b>\n💰 Sadece <b>${price} ${currency}</b> <i>(normal ~${Math.round(price * 1.6)} ${currency})</i>\n\n⏳ Sadece bugün için sakladım. Tek tıkla yakala, sonra bana teşekkür edersin.`;
}

export function helpCaption(lang: string = "tr"): string {
  if (lang === "en") return `📋 <b>Commands</b>\n<code>London - Paris</code> → deals\n<code>/track London - Paris - 500 USD</code>\n<code>/chart London - Paris</code>`;
  if (lang === "de") return `📋 <b>Befehle</b>\n<code>Berlin - Paris</code> → Angebote`;
  return `📋 <b>Yardım</b>\n\n<code>İstanbul - Paris</code> → fırsat ara\n<code>Paris</code> → hava + kur + otel\n<code>/takip Rota - Fiyat</code> → alarm kur\n<code>/grafik Rota</code> → 30 gün grafik\n<code>/hava Şehir</code> → 3 gün tahmin\n<code>/kur</code> → döviz\n\n🎙️ Sesli mesaj da olur, ben anlarım.`;
}

export function politeError(lang: string = "tr"): string {
  const tr = `Hmm, bunu tam anlayamadım. Şöyle deneyelim mi?\n• <code>İstanbul - Paris</code>\n• <code>Paris</code>\n\nYardım için <code>/yardim</code> veya menüden seç. Her zaman buradayım.`;
  const en = `Hmm, I didn't get that. Try <code>London - Paris</code> or <code>Paris</code>`;
  return lang === "en" ? en : tr;
}

export function trackingAdded(route: string, lang: string = "tr"): string {
  return lang === "tr" ? `✅ <b>${route}</b> takibe alındı. Fiyat düşerse ilk sana fısıldayacağım.` : `✅ Tracking <b>${route}</b>`;
}

export const IMAGES = {
  fallback: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800",
  loading: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800",
  error: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800",
};
