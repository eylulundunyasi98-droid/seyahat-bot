// src/commands.ts - Tüm komut işleyicileri (kibar + şeffaf + görsel)
import { Env } from './index';
import {
  sendTelegram,
  sendPhoto,
  sendToChannel,
  sendChatAction,
  createTravelKeyboard,
  createSingleButtonKeyboard,
  createMainMenuKeyboard,
  createLanguageKeyboard,
  createCurrencyKeyboard,
  createInlineKeyboard,
  createExploreKeyboard,
  answerCallbackQuery,
  getFile,
} from './telegram';
import * as UI from './ui';
import {
  getCityCode,
  getCityCoords,
  searchFlights,
  getHotelLink,
  getCarLink,
  getActivitiesLink,
  getTrendingDestinations,
  getCheapestDatesLink,
  getDestinationImage,
  getPriceChartUrl,
  getWeather,
  formatWeather,
  getExchangeRate,
  getAllExchangeRates,
  formatCurrency,
  transcribeVoice,
  parseVoiceRoute,
} from './api';
import { CHANNEL_ID } from './constants';
import * as DB from './db';

// Çeviri sözlüğü
const t: Record<string, Record<string, string>> = {
  welcome: {
    tr: `👋 Merhaba! <b>Global Seyahat Fırsat Botu</b>'na hoş geldin!\n\n🌍 <b>Dünya genelinde</b> 200+ şehir, 4 para birimi ve 3 dil desteği ile hizmet veriyorum.\n\n🔍 <b>Ne yapabilirim?</b>\n• Rota yaz: <code>İstanbul - Paris</code> → Görsel + butonlu fırsatlar\n• Şehir yaz: <code>Paris</code> → Hava + kur + otel önerisi\n• Takip et: <code>/takip İstanbul - Paris - 1000 TL</code>\n• Grafik: <code>/grafik İstanbul - Paris</code>\n• Trend: <code>/trending</code>\n\n👇 Aşağıdaki menüden seç veya direkt yaz!`,
    en: `👋 Hello! Welcome to <b>Global Travel Deals Bot</b>!\n\n🌍 I support 200+ cities, 4 currencies and 3 languages worldwide.\n\n🔍 <b>What can I do?</b>\n• Type route: <code>Istanbul - Paris</code>\n• City: <code>Paris</code> → Weather + FX + hotels\n• Track: <code>/track Istanbul - Paris - 1000 USD</code>\n• Chart: <code>/chart Istanbul - Paris</code>\n\n👇 Choose from menu!`,
    de: `👋 Hallo! Willkommen beim <b>Global Travel Bot</b>!\n\n🌍 Weltweit 200+ Städte, 4 Währungen, 3 Sprachen.\n\n🔍 <b>Was kann ich?</b>\n• Route: <code>Berlin - Paris</code>\n• Stadt: <code>Paris</code> → Wetter + Währung\n\n👇 Wähle aus dem Menü!`,
  },
  help: {
    tr: `📋 <b>Komutlar:</b>\n\n<code>İstanbul - Paris</code> → Rota ara (görsel+buton)\n<code>Paris</code> → Hava + kur + otel\n<code>/takip Rota - Fiyat</code> → Alarm kur\n<code>/grafik Rota</code> → Son 30 gün fiyat grafiği\n<code>/hava Şehir</code> → 3 günlük tahmin\n<code>/kur</code> → Döviz kurları\n<code>/dil</code> → Dil değiştir\n<code>/para TRY|USD|EUR|GBP</code> → Para birimi\n<code>/trending</code> → Popüler rotalar\n<code>/favorilerim</code> → Kayıtlı rotalar\n<code>/ayarlar</code> → Dil & para ayarları\n\n🎙️ Sesli mesaj da gönderebilirsin!`,
    en: `📋 <b>Commands:</b>\n\n<code>Istanbul - Paris</code> → Search route\n<code>/track Route - Price</code> → Set alert\n<code>/chart Route</code> → Price chart\n<code>/weather City</code> → Forecast\n`,
    de: `📋 <b>Befehle:</b>\n\n<code>Berlin - Paris</code> → Route suchen\n`,
  },
  unknown: {
    tr: `Komut anlaşılmadı. <code>/yardim</code> yaz veya menüden seç.`,
    en: `Unknown command. Type <code>/help</code>.`,
    de: `Unbekannter Befehl. <code>/hilfe</code> eingeben.`,
  },
};

function getLang(user: any, fallback: string = 'tr'): string {
  return user?.language_code?.slice(0, 2) || user?.lang || fallback;
}

function parseTakip(text: string): { route: string; price: number | null; currency: string } {
  // "/takip İstanbul - Paris - 1000 TL"  -> route="İstanbul - Paris", price=1000, currency="TRY"
  let raw = text.replace(/^\/(takip|track)\s*/i, '').trim();
  let currency = 'TRY';
  const m = raw.match(/(\d+(?:[.,]\d+)?)\s*(TL|TRY|USD|\$|EUR|€|GBP|£)/i);
  let price: number | null = null;
  if (m) {
    price = parseFloat(m[1].replace(',', '.'));
    const c = m[2].toUpperCase();
    if (c === 'TL' || c === 'TRY') currency = 'TRY';
    else if (c === '$' || c === 'USD') currency = 'USD';
    else if (c === '€' || c === 'EUR') currency = 'EUR';
    else if (c === '£' || c === 'GBP') currency = 'GBP';
    raw = raw.replace(m[0], '').replace(/-+$/, '').trim();
  }
  raw = raw.replace(/\s*-\s*$/, '').trim();
  return { route: raw, price, currency };
}

export async function handleMessage(message: any, env: Env): Promise<void> {
  const chatId: number = message.chat.id;
  const text: string = (message.text ?? '').trim();
  const userLangRaw = message.from?.language_code?.slice(0, 2) || 'tr';
  const normalizedLang = ['tr', 'en', 'de'].includes(userLangRaw) ? userLangRaw : 'tr';

  try {
    await sendChatAction(env, chatId, 'typing');
    // Kullanıcıyı kaydet/güncelle
    await DB.upsertUser(env, {
      user_id: chatId,
      username: message.from?.username,
      first_name: message.from?.first_name,
      last_name: message.from?.last_name,
      language_code: normalizedLang,
    });

    const dbUser = await DB.getUser(env, chatId);
    const lang = getLang(dbUser, normalizedLang);
    const currency = dbUser?.currency || 'TRY';

    // === SESLI MESAJ ===
    if (message.voice) {
      await handleVoiceMessage(message, env, chatId, lang);
      return;
    }

    // === MENÜ BUTONLARI (Reply Keyboard) ===
    if (handleMenuButtons(text, env, chatId, lang, currency)) return;

    // === KOMUTLAR ===
    if (text.startsWith('/start')) {
      await sendTelegram(env, chatId, UI.welcomeCaption(message.from?.first_name || '', lang), createMainMenuKeyboard(lang));
      return;
    }
    if (text.startsWith('/help') || text.startsWith('/yardim') || text.startsWith('/hilfe')) {
      await sendTelegram(env, chatId, UI.helpCaption(lang), createMainMenuKeyboard(lang));
      return;
    }
    if (text.startsWith('/dil') || text.startsWith('/lang') || text.startsWith('/sprache')) {
      await sendTelegram(env, chatId, `🌐 Dil seç / Choose language / Sprache wählen:`, createLanguageKeyboard());
      return;
    }
    if (text.startsWith('/para') || text.startsWith('/currency') || text.startsWith('/waehrung')) {
      const arg = text.split(/\s+/)[1]?.toUpperCase();
      if (arg && ['TRY', 'USD', 'EUR', 'GBP'].includes(arg)) {
        await DB.updateUserCurrency(env, chatId, arg);
        await sendTelegram(env, chatId, `✅ Para birimi <b>${arg}</b> olarak ayarlandı.`, createMainMenuKeyboard(lang));
      } else {
        await sendTelegram(env, chatId, `💱 Para birimi seç / Select currency:`, createCurrencyKeyboard());
      }
      return;
    }
    if (text.startsWith('/takip') || text.startsWith('/track')) {
      const { route, price, currency: c } = parseTakip(text);
      if (!route || !route.includes('-')) {
        await sendTelegram(env, chatId, lang === 'tr' ? `Kullanım: <code>/takip İstanbul - Paris - 1000 TL</code>` : `Usage: <code>/track Istanbul - Paris - 1000 USD</code>`);
        return;
      }
      if (price) {
        await DB.addPriceAlert(env, chatId, route, price, c);
      }
      await DB.addFavorite(env, chatId, route, price || undefined);
      await sendTelegram(env, chatId, UI.trackingAdded(route, lang) + (price ? ` (hedef: ${formatCurrency(price, c, lang)})` : ''));
      try { await sendToChannel(env, `🔔 <b>Yeni takip:</b> ${route}${price ? ` - ${price} ${c}` : ''} (user: ${chatId})`); } catch {}
      return;
    }
    if (text.startsWith('/grafik') || text.startsWith('/chart')) {
      const route = text.replace(/^\/(grafik|chart)\s*/i, '').trim();
      if (!route || !route.includes('-')) {
        await sendTelegram(env, chatId, lang === 'tr' ? `Kullanım: <code>/grafik İstanbul - Paris</code>` : `Usage: <code>/chart Istanbul - Paris</code>`);
        return;
      }
      await handlePriceChart(env, chatId, route, lang, currency);
      return;
    }
    if (text.startsWith('/hava') || text.startsWith('/weather') || text.startsWith('/wetter')) {
      const city = text.replace(/^\/(hava|weather|wetter)\s*/i, '').trim();
      if (!city) {
        await sendTelegram(env, chatId, lang === 'tr' ? `Kullanım: <code>/hava Paris</code>` : `Usage: <code>/weather Paris</code>`);
        return;
      }
      await handleWeatherCard(env, chatId, city, lang, currency);
      return;
    }
    if (text.startsWith('/kur') || text.startsWith('/exchange') || text.startsWith('/kurs')) {
      await handleExchangeCard(env, chatId, lang);
      return;
    }
    if (text.startsWith('/trending') || text.startsWith('/trend')) {
      await handleTrending(env, chatId, lang, currency);
      return;
    }
    if (text.startsWith('/favorilerim') || text.startsWith('/favorites') || text === '⭐ Favori Rotalarım' || text === '⭐ My Favorites') {
      await handleFavorites(env, chatId, lang);
      return;
    }
    if (text.startsWith('/alarmlar') || text === '🔔 Alarmlarım' || text === '🔔 My Alerts') {
      await handleAlerts(env, chatId, lang);
      return;
    }
    if (text.startsWith('/ayarlar') || text.startsWith('/settings') || text === '⚙️ Ayarlar' || text === '⚙️ Settings') {
      await sendTelegram(env, chatId, lang === 'tr' ? `⚙️ <b>Ayarlar</b>\nDil ve para birimini seç:` : `⚙️ <b>Settings</b>`, createLanguageKeyboard());
      await sendTelegram(env, chatId, `💱 Currency:`, createCurrencyKeyboard());
      return;
    }

    // === ROTA ARAMA: "İstanbul - Paris" ===
    if (text.includes('-') && text.length < 80) {
      const [fromRaw, toRaw] = text.split('-').map(s => s.trim());
      if (fromRaw && toRaw && fromRaw.length >= 2 && toRaw.length >= 2) {
        await handleRouteSearch(env, chatId, fromRaw, toRaw, lang, currency);
        return;
      }
    }

    // === TEK ŞEHİR: "Paris" => Hava + Kur + Otel ===
    if (text.length >= 2 && text.length < 30 && !text.includes('/') && !text.includes('http')) {
      const city = text.trim();
      // Eğer şehir kodu varsa, akıllı kart göster
      if (getCityCoords(city) || getCityCode(city) !== 'ANY') {
        await handleWeatherCard(env, chatId, city, lang, currency);
        return;
      }
      // Bilinmeyen şehir: yine dene
      if (/^[a-zA-ZığüşöçİĞÜŞÖÇ\s-]{2,30}$/.test(city)) {
        await handleWeatherCard(env, chatId, city, lang, currency);
        return;
      }
    }

    // Fallback kibar
    await sendTelegram(env, chatId, UI.politeError(lang), createMainMenuKeyboard(lang));
  } catch (e) {
    console.error('handleMessage error', e, text);
    try { await sendTelegram(env, chatId, `⚠️ Bir aksaklık oldu, hemen düzeltiyorum. Lütfen bir kez daha deneyin. /yardim`); } catch {}
  }
}

function handleMenuButtons(text: string, env: Env, chatId: number, lang: string, currency: string): boolean {
  const map: Record<string, () => Promise<void>> = {
    '🧭 Rota Ara': async () => { await sendTelegram(env, chatId, lang === 'tr' ? `✈️ Rota yaz lütfen: <code>İstanbul - Paris</code> veya <code>New York - Tokyo</code>\nÖrnekleri kopyalayıp gönderebilirsin.` : `✈️ Type route`, createExploreKeyboard(lang)); },
    '🧭 Search Route': async () => { await sendTelegram(env, chatId, `✈️ Type route: <code>London - Paris</code>`); },
    '🧭 Route Suchen': async () => { await sendTelegram(env, chatId, `✈️ Route: <code>Berlin - Paris</code>`); },
    '🔥 Günün Bombası': async () => { await handleDailyDeal(env, chatId, lang, currency); },
    "🔥 Today's Deal": async () => { await handleDailyDeal(env, chatId, lang, currency); },
    '🔥 Tagesangebot': async () => { await handleDailyDeal(env, chatId, lang, currency); },
    '🌍 Keşfet': async () => { await sendTelegram(env, chatId, lang === 'tr' ? `🌍 <b>Keşfet</b> — ne yapmak istersin?` : `🌍 Explore`, createExploreKeyboard(lang)); },
    '🌍 Explore': async () => { await sendTelegram(env, chatId, `🌍 Explore`, createExploreKeyboard(lang)); },
    '🌍 Entdecken': async () => { await sendTelegram(env, chatId, `🌍 Entdecken`, createExploreKeyboard(lang)); },
    '⭐ Takip Ettiklerim': async () => { await handleFavorites(env, chatId, lang); },
    '⭐ My Tracking': async () => { await handleFavorites(env, chatId, lang); },
    '⭐ Meine Routen': async () => { await handleFavorites(env, chatId, lang); },
    '⚙️ Ayarlar': async () => { await sendTelegram(env, chatId, lang === 'tr' ? `⚙️ <b>Ayarlar</b> — dil ve para birimini seç:` : `⚙️ Settings`, createLanguageKeyboard()); setTimeout(()=> sendTelegram(env, chatId, `💱`, createCurrencyKeyboard()), 400); },
    '⚙️ Settings': async () => { await sendTelegram(env, chatId, `⚙️ Settings`, createLanguageKeyboard()); },
    '⚙️ Einstellungen': async () => { await sendTelegram(env, chatId, `⚙️ Einstellungen`, createLanguageKeyboard()); },
    'ℹ️ Yardım': async () => { await sendTelegram(env, chatId, UI.helpCaption(lang), createMainMenuKeyboard(lang)); },
    'ℹ️ Help': async () => { await sendTelegram(env, chatId, UI.helpCaption(lang), createMainMenuKeyboard(lang)); },
    'ℹ️ Hilfe': async () => { await sendTelegram(env, chatId, UI.helpCaption(lang), createMainMenuKeyboard(lang)); },
  };
  const fn = (map as any)[text];
  if (fn) { fn(); return true; }
  return false;
}

async function handleRouteSearch(env: Env, chatId: number, from: string, to: string, lang: string, currency: string): Promise<void> {
  try {
    await sendChatAction(env, chatId, 'upload_photo');
    const fromCode = getCityCode(from);
    const toCode = getCityCode(to);
    if (fromCode === 'ANY' || toCode === 'ANY') {
      await sendTelegram(env, chatId, lang === 'tr' ? `⚠️ Şehirleri tam anlayamadım. Lütfen kibarca şöyle yaz: <code>İstanbul - Paris</code> veya <code>New York - Tokyo</code>` : `⚠️ City not found. Try <code>London - Paris</code>`);
      return;
    }
    const [flightLink, hotelLink, carLink, activityLink, photoUrl, rate] = await Promise.all([
      searchFlights(env, from, to, currency),
      getHotelLink(env, to, currency),
      getCarLink(env, to, currency),
      getActivitiesLink(env, to, currency),
      getDestinationImage(to),
      getExchangeRate('EUR', currency === 'TRY' ? 'TRY' : currency),
    ]);

    const demoPrice = Math.floor(1500 + Math.random() * 3000);
    await DB.savePriceHistory(env, `${from} - ${to}`, demoPrice, currency).catch(() => {});

    const rateText = rate ? `💱 1 EUR ≈ ${rate.toFixed(2)} ${currency}` : undefined;
    const caption = UI.routeCaption(from, to, currency, rateText);
    const keyboard = createTravelKeyboard(flightLink, hotelLink, carLink, activityLink);
    const res = await sendPhoto(env, chatId, photoUrl, caption, keyboard);
    if (!res?.ok) {
      await sendTelegram(env, chatId, `✈️ <b>${from} → ${to}</b>\n\n✈️ Uçuş: ${flightLink}\n🏨 Otel: ${hotelLink}\n🚗 Araç: ${carLink}\n🎯 Aktivite: ${activityLink}`, keyboard);
    }
  } catch (e) {
    console.error('routeSearch', e);
    await sendTelegram(env, chatId, `⚠️ Kibar hatırlatma: Arama sırasında küçük bir aksaklık oldu. Lütfen bir kez daha deneyin.`);
  }
}

async function handleWeatherCard(env: Env, chatId: number, city: string, lang: string, currency: string): Promise<void> {
  try {
    await sendChatAction(env, chatId, 'upload_photo');
    const coords = getCityCoords(city);
    const [weather, hotelLink, rate, photoUrl] = await Promise.all([
      getWeather(city),
      getHotelLink(env, city, currency),
      getExchangeRate('EUR', currency),
      getDestinationImage(city),
    ]);
    if (!weather) {
      const hotelOnly = await getHotelLink(env, city, currency);
      await sendTelegram(env, chatId, lang === 'tr' ? `🏨 <b>${city}</b> için otel fırsatlarını hazırladım: ${hotelOnly}` : `🏨 Hotels in <b>${city}</b>: ${hotelOnly}`);
      return;
    }
    const weatherText = formatWeather(weather, coords?.name || city, lang);
    const rateText = rate ? `\n💱 1 EUR = ${rate.toFixed(2)} ${currency}` : '';
    const caption = `${weatherText}${rateText}\n\n${UI.weatherCaption(city)}`;
    const kb = createSingleButtonKeyboard(lang === 'tr' ? '🏨 Otelleri Gör' : '🏨 Hotels', hotelLink);
    const res = await sendPhoto(env, chatId, photoUrl, caption, kb);
    if (!res?.ok) await sendTelegram(env, chatId, `${weatherText}${rateText}\n\n🏨 ${hotelLink}`, kb);
  } catch (e) {
    console.error('weatherCard', e);
    await sendTelegram(env, chatId, `⚠️ Hava durumu şu an alınamadı, lütfen biraz sonra tekrar deneyin.`);
  }
}

async function handleExchangeCard(env: Env, chatId: number, lang: string): Promise<void> {
  const rates = await getAllExchangeRates('EUR');
  if (!rates) { await sendTelegram(env, chatId, `⚠️ Kur bilgisi alınamadı.`); return; }
  const lines = (lang === 'tr' ? `💱 <b>Anlık Döviz Kurları (EUR Bazlı)</b>\n\n` : `💱 <b>Exchange Rates (EUR)</b>\n\n`) +
    `🇹🇷 TRY: ${rates.TRY?.toFixed(2)}\n🇺🇸 USD: ${rates.USD?.toFixed(2)}\n🇬🇧 GBP: ${rates.GBP?.toFixed(2)}\n🇪🇺 EUR: 1.00\n` +
    `\nKaynak: open.er-api.com`;
  await sendTelegram(env, chatId, lines);
}

async function handleTrending(env: Env, chatId: number, lang: string, currency: string): Promise<void> {
  const list = await getTrendingDestinations(env, currency);
  const top = list.slice(0, 8);
  const buttons = [];
  for (const city of top.slice(0, 5)) {
    const link = await getCheapestDatesLink(env, city, currency);
    buttons.push([{ text: `📍 ${city}`, url: link }]);
  }
  const kb = createInlineKeyboard(buttons);
  await sendPhoto(env, chatId, 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600', lang === 'tr' ? `🌍 <b>Dünya Trend Rotaları</b>\n\nEn çok aranan şehirler:` : `🌍 <b>Trending Destinations</b>`, kb);
}

async function handleDailyDeal(env: Env, chatId: number, lang: string, currency: string): Promise<void> {
  const coupon = await DB.getTodaysCoupon(env);
  if (coupon) {
    const kb = createTravelKeyboard(coupon.flight_link, coupon.hotel_link, coupon.car_link);
    await sendPhoto(env, chatId, await getDestinationImage(coupon.route.split('-')[1] || 'Paris'), `🔥 <b>GÜNÜN BOMBASI!</b>\n\n📍 ${coupon.route} — <b>${coupon.price} ${coupon.currency}</b>\n\nSadece bugün geçerli!`, kb);
    return;
  }
  // fallback: rastgele trending
  const route = `Istanbul - Paris`;
  const [from, to] = route.split('-').map(s => s.trim());
  await handleRouteSearch(env, chatId, from, to, lang, currency);
}

async function handlePriceChart(env: Env, chatId: number, route: string, lang: string, currency: string): Promise<void> {
  await sendChatAction(env, chatId, 'upload_photo');
  let history = await DB.getPriceHistory(env, route, 30);
  if (!history || (history as any[]).length < 3) {
    const now = Date.now();
    const demoPrices: number[] = [];
    const demoLabels: string[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now - i * 86400000);
      demoLabels.push(`${d.getDate()}/${d.getMonth() + 1}`);
      demoPrices.push(Math.floor(1200 + Math.sin(i / 5) * 400 + Math.random() * 300));
      if (i % 7 === 0) await DB.savePriceHistory(env, route, demoPrices[demoPrices.length - 1], currency).catch(() => {});
    }
    const url = await getPriceChartUrl(route, demoPrices, demoLabels);
    const min = Math.min(...demoPrices);
    await sendPhoto(env, chatId, url, UI.chartCaption(route, min, currency, lang), createSingleButtonKeyboard(lang === 'tr' ? '📉 En düşük fiyatı al' : '📉 Buy cheapest', await searchFlights(env, route.split('-')[0].trim(), route.split('-')[1].trim(), currency)));
    return;
  }
  const prices = (history as any[]).map((r: any) => r.price);
  const labels = (history as any[]).map((r: any) => new Date(r.checked_at).toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', { day: '2-digit', month: 'short' }));
  const url = await getPriceChartUrl(route, prices, labels);
  const min = Math.min(...prices);
  await sendPhoto(env, chatId, url, UI.chartCaption(route, min, currency, lang), createSingleButtonKeyboard(lang === 'tr' ? '📉 En düşük fiyatı al' : '📉 Buy cheapest', await searchFlights(env, route.split('-')[0].trim(), route.split('-')[1].trim(), currency)));
}

async function handleFavorites(env: Env, chatId: number, lang: string): Promise<void> {
  const res: any = await DB.getFavorites(env, chatId);
  const rows = res.results || res || [];
  if (!rows.length) {
    await sendTelegram(env, chatId, lang === 'tr' ? `⭐ Henüz favorin yok. <code>/takip İstanbul - Paris - 1000 TL</code> ile ekle.` : `⭐ No favorites yet.`);
    return;
  }
  const lines = rows.map((r: any, i: number) => `${i + 1}. ${r.route}${r.target_price ? ` — ${r.target_price} ${r.currency || 'TRY'}` : ''}`).join('\n');
  await sendTelegram(env, chatId, `⭐ <b>${lang === 'tr' ? 'Favori Rotalarım' : 'My Favorites'}</b>\n\n${lines}`);
}

async function handleAlerts(env: Env, chatId: number, lang: string): Promise<void> {
  const rows: any = await DB.getPriceAlerts(env, chatId);
  const list = (rows.results || rows || []) as any[];
  if (!list.length) {
    await sendTelegram(env, chatId, lang === 'tr' ? `🔔 Aktif alarm yok. <code>/takip Rota - Fiyat</code> ile ekle.` : `🔔 No active alerts.`);
    return;
  }
  const lines = list.map((r: any, i: number) => `${i + 1}. ${r.route} — ${r.target_price} ${r.currency}`).join('\n');
  await sendTelegram(env, chatId, `🔔 <b>${lang === 'tr' ? 'Alarmlarım' : 'My Alerts'}</b>\n\n${lines}`);
}

async function handleVoiceMessage(message: any, env: Env, chatId: number, lang: string): Promise<void> {
  const fileId = message.voice.file_id;
  await sendTelegram(env, chatId, lang === 'tr' ? `🎙️ Sesli mesaj alındı, çözümlüyorum...` : `🎙️ Voice received, transcribing...`);
  let transcript: string | null = null;
  let parsed: { from?: string; to?: string } | null = null;
  try {
    if (env.OPENAI_API_KEY) {
      transcript = await transcribeVoice(env, fileId);
      if (transcript) parsed = parseVoiceRoute(transcript);
    } else {
      // Fallback: Telegram native transcript yoksa kullanıcıya bilgi ver
      await sendTelegram(env, chatId, lang === 'tr' ? `⚠️ Sesli komut için <code>OPENAI_API_KEY</code> ayarı gerekiyor. Şimdilik metin olarak yaz: <code>İstanbul - Paris</code>` : `⚠️ Voice requires OPENAI_API_KEY. Please type: <code>London - Paris</code>`);
      await DB.logVoiceRequest(env, chatId, fileId, null, null, false);
      return;
    }
  } catch (e) { console.error('voice', e); }
  const success = !!(transcript && parsed?.from && parsed?.to);
  await DB.logVoiceRequest(env, chatId, fileId, transcript, parsed ? `${parsed.from} - ${parsed.to}` : null, success);
  if (success && parsed!.from && parsed!.to) {
    const dbUser = await DB.getUser(env, chatId);
    const cur = dbUser?.currency || 'TRY';
    await sendTelegram(env, chatId, `🗣️ Anladım: <b>${parsed!.from} → ${parsed!.to}</b>\n"${transcript}"`);
    await handleRouteSearch(env, chatId, parsed!.from!, parsed!.to!, lang, cur);
  } else {
    await sendTelegram(env, chatId, lang === 'tr' ? `😕 Sesli mesajı anlayamadım.${transcript ? `\nAlgılanan: "${transcript}"` : ''}\nLütfen net şekilde: <code>İstanbul - Paris</code> yaz.` : `😕 Could not parse voice.${transcript ? `\nHeard: "${transcript}"` : ''}`);
  }
}

export async function handleCallbackQuery(callbackQuery: any, env: Env): Promise<void> {
  const data: string = callbackQuery.data;
  const chatId = callbackQuery.message?.chat?.id || callbackQuery.from.id;
  const cqId = callbackQuery.id;
  try {
    if (data.startsWith('lang_')) {
      const lang = data.replace('lang_', '');
      await DB.updateUserLanguage(env, chatId, lang);
      await answerCallbackQuery(env, cqId, `✅ ${lang.toUpperCase()}`);
      await sendTelegram(env, chatId, `✅ Dil <b>${lang.toUpperCase()}</b> olarak ayarlandı.`, createMainMenuKeyboard(lang));
      return;
    }
    if (data.startsWith('curr_')) {
      const cur = data.replace('curr_', '');
      await DB.updateUserCurrency(env, chatId, cur);
      await answerCallbackQuery(env, cqId, `✅ ${cur}`);
      const u = await DB.getUser(env, chatId);
      await sendTelegram(env, chatId, `✅ Para birimi <b>${cur}</b>`, createMainMenuKeyboard(getLang(u)));
      return;
    }
    if (data.startsWith('track_')) {
      const parts = data.replace('track_', '').split('_');
      const price = parseFloat(parts.pop() || '0');
      const route = parts.join(' ').replace(/_/g, ' - ').replace(' -  - ', ' - ');
      // callback route formatı basit, direkt kaydet
      const cleanRoute = route.includes('-') ? route : parts.join(' ');
      await DB.addFavorite(env, chatId, cleanRoute, price || undefined);
      if (price) await DB.addPriceAlert(env, chatId, cleanRoute, price);
      await answerCallbackQuery(env, cqId, `✅ Takip eklendi`);
      await sendTelegram(env, chatId, `✅ Takip: <b>${cleanRoute}</b>`);
      return;
    }
    if (data.startsWith('chart_')) {
      const route = data.replace('chart_', '').replace(/_/g, ' - ');
      const u = await DB.getUser(env, chatId);
      await answerCallbackQuery(env, cqId, `📊 Grafik hazırlanıyor`);
      await handlePriceChart(env, chatId, route, getLang(u), u?.currency || 'TRY');
      return;
    }
    if (data.startsWith('explore_')) {
      const kind = data.replace('explore_', '');
      const u = await DB.getUser(env, chatId);
      const l = getLang(u); const cur = u?.currency || 'TRY';
      await answerCallbackQuery(env, cqId);
      if (kind === 'chart') await sendTelegram(env, chatId, `📈 Grafik için rota yaz: <code>İstanbul - Paris</code>`);
      else if (kind === 'weather') await sendTelegram(env, chatId, `🌤️ Şehir yaz: <code>Paris</code>, <code>Tokyo</code>`);
      else if (kind === 'voice') await sendTelegram(env, chatId, `🎙️ Sesli mesaj gönder: "Yarın İstanbul'dan Roma'ya kaç para?"`);
      else if (kind === 'share') await sendTelegram(env, chatId, `📢 Bir rota aradıktan sonra gelen 📢 butonuna basarak paylaşabilirsin.`, createInlineKeyboard([[{ text: '📢 Arkadaşlara Gönder', switch_inline_query: '' }]]));
      else if (kind === 'currency') { await sendTelegram(env, chatId, `💱 Para birimi seç:`, createCurrencyKeyboard()); }
      else if (kind === 'trending') await handleTrending(env, chatId, l, cur);
      return;
    }
    await answerCallbackQuery(env, cqId);
  } catch (e) {
    console.error('callback', e);
    await answerCallbackQuery(env, cqId, `⚠️ Hata`);
  }
}

export async function handleInlineQuery(inlineQuery: any, env: Env): Promise<void> {
  const q = (inlineQuery.query || '').trim();
  const results = [];
  if (q) {
    // Kullanıcının yazdığı rotayı affiliate linke çevirip inline sonuç döndür
    const parts = q.split('-').map((s: string) => s.trim());
    let from = parts[0] || 'Istanbul';
    let to = parts[1] || q;
    const flightUrl = `https://www.aviasales.com/search?origin=${encodeURIComponent(from)}&destination=${encodeURIComponent(to)}`;
    results.push({
      type: 'article',
      id: '1',
      title: `✈️ ${from} → ${to} Fırsatı`,
      description: `Uçuş + Otel + Araç - Viral paylaş`,
      input_message_content: { message_text: `✈️ <b>${from} → ${to}</b> fırsatını buldum!\n\n🔗 ${flightUrl}\n\n_bot: @${CHANNEL_ID}_bot_` , parse_mode: 'HTML' },
      reply_markup: { inline_keyboard: [[{ text: '✈️ Uçuşu Gör', url: flightUrl }]] },
      thumb_url: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=200',
    });
  } else {
    results.push({
      type: 'article',
      id: 'empty',
      title: '🌍 Seyahat Fırsat Botu',
      description: 'Rota yaz: Istanbul - Paris',
      input_message_content: { message_text: `🌍 Seyahat Fırsat Botu ile dünya genelinde fırsatları keşfet!`, parse_mode: 'HTML' },
    });
  }
  await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/answerInlineQuery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ inline_query_id: inlineQuery.id, results, cache_time: 0 }),
  });
}
