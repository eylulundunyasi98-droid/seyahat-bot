// src/telegram.ts
// Telegram Bot API wrapper fonksiyonları

import { Env } from './index';
import { CHANNEL_ID } from './constants';

export interface TelegramMessage {
  message_id: number;
  date: number;
  chat: { id: number; type: string; username?: string; first_name?: string; last_name?: string };
  from?: { id: number; is_bot: boolean; first_name: string; username?: string; language_code?: string };
  text?: string;
  voice?: { file_id: string; file_unique_id: string; duration: number; mime_type?: string; file_size?: number };
  photo?: Array<{ file_id: string; file_unique_id: string; file_size: number; width: number; height: number }>;
}

export interface InlineKeyboardButton {
  text: string;
  url?: string;
  callback_data?: string;
  switch_inline_query?: string;
  switch_inline_query_current_chat?: string;
}

export interface ReplyKeyboardButton {
  text: string;
  request_contact?: boolean;
  request_location?: boolean;
  request_poll?: any;
}

export interface ReplyMarkup {
  inline_keyboard?: InlineKeyboardButton[][];
  keyboard?: ReplyKeyboardButton[][];
  resize_keyboard?: boolean;
  one_time_keyboard?: boolean;
  selective?: boolean;
  remove_keyboard?: boolean;
}

const TELEGRAM_API = 'https://api.telegram.org/bot';

function getBotUrl(env: Env, method: string): string {
  return `${TELEGRAM_API}${env.TELEGRAM_BOT_TOKEN}/${method}`;
}

export async function sendTelegram(
  env: Env,
  chatId: number | string,
  text: string,
  replyMarkup?: ReplyMarkup,
  parseMode: 'HTML' | 'Markdown' | undefined = 'HTML'
): Promise<any> {
  const body: any = {
    chat_id: chatId,
    text,
    parse_mode: parseMode,
    disable_web_page_preview: true,
  };
  if (replyMarkup) body.reply_markup = replyMarkup;

  const res = await fetch(getBotUrl(env, 'sendMessage'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function sendPhoto(
  env: Env,
  chatId: number | string,
  photoUrl: string,
  caption: string,
  replyMarkup?: ReplyMarkup,
  parseMode: 'HTML' | 'Markdown' | undefined = 'HTML'
): Promise<any> {
  const body: any = {
    chat_id: chatId,
    photo: photoUrl,
    caption,
    parse_mode: parseMode,
  };
  if (replyMarkup) body.reply_markup = replyMarkup;

  const res = await fetch(getBotUrl(env, 'sendPhoto'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function sendVoice(
  env: Env,
  chatId: number | string,
  voiceUrl: string,
  caption?: string,
  replyMarkup?: ReplyMarkup
): Promise<any> {
  const body: any = { chat_id: chatId, voice: voiceUrl };
  if (caption) body.caption = caption;
  if (replyMarkup) body.reply_markup = replyMarkup;

  const res = await fetch(getBotUrl(env, 'sendVoice'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function forwardMessage(
  env: Env,
  fromChatId: number | string,
  messageId: number,
  toChatId: number | string
): Promise<any> {
  const res = await fetch(getBotUrl(env, 'forwardMessage'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: toChatId,
      from_chat_id: fromChatId,
      message_id: messageId,
    }),
  });
  return res.json();
}

export async function getFile(env: Env, fileId: string): Promise<any> {
  const res = await fetch(getBotUrl(env, `getFile?file_id=${fileId}`));
  return res.json();
}

export function getFileLink(env: Env, filePath: string): string {
  return `https://api.telegram.org/file/bot${env.TELEGRAM_BOT_TOKEN}/${filePath}`;
}

export async function sendChatAction(env: Env, chatId: number | string, action: string = "typing"): Promise<void> {
  try {
    await fetch(getBotUrl(env, "sendChatAction"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, action }),
    });
  } catch {}
}

export async function sendToChannel(env: Env, text: string, replyMarkup?: ReplyMarkup): Promise<any> {
  return sendTelegram(env, CHANNEL_ID, text, replyMarkup);
}

export async function sendPhotoToChannel(env: Env, photoUrl: string, caption: string, replyMarkup?: ReplyMarkup): Promise<any> {
  return sendPhoto(env, CHANNEL_ID, photoUrl, caption, replyMarkup);
}

export async function answerCallbackQuery(env: Env, callbackQueryId: string, text?: string, showAlert = false): Promise<any> {
  const res = await fetch(getBotUrl(env, 'answerCallbackQuery'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ callback_query_id: callbackQueryId, text, show_alert: showAlert }),
  });
  return res.json();
}

export async function editMessageText(
  env: Env,
  chatId: number | string,
  messageId: number,
  text: string,
  replyMarkup?: ReplyMarkup,
  parseMode: 'HTML' | 'Markdown' | undefined = 'HTML'
): Promise<any> {
  const body: any = { chat_id: chatId, message_id: messageId, text, parse_mode: parseMode };
  if (replyMarkup) body.reply_markup = replyMarkup;

  const res = await fetch(getBotUrl(env, 'editMessageText'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function deleteMessage(env: Env, chatId: number | string, messageId: number): Promise<any> {
  const res = await fetch(getBotUrl(env, 'deleteMessage'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, message_id: messageId }),
  });
  return res.json();
}

export async function setMyCommands(env: Env, commands: Array<{ command: string; description: string }>): Promise<any> {
  const res = await fetch(getBotUrl(env, 'setMyCommands'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ commands }),
  });
  return res.json();
}

export async function sendInvoice(
  env: Env,
  chatId: number,
  title: string,
  description: string,
  payload: string,
  providerToken: string,
  currency: string,
  prices: Array<{ label: string; amount: number }>,
  startParameter?: string
): Promise<any> {
  const body: any = {
    chat_id: chatId,
    title,
    description,
    payload,
    provider_token: providerToken,
    currency,
    prices,
  };
  if (startParameter) body.start_parameter = startParameter;

  const res = await fetch(getBotUrl(env, 'sendInvoice'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function answerPreCheckoutQuery(env: Env, preCheckoutQueryId: string, ok: boolean, errorMessage?: string): Promise<any> {
  const body: any = { pre_checkout_query_id: preCheckoutQueryId, ok };
  if (errorMessage) body.error_message = errorMessage;

  const res = await fetch(getBotUrl(env, 'answerPreCheckoutQuery'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

export function createInlineKeyboard(buttons: InlineKeyboardButton[][]): ReplyMarkup {
  return { inline_keyboard: buttons };
}

export function createReplyKeyboard(buttons: ReplyKeyboardButton[][], resize = true, oneTime = false): ReplyMarkup {
  return { keyboard: buttons, resize_keyboard: resize, one_time_keyboard: oneTime };
}

export function createTravelKeyboard(flightLink: string, hotelLink: string, carLink: string, activityLink?: string): ReplyMarkup {
  const buttons: InlineKeyboardButton[][] = [
    [{ text: '✈️ Uçuş Fırsatı', url: flightLink }],
    [{ text: '🏨 Otel Fırsatı', url: hotelLink }],
    [{ text: '🚗 Araç Kiralama', url: carLink }],
  ];
  if (activityLink) {
    buttons.push([{ text: '🎯 Aktiviteler', url: activityLink }]);
  }
  buttons.push([{ text: '📢 Arkadaşlara Gönder', switch_inline_query: '' }]);
  return { inline_keyboard: buttons };
}

export function createSingleButtonKeyboard(text: string, url: string): ReplyMarkup {
  return { inline_keyboard: [[{ text, url }]] };
}

export function createMainMenuKeyboard(lang: string = 'tr'): ReplyMarkup {
  // Sade kibar menü: 6 buton, 3 satır
  const menus: Record<string, ReplyKeyboardButton[][]> = {
    tr: [
      [{ text: '🧭 Rota Ara' }, { text: '🔥 Günün Bombası' }],
      [{ text: '🌍 Keşfet' }, { text: '⭐ Takip Ettiklerim' }],
      [{ text: '⚙️ Ayarlar' }, { text: 'ℹ️ Yardım' }],
    ],
    en: [
      [{ text: '🧭 Search Route' }, { text: '🔥 Today\'s Deal' }],
      [{ text: '🌍 Explore' }, { text: '⭐ My Tracking' }],
      [{ text: '⚙️ Settings' }, { text: 'ℹ️ Help' }],
    ],
    de: [
      [{ text: '🧭 Route Suchen' }, { text: '🔥 Tagesangebot' }],
      [{ text: '🌍 Entdecken' }, { text: '⭐ Meine Routen' }],
      [{ text: '⚙️ Einstellungen' }, { text: 'ℹ️ Hilfe' }],
    ],
  };
  return createReplyKeyboard(menus[lang] || menus.tr);
}

export function createExploreKeyboard(lang: string = 'tr'): ReplyMarkup {
  // Keşfet alt menüsü - inline olarak gösterilir
  const rows: Record<string, InlineKeyboardButton[][]> = {
    tr: [
      [{ text: '📈 Fiyat Grafiği', callback_data: 'explore_chart' }, { text: '🌤️ Hava + Kur', callback_data: 'explore_weather' }],
      [{ text: '🗣️ Sesli Komut', callback_data: 'explore_voice' }, { text: '📢 Paylaş', callback_data: 'explore_share' }],
      [{ text: '💱 Para Birimi', callback_data: 'explore_currency' }, { text: '🌍 Trendler', callback_data: 'explore_trending' }],
    ],
    en: [
      [{ text: '📈 Chart', callback_data: 'explore_chart' }, { text: '🌤️ Weather', callback_data: 'explore_weather' }],
      [{ text: '🗣️ Voice', callback_data: 'explore_voice' }, { text: '💱 Currency', callback_data: 'explore_currency' }],
    ],
    de: [
      [{ text: '📈 Diagramm', callback_data: 'explore_chart' }, { text: '🌤️ Wetter', callback_data: 'explore_weather' }],
    ],
  };
  return createInlineKeyboard(rows[lang] || rows.tr);
}

export function createLanguageKeyboard(): ReplyMarkup {
  return createInlineKeyboard([
    [{ text: '🇹🇷 Türkçe', callback_data: 'lang_tr' }],
    [{ text: '🇺🇸 English', callback_data: 'lang_en' }],
    [{ text: '🇩🇪 Deutsch', callback_data: 'lang_de' }],
  ]);
}

export function createCurrencyKeyboard(): ReplyMarkup {
  return createInlineKeyboard([
    [{ text: '🇹🇷 TRY (₺)', callback_data: 'curr_TRY' }],
    [{ text: '🇺🇸 USD ($)', callback_data: 'curr_USD' }],
    [{ text: '🇪🇺 EUR (€)', callback_data: 'curr_EUR' }],
    [{ text: '🇬🇧 GBP (£)', callback_data: 'curr_GBP' }],
  ]);
}

export function createShareKeyboard(): ReplyMarkup {
  return createInlineKeyboard([
    [{ text: '📢 Arkadaşlara Gönder', switch_inline_query: '' }],
  ]);
}

export function createRouteActionKeyboard(route: string, price?: number, currency: string = 'TRY'): ReplyMarkup {
  const priceText = price ? ` (${price} ${currency})` : '';
  return createInlineKeyboard([
    [{ text: `✅ Takip Et${priceText}`, callback_data: `track_${route.replace(/\s/g, '_')}_${price || 0}` }],
    [{ text: '📊 Grafik Göster', callback_data: `chart_${route.replace(/\s/g, '_')}` }],
    [{ text: '📢 Paylaş', switch_inline_query: route }],
  ]);
}