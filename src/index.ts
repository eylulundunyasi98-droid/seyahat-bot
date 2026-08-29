// src/index.ts - Cloudflare Worker ana girişi + güvenlik + kısa link
import { handleMessage, handleCallbackQuery, handleInlineQuery } from './commands';
import { handleScheduled } from './cron';

export interface Env {
  DB: D1Database;
  TELEGRAM_BOT_TOKEN: string;
  TRAVELPAYOUTS_API_TOKEN: string;
  TRAVELPAYOUTS_MARKER: string;
  TRAVELPAYOUTS_TRS?: string;
  OPENAI_API_KEY?: string;
  CHANNEL_ID?: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // Güvenlik header'ları
    const secHeaders = {
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    };

    if (request.method === 'GET') {
      // Kısa link redirect: /r/abc123 -> 302 affiliate
      if (url.pathname.startsWith('/r/')) {
        const id = url.pathname.replace('/r/', '').trim();
        if (id) {
          try {
            const { resolveShortLink } = await import('./db');
            const target = await resolveShortLink(env, id);
            if (target) {
              return new Response(null, { status: 302, headers: { Location: target, ...secHeaders } });
            }
          } catch {}
          return new Response('Link bulunamadı', { status: 404, headers: secHeaders });
        }
      }
      if (url.pathname === '/health') {
        return new Response(JSON.stringify({ ok: true, worker: 'seyahat-bot', time: new Date().toISOString() }), { headers: { 'Content-Type': 'application/json', ...secHeaders } });
      }
      if (url.pathname === '/' ) {
        const { renderLanding } = await import('./blog');
        return new Response(renderLanding(), { headers: { 'Content-Type': 'text/html; charset=utf-8', ...secHeaders } });
      }
      if (url.pathname === '/blog' || url.pathname === '/blog/') {
        const { renderBlogIndex } = await import('./blog');
        return new Response(renderBlogIndex(), { headers: { 'Content-Type': 'text/html; charset=utf-8', ...secHeaders } });
      }
      if (url.pathname.startsWith('/blog/')) {
        const slug = url.pathname.replace('/blog/', '').replace(/\/$/, '');
        const { renderPost } = await import('./blog');
        const html = renderPost(slug);
        if (html) return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8', ...secHeaders } });
        return new Response('Yazı bulunamadı', { status: 404, headers: { 'Content-Type': 'text/plain; charset=utf-8', ...secHeaders } });
      }
      if (url.pathname === '/sitemap.xml') {
        const { renderSitemap } = await import('./blog');
        return new Response(renderSitemap(), { headers: { 'Content-Type': 'application/xml', ...secHeaders } });
      }
      if (url.pathname === '/sitemap' || url.pathname === '/sitemap/') {
        const { renderSitemapHTML } = await import('./blog');
        return new Response(renderSitemapHTML(), { headers: { 'Content-Type': 'text/html; charset=utf-8', ...secHeaders } });
      }
      if (url.pathname === '/robots.txt') {
        return new Response(`User-agent: *\nAllow: /\nSitemap: https://seyahat-bot.eylulundunyasi98.workers.dev/sitemap.xml`, { headers: { 'Content-Type': 'text/plain', ...secHeaders } });
      }
      if (url.pathname === '/cron' && request.headers.get('Authorization') === `Bearer ${env.TELEGRAM_BOT_TOKEN}`) {
        const { checkPriceAlerts, sendDailyDigest } = await import('./cron');
        const type = url.searchParams.get('type') || 'alerts';
        if (type === 'daily') await sendDailyDigest(env);
        else await checkPriceAlerts(env);
        return new Response(JSON.stringify({ ok: true, type }), { headers: { 'Content-Type': 'application/json', ...secHeaders } });
      }
      // BotFather setMyCommands helper: /setup?token=xxx
      if (url.pathname === '/setup' && url.searchParams.get('token') === env.TELEGRAM_BOT_TOKEN) {
        const { setMyCommands } = await import('./telegram');
        await setMyCommands(env, [
          { command: "start", description: "Menüyü aç" },
          { command: "takip", description: "Rota + fiyat alarmı kur" },
          { command: "grafik", description: "Fiyat grafiği göster" },
          { command: "hava", description: "Hava durumu + kur" },
          { command: "kur", description: "Döviz kurları" },
          { command: "dil", description: "Dil değiştir" },
          { command: "para", description: "Para birimi değiştir" },
          { command: "trending", description: "Trend rotalar" },
        ]);
        return new Response(JSON.stringify({ ok: true, msg: "commands set" }), { headers: { 'Content-Type': 'application/json', ...secHeaders } });
      }
      return new Response('OK', { headers: { 'Content-Type': 'text/plain', ...secHeaders } });
    }

    if (request.method === 'POST') {
      try {
        // Basit anti-spam: sadece Telegram IP'lerinden gelmeli - header kontrol
        // Cloudflare zaten filtreler, burada hız limiti D1'de
        const update: any = await request.json();
        // Rate limit için user_id çıkar
        const uid = update.message?.from?.id || update.callback_query?.from?.id || update.inline_query?.from?.id;
        if (uid) {
          const { checkRateLimit } = await import('./db');
          const ok = await checkRateLimit(env, uid, 25, 60);
          if (!ok) {
            return new Response(JSON.stringify({ ok: true, rate_limited: true }), { headers: { 'Content-Type': 'application/json', ...secHeaders } });
          }
        }

        if (update.message) {
          await handleMessage(update.message, env);
        } else if (update.edited_message) {
          await handleMessage(update.edited_message, env);
        } else if (update.callback_query) {
          await handleCallbackQuery(update.callback_query, env);
        } else if (update.inline_query) {
          await handleInlineQuery(update.inline_query, env);
        } else if (update.my_chat_member || update.chat_member) {
          console.log('chat_member', JSON.stringify(update).slice(0, 500));
        } else {
          console.log('Unknown update', JSON.stringify(update).slice(0, 500));
        }

        return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json', ...secHeaders } });
      } catch (e) {
        console.error('fetch error', e);
        return new Response(JSON.stringify({ ok: false, error: String(e) }), { status: 500, headers: { 'Content-Type': 'application/json', ...secHeaders } });
      }
    }

    return new Response('Method Not Allowed', { status: 405, headers: secHeaders });
  },

  async scheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
    console.log('Scheduled', controller.cron, new Date().toISOString());
    // @ts-ignore
    await handleScheduled(controller as unknown as ScheduledEvent, env, ctx);
  },
} satisfies ExportedHandler<Env>;
