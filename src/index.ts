// src/index.ts - Cloudflare Worker ana girişi
import { handleMessage, handleCallbackQuery, handleInlineQuery } from './commands';
import { handleScheduled } from './cron';

export interface Env {
  DB: D1Database;
  TELEGRAM_BOT_TOKEN: string;
  TRAVELPAYOUTS_API_TOKEN: string;
  TRAVELPAYOUTS_MARKER: string;
  OPENAI_API_KEY?: string;
  CHANNEL_ID?: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // Health check
    if (request.method === 'GET') {
      if (url.pathname === '/health') {
        return new Response(JSON.stringify({ ok: true, worker: 'seyahat-bot', time: new Date().toISOString() }), { headers: { 'Content-Type': 'application/json' } });
      }
      if (url.pathname === '/') {
        return new Response('✈️ Global Seyahat Botu çalışıyor! Webhook: POST /', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
      }
      // Manuel cron tetikleme (GitHub Actions veya admin için)
      if (url.pathname === '/cron' && request.headers.get('Authorization') === `Bearer ${env.TELEGRAM_BOT_TOKEN}`) {
        const { checkPriceAlerts, sendDailyDigest } = await import('./cron');
        const type = url.searchParams.get('type') || 'alerts';
        if (type === 'daily') await sendDailyDigest(env);
        else await checkPriceAlerts(env);
        return new Response(JSON.stringify({ ok: true, type }), { headers: { 'Content-Type': 'application/json' } });
      }
      return new Response('OK', { headers: { 'Content-Type': 'text/plain' } });
    }

    if (request.method === 'POST') {
      try {
        const update: any = await request.json();

        // Telegram update tipleri
        if (update.message) {
          await handleMessage(update.message, env);
        } else if (update.edited_message) {
          await handleMessage(update.edited_message, env);
        } else if (update.callback_query) {
          await handleCallbackQuery(update.callback_query, env);
        } else if (update.inline_query) {
          await handleInlineQuery(update.inline_query, env);
        } else if (update.my_chat_member || update.chat_member) {
          // Bot kanala eklendi/çıkarıldı - logla
          console.log('chat_member update', JSON.stringify(update));
        } else {
          console.log('Unknown update', JSON.stringify(update).slice(0, 500));
        }

        return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
      } catch (e) {
        console.error('fetch error', e);
        return new Response(JSON.stringify({ ok: false, error: String(e) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
      }
    }

    return new Response('Method Not Allowed', { status: 405 });
  },

  async scheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
    console.log('Scheduled', controller.cron, new Date().toISOString());
    // @ts-ignore - handleScheduled expects ScheduledEvent compatible object
    await handleScheduled(controller as unknown as ScheduledEvent, env, ctx);
  },
} satisfies ExportedHandler<Env>;
