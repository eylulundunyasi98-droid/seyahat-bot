import { Env } from './index';

export async function addFavorite(env: Env, userId: number, route: string) {
  await env.DB.prepare('INSERT OR IGNORE INTO favorites (user_id, route) VALUES (?, ?)')
    .bind(userId, route)
    .run();
}

export async function getFavorites(env: Env, userId: number) {
  const result = await env.DB.prepare('SELECT route FROM favorites WHERE user_id = ?')
    .bind(userId)
    .all();
  return result.results.map((r: any) => r.route);
}

export async function getAllFavorites(env: Env) {
  const result = await env.DB.prepare('SELECT user_id, route FROM favorites').all();
  return result.results as { user_id: number; route: string }[];
}