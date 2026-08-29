import { Env } from './index';
import { getAllFavorites } from './db';

interface CronEnv extends Env {}

async function sendTelegram(env: CronEnv, chatId: number, text: string) {
  await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
  });
}

async function checkRoutePrice(env: CronEnv, userId: number, route: string) {
  const [from, to] = route.split('-').map(s => s.trim());
  const flightUrl = `https://www.aviasales.com/search?origin=${encodeURIComponent(from)}&destination=${encodeURIComponent(to)}`;
  
  const res = await fetch('https://api.travelpayouts.com/links/v1/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${env.TRAVELPAYOUTS_API_TOKEN}`,
    },
    body: JSON.stringify({
      marker: env.TRAVELPAYOUTS_MARKER,
      url: flightUrl,
    }),
  });
  const data = await res.json() as any;
  const link = data.link ?? flightUrl;
  
  await sendTelegram(env, userId, `🔔 Fiyat kontrolü: ${from} → ${to}\n${link}`);
}

export default async function cronHandler(env: CronEnv) {
  const favorites = await getAllFavorites(env);
  
  for (const fav of favorites) {
    try {
      await checkRoutePrice(env, fav.user_id, fav.route);
    } catch (e) {
      console.error(`Error checking ${fav.route}:`, e);
    }
  }
}