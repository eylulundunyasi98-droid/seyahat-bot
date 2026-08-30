// src/cron.ts - Zamanlanmış görevler + UI + güvenlik
import { Env } from './index';
import { CHANNEL_ID, GLOBAL_TRENDING_ROUTES } from './constants';
import { searchFlights, getHotelLink, getCarLink, getActivitiesLink, getTrainLink, getBusLink, getDestinationImage, getCityCode } from './api';
import { sendPhoto, sendToChannel, createTravelKeyboard, createSingleButtonKeyboard } from './telegram';
import * as UI from './ui';
import * as DB from './db';

function randomRoute(): string {
  return GLOBAL_TRENDING_ROUTES[Math.floor(Math.random() * GLOBAL_TRENDING_ROUTES.length)];
}

function mockPrice(): number {
  return Math.floor(800 + Math.random() * 3500);
}

async function fetchCurrentPrice(env: Env, route: string, currency: string): Promise<number | null> {
  try {
    const [from, to] = route.split('-').map(s => s.trim());
    // Travelpayouts gerçek fiyat API'si - başarısız olursa mock döndür
    const fromCode = getCityCode(from);
    const toCode = getCityCode(to);
    if (fromCode === 'ANY' || toCode === 'ANY') return mockPrice();
    // Gerçek API çağrısı (token varsa)
    if (!env.TRAVELPAYOUTS_API_TOKEN) return mockPrice();
    const url = `https://api.travelpayouts.com/aviasales/v3/prices_for_dates?origin=${fromCode}&destination=${toCode}&currency=${currency}&limit=1&token=${env.TRAVELPAYOUTS_API_TOKEN}`;
    const res = await fetch(url);
    if (!res.ok) return mockPrice();
    const data: any = await res.json();
    if (data.data && data.data.length > 0 && data.data[0].price) {
      return Math.round(data.data[0].price);
    }
    return mockPrice();
  } catch (e) {
    console.error('fetchCurrentPrice', e);
    return mockPrice();
  }
}

export async function checkPriceAlerts(env: Env): Promise<void> {
  const alerts: any = await DB.getPriceAlerts(env);
  const list: any[] = (alerts.results || alerts || []) as any[];
  if (!list.length) {
    console.log('checkPriceAlerts: no active alerts');
    return;
  }
  for (const alert of list) {
    try {
      const currency = alert.currency || 'TRY';
      const current = await fetchCurrentPrice(env, alert.route, currency);
      if (current === null) continue;
      // Fiyat geçmişine kaydet
      await DB.savePriceHistory(env, alert.route, current, currency).catch(() => {});

      if (current <= alert.target_price) {
        const [from, to] = alert.route.split('-').map((s: string) => s.trim());
        const flightLink = await searchFlights(env, from, to, currency);
        const photo = await getDestinationImage(to);
        const caption = UI.alertCaption(alert.route, alert.target_price, current, currency);
        const kb = createSingleButtonKeyboard('✈️ Hemen Al', flightLink);
        await sendPhoto(env, alert.user_id, photo, caption, kb).catch(()=>{});
        await DB.triggerPriceAlert(env, alert.id);
        // Normal kanala alarm spam olmasın — sadece kullanıcıya gider
      }
    } catch (e) {
      console.error('alert loop', alert.route, e);
    }
  }
}

export async function saveHistoryForFavorites(env: Env): Promise<void> {
  const favs: any = await DB.getAllActiveFavorites(env);
  const list: any[] = (favs.results || favs || []) as any[];
  // Sadece ilk 20 tanesini işle (rate limit)
  for (const fav of list.slice(0, 20)) {
    try {
      const cur = await fetchCurrentPrice(env, fav.route, fav.currency || 'TRY');
      if (cur !== null) await DB.savePriceHistory(env, fav.route, cur, fav.currency || 'TRY');
    } catch (e) { console.error('history save', e); }
  }
}

export async function sendDailyDigest(env: Env): Promise<void> {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const idx = Math.abs(hashCode(today)) % GLOBAL_TRENDING_ROUTES.length;
    const route = GLOBAL_TRENDING_ROUTES[idx];
    const [from, to] = route.split('-').map(s => s.trim());
    const currency = 'TRY';
    const price = mockPrice();
    const [flightLink, hotelLink, carLink, activityLink, trainLink, busLink, photo] = await Promise.all([
      searchFlights(env, from, to, currency),
      getHotelLink(env, to, currency),
      getCarLink(env, to, currency),
      getActivitiesLink(env, to, currency),
      getTrainLink(env, from, to),
      getBusLink(env, from, to),
      getDestinationImage(to),
    ]);
    await DB.saveDailyCoupon(env, { route, price, currency, flightLink, hotelLink, carLink }).catch(() => {});
    const caption = UI.dailyCaption(route, price, currency, today);
    const kbBase = createTravelKeyboard(flightLink, hotelLink, carLink, activityLink, trainLink, busLink);
    const kb = { inline_keyboard: [...(kbBase.inline_keyboard || []), [{ text: '🤖 Bot ile Ara', url: 'https://t.me/avcisi_firsat_bot?start=channel' }]] };
    await sendPhoto(env, CHANNEL_ID, photo, caption, kb);
  } catch (e) {
    console.error('dailyDigest', e);
  }
}

export async function sendCampaignDigest(env: Env): Promise<void> {
  try {
    // Kampanya: rastgele 1 rotada indirim etiketiyle kanala
    const route = GLOBAL_TRENDING_ROUTES[Math.floor(Math.random() * GLOBAL_TRENDING_ROUTES.length)];
    const [from, to] = route.split('-').map(s => s.trim());
    const currency = 'TRY';
    let price: number | null = null;
    try {
      const { searchFlightsDirect } = await import('./api');
      const data: any = await searchFlightsDirect(env, from, to, currency);
      price = data?.data?.[0]?.price ? Math.round(data.data[0].price * 0.85) : null;
    } catch {}
    const finalPrice = price || Math.floor(mockPrice() * 0.75);
    const [flightLink, hotelLink, carLink, activityLink, trainLink, busLink, photo] = await Promise.all([
      searchFlights(env, from, to, currency),
      getHotelLink(env, to, currency),
      getCarLink(env, to, currency),
      getActivitiesLink(env, to, currency),
      getTrainLink(env, from, to),
      getBusLink(env, from, to),
      getDestinationImage(to),
    ]);
    const caption = `🔥 <b>KAMPANYA!</b> ${from} → ${to}\n💰 Sadece <b>${finalPrice} ${currency}</b> <s>${Math.round(finalPrice*1.4)} ${currency}</s> %30 indirim!\n⏳ Bugün 23:59'a kadar`;
    const kbBase = createTravelKeyboard(flightLink, hotelLink, carLink, activityLink, trainLink, busLink);
    const kb = { inline_keyboard: [...(kbBase.inline_keyboard || []), [{ text: '🤖 Bot ile Ara', url: 'https://t.me/avcisi_firsat_bot?start=campaign' }]] };
    await sendPhoto(env, CHANNEL_ID, photo, caption, kb);
  } catch (e) { console.error('campaignDigest', e); }
}

function hashCode(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return h;
}

// Ana scheduled handler - index.ts tarafından çağrılır
export async function handleScheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
  if (event.cron === '0 */6 * * *') {
    ctx.waitUntil(Promise.all([checkPriceAlerts(env), saveHistoryForFavorites(env)]));
  } else if (event.cron === '0 9 * * *') {
    ctx.waitUntil(sendDailyDigest(env));
  } else if (event.cron === '0 15 * * *') {
    ctx.waitUntil(sendCampaignDigest(env));
  } else {
    ctx.waitUntil(checkPriceAlerts(env));
  }
}
