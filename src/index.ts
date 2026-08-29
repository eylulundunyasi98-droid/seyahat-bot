import { Bot, Context, session } from "grammy";
import { D1Database } from "@cloudflare/workers-types";

interface Env {
  DB: D1Database;
  BOT_TOKEN: string;
  TRAVELPAYOUTS_TOKEN: string;
  R2_BUCKET: R2Bucket;
}

interface SessionData {
  lang?: string;
  state?: string;
  data?: Record<string, unknown>;
}

interface MyContext extends Context {
  session: SessionData;
}

const travelPayoutsApi = "https://api.travelpayouts.com/v2";

async function initDB(db: D1Database) {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      user_id INTEGER PRIMARY KEY,
      lang TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS favorites (
      user_id INTEGER,
      route TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS price_alerts (
      user_id INTEGER,
      route TEXT,
      target_price REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

async function getOrCreateUser(db: D1Database, userId: number, lang: string) {
  const existing = await db.prepare("SELECT * FROM users WHERE user_id = ?").bind(userId).first();
  if (!existing) {
    await db.prepare("INSERT INTO users (user_id, lang) VALUES (?, ?)").bind(userId, lang).run();
  }
  return existing || { user_id: userId, lang };
}

async function searchFlights(env: Env, origin: string, destination: string, date: string) {
  const url = `${travelPayoutsApi}/prices/latest?currency=rub&period_type=day&page=1&limit=30&sorting=price&trip_class=0&origin=${origin}&destination=${destination}&depart_date=${date}&token=${env.TRAVELPAYOUTS_TOKEN}`;
  const response = await fetch(url);
  return response.json();
}

async function searchHotels(env: Env, locationId: string, checkIn: string, checkOut: string) {
  const url = `${travelPayoutsApi}/hotels/search?location_id=${locationId}&check_in=${checkIn}&check_out=${checkOut}&adults=1&currency=rub&token=${env.TRAVELPAYOUTS_TOKEN}`;
  const response = await fetch(url);
  return response.json();
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    await initDB(env.DB);

    const bot = new Bot<MyContext>(env.BOT_TOKEN);
    
    bot.use(session({ initial: () => ({}) }));

    bot.command("start", async (ctx) => {
      const user = await getOrCreateUser(env.DB, ctx.from!.id, ctx.from?.language_code || "tr");
      await ctx.reply(
        `Merhaba ${ctx.from?.first_name}! 🎒\n\n` +
        `Ben seyahat asistanınızım. Uçak bileti, otel fiyatları ve seyahat planlaması konularında size yardımcı olabilirim.\n\n` +
        `Komutlar:\n` +
        `/ucak - Uçak bileti ara\n` +
        `/otel - Otel ara\n` +
        `/favoriler - Favori rotalarım\n` +
        `/alarmlar - Fiyat alarmlarım\n` +
        `/yardim - Yardım`
      );
    });

    bot.command("yardim", async (ctx) => {
      await ctx.reply(
        `📋 <b>Komutlar:</b>\n\n` +
        `/ucak - Uçak bileti fiyatlarını ara\n` +
        `/otel - Otel fiyatlarını ara\n` +
        `/favoriler - Kaydedilen favori rotalar\n` +
        `/alarmlar - Fiyat düşüş alarmları\n` +
        `/dil - Bot dilini değiştir\n\n` +
        `Örnek: /ucak IST SAW 2026-09-15`,
        { parse_mode: "HTML" }
      );
    });

    bot.command("ucak", async (ctx) => {
      const args = ctx.match?.split(" ").filter(Boolean) || [];
      if (args.length < 3) {
        await ctx.reply("Kullanım: /ucak <kalkış> <varış> <tarih>\nÖrn: /ucak IST SAW 2026-09-15");
        return;
      }
      const [origin, destination, date] = args;
      await ctx.reply("🔍 Uçak biletleri aranıyor...");
      
      try {
        const data = await searchFlights(env, origin, destination, date);
        if (data.success && data.data && data.data.length > 0) {
          const flights = data.data.slice(0, 5).map((f: any) => 
            `✈️ ${f.airline} - ${f.departure_at} → ${f.arrival_at}\n💰 ${f.price} ${data.currency}`
          ).join("\n\n");
          await ctx.reply(`✈️ <b>${origin} → ${destination} (${date})</b>\n\n${flights}`, { parse_mode: "HTML" });
        } else {
          await ctx.reply("Uçuş bulunamadı veya API hatası oluştu.");
        }
      } catch (e) {
        await ctx.reply("Arama sırasında hata oluştu.");
      }
    });

    bot.command("favoriler", async (ctx) => {
      const rows = await env.DB.prepare("SELECT route FROM favorites WHERE user_id = ?").bind(ctx.from!.id).all();
      if (rows.results.length === 0) {
        await ctx.reply("Henüz favori rotanız yok. /ucak aramasından sonra rota kaydedebilirsiniz.");
        return;
      }
      const list = rows.results.map((r: any, i: number) => `${i + 1}. ${r.route}`).join("\n");
      await ctx.reply(`⭐ <b>Favori Rotalarınız:</b>\n\n${list}`, { parse_mode: "HTML" });
    });

    bot.command("alarmlar", async (ctx) => {
      const rows = await env.DB.prepare("SELECT route, target_price FROM price_alerts WHERE user_id = ?").bind(ctx.from!.id).all();
      if (rows.results.length === 0) {
        await ctx.reply("Henüz fiyat alarmınız yok.");
        return;
      }
      const list = rows.results.map((r: any, i: number) => `${i + 1}. ${r.route} - Hedef: ${r.target_price} ₺`).join("\n");
      await ctx.reply(`🔔 <b>Fiyat Alarmlarınız:</b>\n\n${list}`, { parse_mode: "HTML" });
    });

    bot.on("message:text", async (ctx) => {
      if (ctx.session.state === "add_favorite") {
        await env.DB.prepare("INSERT INTO favorites (user_id, route) VALUES (?, ?)").bind(ctx.from!.id, ctx.message.text).run();
        ctx.session.state = undefined;
        await ctx.reply("✅ Rota favorilere eklendi!");
      } else if (ctx.session.state === "add_alert") {
        const [route, price] = ctx.message.text.split(" ").filter(Boolean);
        if (route && price) {
          await env.DB.prepare("INSERT INTO price_alerts (user_id, route, target_price) VALUES (?, ?, ?)").bind(ctx.from!.id, route, parseFloat(price)).run();
          ctx.session.state = undefined;
          await ctx.reply("✅ Fiyat alarmı oluşturuldu!");
        } else {
          await ctx.reply("Format: <rota> <fiyat>\nÖrn: IST-SAW 5000");
        }
      }
    });

    const url = new URL(request.url);
    if (url.pathname === "/webhook") {
      return await bot.handleUpdate(await request.json(), request);
    }

    if (url.pathname === "/setwebhook") {
      const webhookUrl = `${url.origin}/webhook`;
      await bot.api.setWebhook(webhookUrl);
      return new Response(`Webhook set to ${webhookUrl}`);
    }

    return new Response("Seyhat Bot is running! 🎒");
  }
} satisfies ExportedHandler<Env>;