// src/db.ts
// Tüm D1 veritabanı sorguları

import { Env } from './index';

// Kullanıcı işlemleri
export async function upsertUser(env: Env, user: {
  user_id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  language_code?: string;
}): Promise<void> {
  await env.DB.prepare(`
    INSERT INTO users (user_id, username, first_name, last_name, language_code)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(user_id) DO UPDATE SET
      username = excluded.username,
      first_name = excluded.first_name,
      last_name = excluded.last_name,
      language_code = excluded.language_code,
      updated_at = CURRENT_TIMESTAMP
  `).bind(
    user.user_id,
    user.username || null,
    user.first_name || null,
    user.last_name || null,
    user.language_code || 'tr'
  ).run();
}

export async function getUser(env: Env, userId: number): Promise<any> {
  return await env.DB.prepare('SELECT * FROM users WHERE user_id = ?').bind(userId).first();
}

export async function updateUserLanguage(env: Env, userId: number, lang: string): Promise<void> {
  await env.DB.prepare('UPDATE users SET language_code = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?')
    .bind(lang, userId).run();
}

export async function updateUserCurrency(env: Env, userId: number, currency: string): Promise<void> {
  await env.DB.prepare('UPDATE users SET currency = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?')
    .bind(currency, userId).run();
}

export async function setUserPremium(env: Env, userId: number, isPremium: boolean): Promise<void> {
  await env.DB.prepare('UPDATE users SET is_premium = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?')
    .bind(isPremium ? 1 : 0, userId).run();
}

// Favori rotalar (takip listesi)
export async function addFavorite(env: Env, userId: number, route: string, targetPrice?: number): Promise<void> {
  const [from, to] = route.split('-').map(s => s.trim());
  await env.DB.prepare(`
    INSERT OR REPLACE INTO favorites (user_id, route, origin_code, destination_code, target_price, is_active)
    VALUES (?, ?, ?, ?, ?, 1)
  `).bind(userId, route, getCityCode(from), getCityCode(to), targetPrice || null).run();
}

export async function removeFavorite(env: Env, userId: number, route: string): Promise<void> {
  await env.DB.prepare('DELETE FROM favorites WHERE user_id = ? AND route = ?').bind(userId, route).run();
}

export async function getFavorites(env: Env, userId: number): Promise<any[]> {
  return await env.DB.prepare('SELECT * FROM favorites WHERE user_id = ? AND is_active = 1 ORDER BY created_at DESC')
    .bind(userId).all() as any;
}

export async function getAllActiveFavorites(env: Env): Promise<any[]> {
  return await env.DB.prepare('SELECT * FROM favorites WHERE is_active = 1').all() as any;
}

export async function updateFavoritePrice(env: Env, userId: number, route: string, price: number): Promise<void> {
  await env.DB.prepare('UPDATE favorites SET target_price = ? WHERE user_id = ? AND route = ?')
    .bind(price, userId, route).run();
}

// Fiyat geçmişi (grafikler için)
export async function savePriceHistory(env: Env, route: string, price: number, currency: string = 'TRY', source: string = 'aviasales'): Promise<void> {
  const [from, to] = route.split('-').map(s => s.trim());
  await env.DB.prepare(`
    INSERT INTO price_history (route, origin_code, destination_code, price, currency, source)
    VALUES (?, ?, ?, ?, ?, ?)
  `).bind(route, getCityCode(from), getCityCode(to), price, currency, source).run();
}

export async function getPriceHistory(env: Env, route: string, days: number = 30): Promise<any[]> {
  const result = await env.DB.prepare(`
    SELECT price, checked_at FROM price_history 
    WHERE route = ? AND checked_at >= datetime('now', ?)
    ORDER BY checked_at ASC
  `).bind(route, `-${days} days`).all();
  return result.results;
}

export async function getLatestPrices(env: Env): Promise<any[]> {
  return await env.DB.prepare(`
    SELECT DISTINCT ON (route) route, price, currency, checked_at
    FROM price_history
    ORDER BY route, checked_at DESC
  `).all() as any;
}

// Fiyat alarmları
export async function addPriceAlert(env: Env, userId: number, route: string, targetPrice: number, currency: string = 'TRY'): Promise<void> {
  const [from, to] = route.split('-').map(s => s.trim());
  await env.DB.prepare(`
    INSERT OR REPLACE INTO price_alerts (user_id, route, origin_code, destination_code, target_price, currency, is_triggered)
    VALUES (?, ?, ?, ?, ?, ?, 0)
  `).bind(userId, route, getCityCode(from), getCityCode(to), targetPrice, currency).run();
}

export async function removePriceAlert(env: Env, userId: number, route: string): Promise<void> {
  await env.DB.prepare('DELETE FROM price_alerts WHERE user_id = ? AND route = ?').bind(userId, route).run();
}

export async function getPriceAlerts(env: Env, userId?: number): Promise<any[]> {
  let query = 'SELECT * FROM price_alerts WHERE is_triggered = 0';
  if (userId) query += ' AND user_id = ?';
  query += ' ORDER BY created_at DESC';
  
  const stmt = env.DB.prepare(query);
  if (userId) return await stmt.bind(userId).all() as any;
  return await stmt.all() as any;
}

export async function triggerPriceAlert(env: Env, alertId: number): Promise<void> {
  await env.DB.prepare('UPDATE price_alerts SET is_triggered = 1, triggered_at = CURRENT_TIMESTAMP WHERE id = ?')
    .bind(alertId).run();
}

export async function getTriggeredAlerts(env: Env): Promise<any[]> {
  return await env.DB.prepare(`
    SELECT pa.*, u.language_code, u.currency 
    FROM price_alerts pa
    JOIN users u ON pa.user_id = u.user_id
    WHERE pa.is_triggered = 0
  `).all() as any;
}

// Günlük kuponlar
export async function saveDailyCoupon(env: Env, coupon: {
  route: string;
  price: number;
  currency: string;
  flightLink: string;
  hotelLink: string;
  carLink: string;
}): Promise<void> {
  const [from, to] = coupon.route.split('-').map(s => s.trim());
  await env.DB.prepare(`
    INSERT INTO daily_coupons (route, origin_code, destination_code, price, currency, flight_link, hotel_link, car_link, is_active, sent_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP)
  `).bind(
    coupon.route, getCityCode(from), getCityCode(to),
    coupon.price, coupon.currency, coupon.flightLink, coupon.hotelLink, coupon.carLink
  ).run();
}

export async function getTodaysCoupon(env: Env): Promise<any | null> {
  return await env.DB.prepare(`
    SELECT * FROM daily_coupons 
    WHERE is_active = 1 AND date(sent_at) = date('now')
    ORDER BY sent_at DESC LIMIT 1
  `).first();
}

export async function getActiveCoupons(env: Env): Promise<any[]> {
  return await env.DB.prepare(`
    SELECT * FROM daily_coupons WHERE is_active = 1 ORDER BY sent_at DESC LIMIT 10
  `).all() as any;
}

// Sesli istekler log
export async function logVoiceRequest(env: Env, userId: number, fileId: string, transcript: string | null, parsedRoute: string | null, success: boolean): Promise<void> {
  await env.DB.prepare(`
    INSERT INTO voice_requests (user_id, file_id, transcript, parsed_route, success)
    VALUES (?, ?, ?, ?, ?)
  `).bind(userId, fileId, transcript, parsedRoute, success ? 1 : 0).run();
}

export async function getVoiceStats(env: Env, userId?: number): Promise<any> {
  let query = 'SELECT COUNT(*) as total, SUM(success) as successful FROM voice_requests';
  if (userId) query += ' WHERE user_id = ?';
  
  const stmt = env.DB.prepare(query);
  if (userId) return await stmt.bind(userId).first();
  return await stmt.first();
}

// Abonelikler
export async function subscribe(env: Env, userId: number, type: string): Promise<void> {
  await env.DB.prepare(`
    INSERT OR REPLACE INTO subscriptions (user_id, type, is_active)
    VALUES (?, ?, 1)
  `).bind(userId, type).run();
}

export async function unsubscribe(env: Env, userId: number, type: string): Promise<void> {
  await env.DB.prepare('UPDATE subscriptions SET is_active = 0 WHERE user_id = ? AND type = ?')
    .bind(userId, type).run();
}

export async function getSubscriptions(env: Env, userId: number): Promise<any[]> {
  return await env.DB.prepare('SELECT * FROM subscriptions WHERE user_id = ? AND is_active = 1')
    .bind(userId).all() as any;
}

export async function getAllSubscribers(env: Env, type: string): Promise<number[]> {
  const result = await env.DB.prepare('SELECT user_id FROM subscriptions WHERE type = ? AND is_active = 1')
    .bind(type).all();
  return result.results.map((r: any) => r.user_id);
}

// Paylaşım takibi
export async function logShare(env: Env, userId: number, route: string, messageId: number, sharedToChatId: number): Promise<void> {
  await env.DB.prepare(`
    INSERT INTO shares (user_id, route, message_id, shared_to_chat_id)
    VALUES (?, ?, ?, ?)
  `).bind(userId, route, messageId, sharedToChatId).run();
}

export async function getShareStats(env: Env): Promise<any> {
  return await env.DB.prepare(`
    SELECT COUNT(*) as total_shares, COUNT(DISTINCT user_id) as unique_sharers
    FROM shares WHERE created_at >= datetime('now', '-7 days')
  `).first();
}

// Çeviri cache
export async function getTranslation(key: string, lang: string, env: Env): Promise<string | null> {
  const result: any = await env.DB.prepare('SELECT value FROM translations_cache WHERE key = ? AND language = ?')
    .bind(key, lang).first();
  return result?.value || null;
}

export async function setTranslation(key: string, lang: string, value: string, env: Env): Promise<void> {
  await env.DB.prepare(`
    INSERT OR REPLACE INTO translations_cache (key, language, value)
    VALUES (?, ?, ?)
  `).bind(key, lang, value).run();
}

// İstatistikler
export async function getBotStats(env: Env): Promise<any> {
  const [users, favorites, alerts, coupons, shares] = await Promise.all([
    env.DB.prepare('SELECT COUNT(*) as count FROM users').first(),
    env.DB.prepare('SELECT COUNT(*) as count FROM favorites WHERE is_active = 1').first(),
    env.DB.prepare('SELECT COUNT(*) as count FROM price_alerts WHERE is_triggered = 0').first(),
    env.DB.prepare('SELECT COUNT(*) as count FROM daily_coupons WHERE is_active = 1').first(),
    env.DB.prepare('SELECT COUNT(*) as count FROM shares WHERE created_at >= datetime(\'now\', \'-7 days\')').first(),
  ]);
  
  return {
    totalUsers: users?.count || 0,
    activeFavorites: favorites?.count || 0,
    activeAlerts: alerts?.count || 0,
    activeCoupons: coupons?.count || 0,
    weeklyShares: shares?.count || 0,
  };
}

// Helper functions (local copies to avoid circular imports)
function getCityCode(city: string): string {
  const normalized = normalizeCity(city);
  const CITY_CODES: Record<string, string> = {
    'istanbul': 'IST', 'ankara': 'ESB', 'izmir': 'ADB', 'antalya': 'AYT', 'bodrum': 'BJV',
    'dalaman': 'DLM', 'trabzon': 'TZX', 'adana': 'ADA', 'gaziantep': 'GZT', 'kayseri': 'ASR',
    'paris': 'PAR', 'lyon': 'LYS', 'nice': 'NCE', 'marseille': 'MRS', 'toulouse': 'TLS',
    'london': 'LON', 'manchester': 'MAN', 'edinburgh': 'EDI', 'birmingham': 'BHX', 'glasgow': 'GLA',
    'new york': 'NYC', 'los angeles': 'LAX', 'chicago': 'CHI', 'miami': 'MIA', 'san francisco': 'SFO',
    'tokyo': 'TYO', 'osaka': 'OSA', 'sapporo': 'SPK', 'fukuoka': 'FUK', 'okinawa': 'OKA',
    'dubai': 'DXB', 'abu dhabi': 'AUH', 'sharjah': 'SHJ',
    'singapore': 'SIN', 'hong kong': 'HKG', 'bangkok': 'BKK', 'phuket': 'HKT', 'kuala lumpur': 'KUL',
    'sydney': 'SYD', 'melbourne': 'MEL', 'brisbane': 'BNE', 'perth': 'PER', 'auckland': 'AKL',
    'berlin': 'BER', 'munich': 'MUC', 'frankfurt': 'FRA', 'hamburg': 'HAM', 'cologne': 'CGN',
    'madrid': 'MAD', 'barcelona': 'BCN', 'malaga': 'AGP', 'palma': 'PMI', 'valencia': 'VLC',
    'rome': 'ROM', 'milan': 'MIL', 'venice': 'VCE', 'naples': 'NAP', 'florence': 'FLR',
    'amsterdam': 'AMS', 'rotterdam': 'RTM', 'eindhoven': 'EIN',
    'vienna': 'VIE', 'salzburg': 'SZG', 'innsbruck': 'INN',
    'zurich': 'ZRH', 'geneva': 'GVA', 'basel': 'BSL',
    'copenhagen': 'CPH', 'stockholm': 'STO', 'oslo': 'OSL', 'helsinki': 'HEL',
    'warsaw': 'WAW', 'krakow': 'KRK', 'gdansk': 'GDN',
    'prague': 'PRG', 'budapest': 'BUD', 'bucharest': 'BUH', 'sofia': 'SOF', 'belgrade': 'BEG',
    'athens': 'ATH', 'thessaloniki': 'SKG', 'crete': 'CHQ', 'rhodes': 'RHO',
    'lisbon': 'LIS', 'porto': 'OPO', 'faro': 'FAO',
    'dublin': 'DUB', 'reykjavik': 'REK',
    'moscow': 'MOW', 'st petersburg': 'LED', 'kazan': 'KZN',
    'delhi': 'DEL', 'mumbai': 'BOM', 'bangalore': 'BLR', 'chennai': 'MAA', 'hyderabad': 'HYD',
    'beijing': 'BJS', 'shanghai': 'SHA', 'guangzhou': 'CAN', 'shenzhen': 'SZX', 'chengdu': 'CTU',
    'seoul': 'SEL', 'busan': 'PUS', 'jeju': 'CJU',
    'taipei': 'TPE', 'kaohsiung': 'KHH',
    'jakarta': 'JKT', 'bali': 'DPS', 'surabaya': 'SUB',
    'manila': 'MNL', 'cebu': 'CEB', 'davao': 'DVO',
    'ho chi minh city': 'SGN', 'hanoi': 'HAN', 'da nang': 'DAD',
    'tehran': 'THR', 'riyadh': 'RUH', 'jeddah': 'JED', 'doha': 'DOH', 'kuwait': 'KWI',
    'tel aviv': 'TLV', 'jerusalem': 'JRS',
    'cairo': 'CAI', 'alexandria': 'ALY', 'luxor': 'LXR', 'sharm el sheikh': 'SSH',
    'casablanca': 'CAS', 'marrakech': 'RAK', 'tunis': 'TUN', 'algiers': 'ALG',
    'johannesburg': 'JNB', 'cape town': 'CPT', 'durban': 'DUR',
    'nairobi': 'NBO', 'addis ababa': 'ADD', 'lagos': 'LOS', 'accra': 'ACC',
    'sao paulo': 'SAO', 'rio de janeiro': 'RIO', 'brasilia': 'BSB', 'buenos aires': 'BUE',
    'santiago': 'SCL', 'lima': 'LIM', 'bogota': 'BOG', 'quito': 'UIO', 'caracas': 'CCS',
    'mexico city': 'MEX', 'cancun': 'CUN', 'guadalajara': 'GDL', 'monterrey': 'MTY',
    'toronto': 'YTO', 'vancouver': 'YVR', 'montreal': 'YMQ', 'calgary': 'YYC',
  };
  return CITY_CODES[normalized] || 'ANY';
}

function normalizeCity(city: string): string {
  return city.toLowerCase().trim()
    .replace(/[ığüşöç]/g, c => ({ 'ı': 'i', 'ğ': 'g', 'ü': 'u', 'ş': 's', 'ö': 'o', 'ç': 'c' })[c] || c)
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, ' ');
}