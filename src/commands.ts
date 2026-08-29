import { Env } from './index';
import { addFavorite } from './db';
import { searchFlights, getHotelLink, getCarLink } from './api';

async function sendTelegram(env: Env, chatId: number, text: string) {
  await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
  });
}

export async function handleMessage(message: any, env: Env) {
  const chatId = message.chat.id;
  const text = message.text ?? '';

  if (text.startsWith('/start')) {
    const help = `Merhaba! 👋\n\nSeyahat Fırsatları botuna hoş geldin.\n\nKullanım:\n• Bir rota yaz: "İstanbul - Paris" (tarih yazabilirsin: 15 Mart)\n• Takip etmek için: "/takip İstanbul - Paris - 1000 TL"\n• Fiyat düşünce haber vereceğim!`;
    await sendTelegram(env, chatId, help);
    return;
  }

  if (text.startsWith('/takip ')) {
    const route = text.replace('/takip ', '').trim();
    await addFavorite(env, chatId, route);
    await sendTelegram(env, chatId, `✅ Takip ediliyor: ${route}\nFiyat düşünce sana haber vereceğim.`);
    return;
  }

  if (text.includes('-')) {
    const [from, to] = text.split('-').map(s => s.trim());
    const flightLinks = await searchFlights(env, from, to);
    const hotelLink = await getHotelLink(env, from, to);
    const carLink = await getCarLink(env, from, to);
    
    const reply = `✈️ Uçuş Fırsatları:\n${flightLinks}\n\n🏨 Otel:\n${hotelLink}\n\n🚗 Araç Kiralama:\n${carLink}`;
    await sendTelegram(env, chatId, reply);
    return;
  }

  await sendTelegram(env, chatId, 'Komut anlaşılmadı. /start yazabilirsin.');
}