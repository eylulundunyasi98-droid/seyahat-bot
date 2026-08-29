import { Env } from './index';
import { sendTelegram } from './telegram';
import { searchFlights, getHotelLink, getCarLink } from './api';
import { addFavorite } from './db';

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
    const flightLink = await searchFlights(env, from, to);
    const hotelLink = await getHotelLink(env, to);
    const carLink = await getCarLink(env);
    
    const reply = `✈️ Uçuş: ${flightLink}\n\n🏨 Otel: ${hotelLink}\n\n🚗 Araç: ${carLink}`;
    await sendTelegram(env, chatId, reply);
    return;
  }

  await sendTelegram(env, chatId, 'Komut anlaşılmadı. /start yazabilirsin.');
}