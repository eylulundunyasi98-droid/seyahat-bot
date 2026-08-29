// src/api.ts
// Harici API entegrasyonları: Travelpayouts, Open-Meteo, ExchangeRate, QuickChart, OpenAI Whisper

import { Env } from './index';
import { getFile, getFileLink } from './telegram';

const TRAVELPAYOUTS_API = 'https://api.travelpayouts.com';
const QUICKCHART_API = 'https://quickchart.io/chart';
const OPEN_METEO_API = 'https://api.open-meteo.com/v1/forecast';
const EXCHANGE_RATE_API = 'https://open.er-api.com/v6/latest';

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
  'san paolo': 'SAO',
};

const CITY_COORDS: Record<string, { lat: number; lon: number; name: string }> = {
  'istanbul': { lat: 41.0082, lon: 28.9784, name: 'İstanbul' },
  'ankara': { lat: 39.9334, lon: 32.8597, name: 'Ankara' },
  'izmir': { lat: 38.4237, lon: 27.1428, name: 'İzmir' },
  'antalya': { lat: 36.8969, lon: 30.7133, name: 'Antalya' },
  'paris': { lat: 48.8566, lon: 2.3522, name: 'Paris' },
  'lyon': { lat: 45.7640, lon: 4.8357, name: 'Lyon' },
  'nice': { lat: 43.7102, lon: 7.2620, name: 'Nice' },
  'london': { lat: 51.5074, lon: -0.1278, name: 'London' },
  'manchester': { lat: 53.4808, lon: -2.2426, name: 'Manchester' },
  'new york': { lat: 40.7128, lon: -74.0060, name: 'New York' },
  'los angeles': { lat: 34.0522, lon: -118.2437, name: 'Los Angeles' },
  'chicago': { lat: 41.8781, lon: -87.6298, name: 'Chicago' },
  'tokyo': { lat: 35.6762, lon: 139.6503, name: 'Tokyo' },
  'osaka': { lat: 34.6937, lon: 135.5023, name: 'Osaka' },
  'dubai': { lat: 25.2048, lon: 55.2708, name: 'Dubai' },
  'singapore': { lat: 1.3521, lon: 103.8198, name: 'Singapore' },
  'hong kong': { lat: 22.3193, lon: 114.1694, name: 'Hong Kong' },
  'bangkok': { lat: 13.7563, lon: 100.5018, name: 'Bangkok' },
  'sydney': { lat: -33.8688, lon: 151.2093, name: 'Sydney' },
  'melbourne': { lat: -37.8136, lon: 144.9631, name: 'Melbourne' },
  'berlin': { lat: 52.5200, lon: 13.4050, name: 'Berlin' },
  'munich': { lat: 48.1351, lon: 11.5820, name: 'Munich' },
  'madrid': { lat: 40.4168, lon: -3.7038, name: 'Madrid' },
  'barcelona': { lat: 41.3851, lon: 2.1734, name: 'Barcelona' },
  'rome': { lat: 41.9028, lon: 12.4964, name: 'Rome' },
  'milan': { lat: 45.4642, lon: 9.1900, name: 'Milan' },
  'amsterdam': { lat: 52.3676, lon: 4.9041, name: 'Amsterdam' },
  'vienna': { lat: 48.2082, lon: 16.3738, name: 'Vienna' },
  'zurich': { lat: 47.3769, lon: 8.5417, name: 'Zurich' },
  'copenhagen': { lat: 55.6761, lon: 12.5683, name: 'Copenhagen' },
  'stockholm': { lat: 59.3293, lon: 18.0686, name: 'Stockholm' },
  'oslo': { lat: 59.9139, lon: 10.7522, name: 'Oslo' },
  'helsinki': { lat: 60.1699, lon: 24.9384, name: 'Helsinki' },
  'warsaw': { lat: 52.2297, lon: 21.0122, name: 'Warsaw' },
  'prague': { lat: 50.0755, lon: 14.4378, name: 'Prague' },
  'budapest': { lat: 47.4979, lon: 19.0402, name: 'Budapest' },
  'athens': { lat: 37.9838, lon: 23.7275, name: 'Athens' },
  'lisbon': { lat: 38.7223, lon: -9.1393, name: 'Lisbon' },
  'porto': { lat: 41.1579, lon: -8.6291, name: 'Porto' },
  'dublin': { lat: 53.3498, lon: -6.2603, name: 'Dublin' },
  'reykjavik': { lat: 64.1466, lon: -21.9426, name: 'Reykjavik' },
  'moscow': { lat: 55.7558, lon: 37.6173, name: 'Moscow' },
  'delhi': { lat: 28.6139, lon: 77.2090, name: 'Delhi' },
  'mumbai': { lat: 19.0760, lon: 72.8777, name: 'Mumbai' },
  'beijing': { lat: 39.9042, lon: 116.4074, name: 'Beijing' },
  'shanghai': { lat: 31.2304, lon: 121.4737, name: 'Shanghai' },
  'seoul': { lat: 37.5665, lon: 126.9780, name: 'Seoul' },
  'taipei': { lat: 25.0320, lon: 121.5654, name: 'Taipei' },
  'jakarta': { lat: -6.2088, lon: 106.8456, name: 'Jakarta' },
  'bali': { lat: -8.3405, lon: 115.0920, name: 'Bali' },
  'manila': { lat: 14.5995, lon: 120.9842, name: 'Manila' },
  'ho chi minh city': { lat: 10.8231, lon: 106.6297, name: 'Ho Chi Minh City' },
  'hanoi': { lat: 21.0278, lon: 105.8342, name: 'Hanoi' },
  'tehran': { lat: 35.6892, lon: 51.3890, name: 'Tehran' },
  'riyadh': { lat: 24.7136, lon: 46.6753, name: 'Riyadh' },
  'doha': { lat: 25.2854, lon: 51.5310, name: 'Doha' },
  'tel aviv': { lat: 32.0853, lon: 34.7818, name: 'Tel Aviv' },
  'cairo': { lat: 30.0444, lon: 31.2357, name: 'Cairo' },
  'casablanca': { lat: 33.5731, lon: -7.5898, name: 'Casablanca' },
  'marrakech': { lat: 31.6295, lon: -7.9811, name: 'Marrakech' },
  'johannesburg': { lat: -26.2041, lon: 28.0473, name: 'Johannesburg' },
  'cape town': { lat: -33.9249, lon: 18.4241, name: 'Cape Town' },
  'nairobi': { lat: -1.2921, lon: 36.8219, name: 'Nairobi' },
  'sao paulo': { lat: -23.5505, lon: -46.6333, name: 'São Paulo' },
  'rio de janeiro': { lat: -22.9068, lon: -43.1729, name: 'Rio de Janeiro' },
  'buenos aires': { lat: -34.6037, lon: -58.3816, name: 'Buenos Aires' },
  'santiago': { lat: -33.4489, lon: -70.6693, name: 'Santiago' },
  'lima': { lat: -12.0464, lon: -77.0428, name: 'Lima' },
  'mexico city': { lat: 19.4326, lon: -99.1332, name: 'Mexico City' },
  'cancun': { lat: 21.1619, lon: -86.8515, name: 'Cancun' },
  'toronto': { lat: 43.6532, lon: -79.3832, name: 'Toronto' },
  'vancouver': { lat: 49.2827, lon: -123.1207, name: 'Vancouver' },
};

function normalizeCity(city: string): string {
  return city.toLowerCase().trim()
    .replace(/[ığüşöç]/g, c => ({ 'ı': 'i', 'ğ': 'g', 'ü': 'u', 'ş': 's', 'ö': 'o', 'ç': 'c' })[c] || c)
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, ' ');
}

export function getCityCode(city: string): string {
  const normalized = normalizeCity(city);
  return CITY_CODES[normalized] || 'ANY';
}

export function getCityCoords(city: string): { lat: number; lon: number; name: string } | null {
  const normalized = normalizeCity(city);
  return CITY_COORDS[normalized] || null;
}

export function getAllCities(): string[] {
  return Object.keys(CITY_COORDS);
}

async function createAffiliateLink(env: Env, url: string): Promise<string> {
  // Travelpayouts Partner Links API: https://api.travelpayouts.com/links/v1/create
  // Gereken: X-Access-Token (API token), trs (project id), marker (numeric), shorten, links[]
  const hasTrs = !!(env as any).TRAVELPAYOUTS_TRS;
  const hasMarker = !!env.TRAVELPAYOUTS_MARKER && !!env.TRAVELPAYOUTS_API_TOKEN;
  if (!hasMarker || !hasTrs) {
    // Token/marker yoksa direkt linki kısa linke çevir (kazanç yok ama çalışır)
    try {
      const { createShortLink } = await import('./db');
      return await createShortLink(env, url);
    } catch { return url; }
  }
  try {
    const trs = Number((env as any).TRAVELPAYOUTS_TRS);
    const markerVal: any = isNaN(Number(env.TRAVELPAYOUTS_MARKER)) ? env.TRAVELPAYOUTS_MARKER : Number(env.TRAVELPAYOUTS_MARKER);
    const res = await fetch(`${TRAVELPAYOUTS_API}/links/v1/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Token': env.TRAVELPAYOUTS_API_TOKEN,
      },
      body: JSON.stringify({
        trs,
        marker: markerVal,
        shorten: true,
        links: [{ url, sub_id: 'bot' }],
      }),
    });
    const data: any = await res.json();
    const partnerUrl = data?.result?.links?.[0]?.partner_url || data?.link || null;
    const affiliate = partnerUrl && partnerUrl.length > 5 ? partnerUrl : url;
    try {
      const { createShortLink } = await import('./db');
      return await createShortLink(env, affiliate, url);
    } catch { return affiliate; }
  } catch (e) {
    console.error('Affiliate link creation failed:', e);
    try {
      const { createShortLink } = await import('./db');
      return await createShortLink(env, url);
    } catch { return url; }
  }
}

export async function searchFlights(env: Env, from: string, to: string, currency: string = 'TRY'): Promise<string> {
  const fromCode = getCityCode(from);
  const toCode = getCityCode(to);
  // Kullanıcıya gösterilecek gerçek Aviasales arama sayfası (Travelpayouts bunu affiliate'e çevirecek)
  const searchUrl = `https://www.aviasales.com/search/${fromCode}1${toCode}1?marker=${env.TRAVELPAYOUTS_MARKER || 'seyahat'}`;
  return await createAffiliateLink(env, searchUrl);
}

export async function searchFlightsDirect(env: Env, from: string, to: string, currency: string = 'TRY'): Promise<any> {
  const fromCode = getCityCode(from);
  const toCode = getCityCode(to);
  const url = `${TRAVELPAYOUTS_API}/aviasales/v3/prices_for_dates?origin=${fromCode}&destination=${toCode}&currency=${currency}&limit=30&sorting=price&direct=false`;
  const res = await fetch(url, {
    headers: { 'Authorization': `Bearer ${env.TRAVELPAYOUTS_API_TOKEN}` },
  });
  return res.json();
}

export async function getHotelLink(env: Env, city: string, currency: string = 'TRY'): Promise<string> {
  // Hotellook/Booking affiliate - kullanıcı dostu
  const hotelUrl = `https://search.hotellook.com/hotels?city=${encodeURIComponent(city)}&marker=${env.TRAVELPAYOUTS_MARKER || 'seyahat'}&currency=${currency.toLowerCase()}`;
  return await createAffiliateLink(env, hotelUrl);
}

export async function getCarLink(env: Env, city: string, currency: string = 'TRY'): Promise<string> {
  const carUrl = `https://www.rentalcars.com/en/city/${encodeURIComponent(city)}/?marker=${env.TRAVELPAYOUTS_MARKER || 'seyahat'}`;
  return await createAffiliateLink(env, carUrl);
}

export async function getActivitiesLink(env: Env, city: string, currency: string = 'TRY'): Promise<string> {
  const activitiesUrl = `https://www.klook.com/en-US/search/city-${encodeURIComponent(city.toLowerCase().replace(/\s+/g, '-'))}/?marker=${env.TRAVELPAYOUTS_MARKER || 'seyahat'}`;
  return await createAffiliateLink(env, activitiesUrl);
}

export async function getTrendingDestinations(env: Env, currency: string = 'TRY'): Promise<string[]> {
  const trending = [
    'Paris', 'London', 'New York', 'Tokyo', 'Dubai', 'Barcelona', 'Rome',
    'Amsterdam', 'Berlin', 'Vienna', 'Prague', 'Budapest', 'Lisbon', 'Istanbul',
    'Bangkok', 'Singapore', 'Hong Kong', 'Sydney', 'Bali', 'Cancun', 'Rio de Janeiro'
  ];
  return trending;
}

export async function getCheapestDatesLink(env: Env, city: string, currency: string = 'TRY'): Promise<string> {
  const cityCode = getCityCode(city);
  const url = `https://www.aviasales.com/search/${cityCode}1?marker=${env.TRAVELPAYOUTS_MARKER || 'seyahat'}`;
  return await createAffiliateLink(env, url);
}

export async function getDestinationImage(city: string): Promise<string> {
  const coords = getCityCoords(city);
  if (!coords) {
    return 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600';
  }
  const images: Record<string, string> = {
    'paris': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600',
    'london': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600',
    'new york': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600',
    'tokyo': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600',
    'dubai': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600',
    'istanbul': 'https://images.unsplash.com/photo-1524231757912-21f4a3a9e5b2?w=600',
    'barcelona': 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600',
    'rome': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600',
    'amsterdam': 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=600',
    'berlin': 'https://images.unsplash.com/photo-1589170937554-0502411c29f8?w=600',
    'sydney': 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=600',
    'bali': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600',
    'bangkok': 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=600',
    'singapore': 'https://images.unsplash.com/photo-1525625293386-3f8f99389e82?w=600',
  };
  const normalized = normalizeCity(city);
  return images[normalized] || `https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&sig=${Math.abs(hashCode(normalized)) % 1000}`;
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

export async function getPriceChartUrl(route: string, prices: number[], labels: string[]): Promise<string> {
  const data = {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: `Fiyat Geçmişi (${route})`,
        data: prices,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true, labels: { color: '#1f2937', font: { size: 14 } } },
        title: { display: true, text: `${route} - Son 30 Gün Fiyat Trendi`, font: { size: 18, weight: 'bold' }, color: '#1f2937' },
      },
      scales: {
        y: {
          beginAtZero: false,
          title: { display: true, text: 'Fiyat (TL)', color: '#6b7280' },
          ticks: { color: '#6b7280' },
          grid: { color: 'rgba(0,0,0,0.05)' }
        },
        x: {
          title: { display: true, text: 'Tarih', color: '#6b7280' },
          ticks: { color: '#6b7280', maxRotation: 45, minRotation: 45 },
          grid: { display: false }
        }
      }
    }
  };
  
  const encoded = encodeURIComponent(JSON.stringify(data));
  return `${QUICKCHART_API}?c=${encoded}&width=800&height=450&devicePixelRatio=2&format=png&backgroundColor=white`;
}

export async function getWeather(city: string): Promise<{
  current?: { temperature: number; weathercode: number; windspeed: number };
  daily?: { time: string[]; temperature_2m_max: number[]; temperature_2m_min: number[]; weathercode: number[] };
} | null> {
  let coords = getCityCoords(city);
  // Fallback: Nominatim ile dünya geneli şehir ara (free, kotasız)
  if (!coords) {
    try {
      const nom = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`, {
        headers: { 'User-Agent': 'SeyahatBot/1.0 (contact@seyahat-bot.workers.dev)', 'Accept-Language': 'tr' },
      });
      if (nom.ok) {
        const arr = await nom.json() as any[];
        if (arr && arr.length > 0) {
          coords = { lat: parseFloat(arr[0].lat), lon: parseFloat(arr[0].lon), name: (arr[0].display_name || city).split(',')[0].trim() };
        }
      }
    } catch (e) { console.error('Nominatim error', e); }
  }
  if (!coords) return null;

  try {
    const url = `${OPEN_METEO_API}?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto&forecast_days=3`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data: any = await res.json();
    // Open-Meteo bazen current/daily farklı isimlendirse de normalize et
    return data;
  } catch (e) {
    console.error('Weather API error:', e);
    return null;
  }
}

function weatherCodeToEmoji(code: number): string {
  const codes: Record<number, string> = {
    0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️', 45: '🌫️', 48: '🌫️',
    51: '🌦️', 53: '🌧️', 55: '🌧️', 56: '🌧️', 57: '🌧️',
    61: '🌧️', 63: '🌧️', 65: '🌧️', 66: '🌧️', 67: '🌧️',
    71: '❄️', 73: '❄️', 75: '❄️', 77: '❄️',
    80: '🌦️', 81: '🌧️', 82: '🌧️', 85: '❄️', 86: '❄️',
    95: '⛈️', 96: '⛈️', 99: '⛈️',
  };
  return codes[code] || '🌡️';
}

function weatherCodeToText(code: number, lang: string = 'tr'): string {
  const texts: Record<number, Record<string, string>> = {
    0: { tr: 'Açık', en: 'Clear', de: 'Klar' },
    1: { tr: 'Az Bulutlu', en: 'Mainly Clear', de: 'Teilweise bewölkt' },
    2: { tr: 'Parçalı Bulutlu', en: 'Partly Cloudy', de: 'Teilweise bewölkt' },
    3: { tr: 'Bulutlu', en: 'Overcast', de: 'Bewölkt' },
    45: { tr: 'Sisli', en: 'Fog', de: 'Neblig' },
    48: { tr: 'Yoğun Sis', en: 'Depositing Rime Fog', de: 'Eisnebelfeucht' },
    51: { tr: 'Hafif Çiseleme', en: 'Light Drizzle', de: 'Leichter Nieselregen' },
    53: { tr: 'Çiseleme', en: 'Moderate Drizzle', de: 'Mäßiger Nieselregen' },
    55: { tr: 'Yoğun Çiseleme', en: 'Dense Drizzle', de: 'Starker Nieselregen' },
    61: { tr: 'Hafif Yağmur', en: 'Light Rain', de: 'Leichter Regen' },
    63: { tr: 'Yağmur', en: 'Moderate Rain', de: 'Mäßiger Regen' },
    65: { tr: 'Yoğun Yağmur', en: 'Heavy Rain', de: 'Starker Regen' },
    71: { tr: 'Hafif Kar', en: 'Light Snow', de: 'Leichter Schnee' },
    73: { tr: 'Kar', en: 'Moderate Snow', de: 'Mäßiger Schnee' },
    75: { tr: 'Yoğun Kar', en: 'Heavy Snow', de: 'Starker Schnee' },
    95: { tr: 'Gök Gürültülü Fırtına', en: 'Thunderstorm', de: 'Gewitter' },
  };
  return texts[code]?.[lang] || texts[code]?.tr || 'Bilinmiyor';
}

export function formatWeather(weather: any, cityName: string, lang: string = 'tr'): string {
  if (!weather || !weather.daily) {
    return lang === 'tr' 
      ? `🌤️ ${cityName} için hava durumu bilgisi alınamadı.`
      : `🌤️ Weather data unavailable for ${cityName}.`;
  }

  const daily = weather.daily;
  const lines = [lang === 'tr' ? `🌤️ <b>${cityName} - 3 Günlük Hava Tahmini</b>` : `🌤️ <b>${cityName} - 3-Day Forecast</b>`];
  
  for (let i = 0; i < Math.min(3, daily.time.length); i++) {
    const date = new Date(daily.time[i]).toLocaleDateString(lang === 'tr' ? 'tr-TR' : lang === 'de' ? 'de-DE' : 'en-US', { weekday: 'short', day: 'numeric', month: 'short' });
    const max = Math.round(daily.temperature_2m_max[i]);
    const min = Math.round(daily.temperature_2m_min[i]);
    const code = daily.weathercode[i];
    const emoji = weatherCodeToEmoji(code);
    const text = weatherCodeToText(code, lang);
    lines.push(`${emoji} ${date}: ${min}°C - ${max}°C ${text}`);
  }
  
  if (weather.current) {
    const curr = weather.current;
    lines.unshift(lang === 'tr' 
      ? `🌡️ Şu an: ${Math.round(curr.temperature)}°C ${weatherCodeToEmoji(curr.weathercode)} ${weatherCodeToText(curr.weathercode, lang)}`
      : `🌡️ Now: ${Math.round(curr.temperature)}°C ${weatherCodeToEmoji(curr.weathercode)} ${weatherCodeToText(curr.weathercode, lang)}`
    );
  }
  
  return lines.join('\n');
}

export async function getExchangeRate(base: string = 'EUR', target: string = 'TRY'): Promise<number | null> {
  try {
    const res = await fetch(`${EXCHANGE_RATE_API}/${base}`);
    if (!res.ok) return null;
    const data = await res.json() as any;
    return data.rates?.[target] || null;
  } catch (e) {
    console.error('Exchange rate error:', e);
    return null;
  }
}

export async function getAllExchangeRates(base: string = 'EUR'): Promise<Record<string, number> | null> {
  try {
    const res = await fetch(`${EXCHANGE_RATE_API}/${base}`);
    if (!res.ok) return null;
    const data = await res.json() as any;
    return data.rates || null;
  } catch (e) {
    console.error('Exchange rates error:', e);
    return null;
  }
}

export function formatCurrency(amount: number, currency: string, lang: string = 'tr'): string {
  const symbols: Record<string, string> = { TRY: '₺', USD: '$', EUR: '€', GBP: '£' };
  const symbol = symbols[currency] || currency;
  if (currency === 'TRY') {
    return `${symbol}${amount.toLocaleString(lang === 'tr' ? 'tr-TR' : lang === 'de' ? 'de-DE' : 'en-US')}`;
  }
  return `${symbol}${amount.toLocaleString(lang === 'tr' ? 'tr-TR' : lang === 'de' ? 'de-DE' : 'en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export async function convertCurrency(amount: number, from: string, to: string): Promise<number> {
  if (from === to) return amount;
  const rate = await getExchangeRate(from, to);
  return rate ? Math.round(amount * rate * 100) / 100 : amount;
}

export async function transcribeVoice(env: Env, fileId: string): Promise<string | null> {
  if (!env.OPENAI_API_KEY) {
    console.warn('OPENAI_API_KEY not configured');
    return null;
  }
  
  try {
    const fileInfo: any = await getFile(env, fileId);
    if (!fileInfo.ok) return null;
    
    const fileUrl = getFileLink(env, fileInfo.result.file_path);
    
    const audioRes = await fetch(fileUrl);
    if (!audioRes.ok) return null;
    const audioBuffer = await audioRes.arrayBuffer();
    
    const formData = new FormData();
    formData.append('file', new Blob([audioBuffer], { type: 'audio/ogg' }), 'voice.ogg');
    formData.append('model', 'whisper-1');
    formData.append('language', 'tr');
    
    const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${env.OPENAI_API_KEY}` },
      body: formData,
    });
    
    if (!res.ok) return null;
    const data = await res.json() as any;
    return data.text || null;
  } catch (e) {
    console.error('Voice transcription error:', e);
    return null;
  }
}

export function parseVoiceRoute(text: string): { from?: string; to?: string; date?: string } | null {
  const lower = text.toLowerCase();
  const patterns = [
    /(?:from|nerden)\s+(\w+(?:\s+\w+)?)\s+(?:to|nereye)\s+(\w+(?:\s+\w+)?)/i,
    /(\w+(?:\s+\w+)?)\s*(?:-|to|ile)\s*(\w+(?:\s+\w+)?)/i,
    /(?:gitmek|fly|uçmak)\s+(?:istiyorum|want)\s+(?:from|nerden)\s+(\w+(?:\s+\w+)?)\s+(?:to|nereye)\s+(\w+(?:\s+\w+)?)/i,
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return { from: match[1].trim(), to: match[2].trim() };
    }
  }
  
  const cities = Object.keys(CITY_COORDS);
  const found = cities.filter(c => lower.includes(c.toLowerCase()));
  if (found.length >= 2) {
    return { from: found[0], to: found[1] };
  }
  
  return null;
}