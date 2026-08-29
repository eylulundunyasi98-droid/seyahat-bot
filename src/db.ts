import { Env } from './index';

export async function addFavorite(env: Env, userId: number, route: string) {
  await env.DB.prepare('INSERT OR IGNORE INTO favorites (user_id, route) VALUES (?, ?)')
    .bind(userId, route)
    .run();
}

export async function getFavorites(env: Env) {
  const { results } = await env.DB.prepare('SELECT * FROM favorites').all();
  return results;
}