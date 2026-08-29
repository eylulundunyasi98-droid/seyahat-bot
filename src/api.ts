import { Env } from './index';

const API_BASE = 'https://api.travelpayouts.com/links/v1/create';

async function createAffiliateLink(env: Env, url: string): Promise<string> {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${env.TRAVELPAYOUTS_API_TOKEN}`,
    },
    body: JSON.stringify({
      marker: env.TRAVELPAYOUTS_MARKER,
      url: url,
    }),
  });
  const data = await res.json() as any;
  return data.link ?? url;
}

export async function searchFlights(env: Env, from: string, to: string): Promise<string> {
  const searchUrl = `https://www.aviasales.com/search?origin=${from}&destination=${to}`;
  return await createAffiliateLink(env, searchUrl);
}

export async function getHotelLink(env: Env, to: string): Promise<string> {
  const hotelUrl = `https://www.booking.com/searchresults.html?ss=${to}`;
  return await createAffiliateLink(env, hotelUrl);
}

export async function getCarLink(env: Env): Promise<string> {
  const carUrl = `https://www.rentalcars.com/`;
  return await createAffiliateLink(env, carUrl);
}