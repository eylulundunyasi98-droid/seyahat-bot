import { handleMessage } from './commands';
import cronHandler from './cron';

export interface Env {
  DB: D1Database;
  TELEGRAM_BOT_TOKEN: string;
  TRAVELPAYOUTS_API_TOKEN: string;
  TRAVELPAYOUTS_MARKER: string;
}

export default {
  async fetch(request: Request, env: Env) {
    if (request.method === 'POST') {
      const body = await request.json() as any;
      if (body.message) {
        await handleMessage(body.message, env);
      }
      return new Response('OK');
    }
    return new Response('OK');
  },

  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    await cronHandler(env);
  }
};