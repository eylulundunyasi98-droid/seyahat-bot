// src/constants.ts - Global sabitler
export const CHANNEL_ID = -1004391209534;
export const BOT_USERNAME = "avcisi_firsat_bot";
export const SUPPORTED_LANGUAGES = ["tr", "en", "de"] as const;
export const SUPPORTED_CURRENCIES = ["TRY", "USD", "EUR", "GBP"] as const;
export const DEFAULT_CURRENCY = "TRY";
export const DEFAULT_LANGUAGE = "tr";

// Global trending rotalar (dünya geneli)
export const GLOBAL_TRENDING_ROUTES = [
  "Istanbul - Paris", "London - New York", "Tokyo - Singapore", "Dubai - London",
  "Berlin - Barcelona", "Rome - Amsterdam", "New York - Los Angeles", "Paris - Rome",
  "Bangkok - Bali", "Sydney - Melbourne", "Istanbul - Dubai", "London - Dubai",
  "Berlin - Istanbul", "Madrid - Paris", "Vienna - Prague", "Lisbon - Barcelona",
  "Athens - Rome", "Prague - Budapest", "Cancun - Mexico City", "Rio de Janeiro - Sao Paulo",
  "Toronto - New York", "Vancouver - Los Angeles", "Cairo - Dubai", "Johannesburg - Cape Town",
  "Delhi - Dubai", "Hong Kong - Tokyo", "Seoul - Tokyo", "Singapore - Bali",
  "Amsterdam - Barcelona", "Zurich - Vienna"
];

// Hava durumu + döviz kartı için varsayılan şehirler
export const POPULAR_CITIES = [
  "Paris", "London", "New York", "Tokyo", "Dubai", "Istanbul", "Rome",
  "Barcelona", "Amsterdam", "Berlin", "Vienna", "Prague", "Bangkok", "Sydney"
];
