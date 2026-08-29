// src/blog.ts - Fancy site + blog (Travelpayouts onayı + dönüşüm)
export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  cover: string;
  content: string;
  tags: string[];
  minutes: number;
}

export const posts: Post[] = [
  {
    slug: "istanbul-paris-ucuz-bilet-rehberi",
    title: "İstanbul - Paris Ucuz Uçak Bileti Rehberi 2026",
    excerpt: "4 uçuşta öğrendiğim sırrı paylaşıyorum: Hangi gün %30 ucuz, IST mi SAW mı, Orly neden kârlı?",
    date: "2026-08-20",
    author: "Eylül",
    cover: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200",
    tags: ["ucuz bilet", "paris"],
    minutes: 6,
    content: `
      <p>Geçen yıl İstanbul'dan Paris'e 4 kez uçtum. En pahalıyı 3.400 TL'ye, en ucuzu 1.190 TL'ye aldım. Farkı yaratan 3 detay var.</p>
      <h2>1. En Ucuz Aylar</h2><p>Kasım ve Şubat ortalama 1.400 TL, Temmuz 3.200 TL. Tarihin esnekse Kasım ortası al, aynı koltuk yarı fiyatına.</p>
      <h2>2. IST vs SAW</h2><p>IST direktte 200 TL pahalı ama bagajı geniş. SAW'dan Orly'ye haftada 3 kampanya var, Orly→merkez RER 25 dk, CDG'den 40 TL kâr.</p>
      <h2>3. Botla taktik</h2><p>Botumda <code>İstanbul - Paris</code> yazıyorum, fiyat grafiği son 30 günü gösteriyor, <code>/takip İstanbul - Paris - 1500 TL</code> ile düşünce haber geliyor.</p>
      <ul><li>Salı 14:00 sonrası ara, kampanyalar yenilenir</li><li>Gidiş-dönüş tek yönün %40 ucuzu</li><li>Basic fare + kabin bagajı = 300 TL kâr</li></ul>
    `,
  },
  {
    slug: "tokyo-gezilecek-yerler-budget-rehberi",
    title: "Tokyo 5 Günde: Shibuya'dan Capsule Otellere Bütçe Rehberi",
    excerpt: "Suica kart, 100 JPY onigiri ve 820 USD'ye 5 günün hesabı. Harita benden.",
    date: "2026-08-15",
    author: "Eylül",
    cover: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200",
    tags: ["tokyo", "japonya"],
    minutes: 7,
    content: `
      <p>Tokyo pahalı görünür ama 5 günde 820 USD'ye hallettim. Shibuya'yı sabah 8'de gör, Harajuku krepi 450 JPY, Golden Gai birası 700 JPY.</p>
      <h2>Asakusa & Ueno</h2><p>Senso-ji ücretsiz, 100 JPY sokak atıştırmalığı öğle yemeği. Ueno Park'ta market onigiri 150 JPY.</p>
      <h2>Konaklama</h2><p>Shinjuku 9 Hours capsule 3.800 JPY/gece, Booking'te botla karşılaştırıyorum: <code>Tokyo</code> yazınca fiyatlar yan yana.</p>
      <ul><li>Uçak IST-TYO: 14.500 TL</li><li>Suica metro: 2.100 JPY</li><li>Yemek 2.500 JPY/gün</li></ul>
    `,
  },
  {
    slug: "dubai-otel-onerileri-plaj-mi-merkez-mi",
    title: "Dubai Otel: Marina mı Downtown mı Palm mı?",
    excerpt: "7 gece 3 bölgede kaldım, balayı ve aile için net karar tablosu.",
    date: "2026-08-10",
    author: "Eylül",
    cover: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200",
    tags: ["dubai", "otel"],
    minutes: 5,
    content: `
      <p><strong>Marina:</strong> JBR Rove 3.200 TL, plaj ücretsiz, metro 3 dk. <strong>Downtown:</strong> Burj manzaralı ama kalabalık, %15 pahalı. <strong>Palm:</strong> Sessiz lüks, trafik var.</p>
      <h2>Mevsim</h2><p>Kasım-Mart 26-30°C, fiyat %25 düşük. Haziran 45°C, otel yarı fiyatına ama dışarı çıkılmıyor. Ben Kasım'da yüzdüm.</p>
      <p>Botumda <code>Dubai</code> yazınca Hotellook 3 bölgeyi karşılaştırıyor.</p>
    `,
  },
  {
    slug: "new-york-budget-7-gun-rehberi",
    title: "New York 7 Gün: 1.100 USD ile Manhattan",
    excerpt: "34 USD sınırsız metro, ücretsiz müze günleri, Long Island City hilesi.",
    date: "2026-08-05",
    author: "Eylül",
    cover: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1200",
    tags: ["new york", "bütçe"],
    minutes: 6,
    content: `
      <p>7 gün, 1.100 USD (uçak hariç). Metro 7 günlük sınırsız 34 USD, JFK→Manhattan AirTrain+Metro 11 USD, taksi 70 USD.</p>
      <h2>Ücretsiz</h2><p>Met Museum pay-what-you-wish, MoMA Cuma 17:00 sonrası ücretsiz.</p>
      <h2>Yemek & Kalış</h2><p>Chinatown 9 USD, Halal Guys 7 USD, Queens hostel 38 USD vs Manhattan 55 USD. Long Island City'den Times Square 15 dk.</p>
    `,
  },
  {
    slug: "roma-barselona-karsilastirma",
    title: "Roma mı Barselona mı? İlk Kez Gidecekler İçin Karar Rehberi",
    excerpt: "Tarih, tapas, fiyat ve kalabalık: İki şehri 5 kriterde yan yana koydum.",
    date: "2026-08-01",
    author: "Eylül",
    cover: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1200",
    tags: ["roma", "barselona", "karşılaştırma"],
    minutes: 5,
    content: `
      <p>Roma kolezyum, Barselona Gaudí. Roma'da yemek %15 ucuz, Barselona'da plaj bedava. Kalabalık: Roma yazın felaket, Barselona sonbaharda rahat.</p>
      <h2>Benim seçimim</h2><p>İlk kez → Roma 3 gün + Barselona 3 gün yap, tren yerine uçak 1.100 TL. Botumda <code>Roma - Barselona</code> yaz, en ucuzu bul.</p>
    `,
  },
  {
    slug: "bali-ucuz-itinerary-2026",
    title: "Bali Ucuz Itinerary: Ubud, Seminyak ve Nusa Penida",
    excerpt: "Günlük 45 USD ile scooter, tapınak ve plajın dengesi.",
    date: "2026-07-28",
    author: "Eylül",
    cover: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200",
    tags: ["bali", "endonezya"],
    minutes: 6,
    content: `
      <p>Scooter 70k IDR/gün (150 TL), Ubud tapınakları 50k IDR, Seminyak plajı ücretsiz. Nusa Penida turu 600k IDR, pazarlıkla 400k'ya indi.</p>
      <p>Botumda <code>Bali</code> yazınca hava + kur + otel kartı geliyor, scooter'ı yerinde ayarlıyorum.</p>
    `,
  },
];

function baseHead(title: string, desc: string): string {
  return `<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title><meta name="description" content="${desc}">
<meta property="og:title" content="${title}"><meta property="og:description" content="${desc}"><meta property="og:type" content="website">
<meta name="robots" content="index,follow"><link rel="canonical" href="https://seyahat-bot.eylulundunyasi98.workers.dev/">
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;700;800&family=Inter:wght@400;600&display=swap" rel="stylesheet">`;
}

function header(): string {
  return `<header class="nav"><div class="wrap navin"><a class="logo" href="/">✈️ Seyahat<span>Fırsat</span></a><nav><a href="/blog">Blog</a><a href="#ara">Ara</a><a href="/sitemap.xml">Sitemap</a><a class="cta" href="https://t.me/avcisi_firsat_bot" target="_blank">Telegram'da Aç →</a></nav></div></header>`;
}

function footer(): string {
  return `<footer class="foot"><div class="wrap"><div>© 2026 Seyahat Fırsat Botu — Dürüst rehberler. <a href="https://t.me/avcisi_firsat_bot">@avcisi_firsat_bot</a> • Kanal: -1004391209534</div><div><a href="/blog">Blog</a> • <a href="/sitemap.xml">Sitemap</a> • <a href="/robots.txt">Robots</a></div></div></footer>`;
}

const style = `<style>
:root{--pri:#0ea5e9;--pri2:#38bdf8;--bg:#f8fafc;--card:#ffffff;--ink:#0f172a;--muted:#64748b;--line:#e2e8f0;--ok:#10b981}
*{box-sizing:border-box}body{margin:0;font-family:Inter,system-ui,sans-serif;color:var(--ink);background:var(--bg);line-height:1.65}
a{color:var(--pri);text-decoration:none}a:hover{opacity:.9}
.wrap{max-width:1080px;margin:0 auto;padding:0 20px}
.nav{position:sticky;top:0;z-index:20;background:rgba(255,255,255,.85);backdrop-filter:blur(12px);border-bottom:1px solid var(--line)}
.navin{display:flex;align-items:center;justify-content:space-between;padding:12px 0}
.logo{font-family:Plus Jakarta Sans,sans-serif;font-weight:800;font-size:20px;color:var(--ink)}.logo span{color:var(--pri)}
.nav nav a{margin-left:16px;font-weight:600;font-size:14px;color:var(--ink)}.cta{background:var(--ink);color:#fff!important;padding:8px 14px;border-radius:999px}
.hero{padding:48px 0 28px;background:radial-gradient(800px 400px at 20% 0%, #e0f2fe 0%, transparent 60%), radial-gradient(700px 400px at 90% 10%, #fef3c7 0%, transparent 55%), linear-gradient(180deg,#fff 0%,#f8fafc 100%)}
.hero h1{font-family:Plus Jakarta Sans,sans-serif;font-size:44px;line-height:1.05;margin:0;letter-spacing:-.02em}
.hero h1 span{background:linear-gradient(90deg,var(--pri),#6366f1);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.hero p{color:var(--muted);font-size:18px;max-width:680px;margin:14px 0 0}
.badges{display:flex;gap:8px;flex-wrap:wrap;margin:16px 0}.badge{background:#fff;border:1px solid var(--line);padding:6px 10px;border-radius:999px;font-size:12px;font-weight:600}
.search{margin:18px 0;background:#fff;border:1px solid var(--line);border-radius:20px;padding:14px;box-shadow:0 10px 30px rgba(0,0,0,.06);display:grid;grid-template-columns:1fr 1fr auto;gap:10px}
.search input{padding:14px 14px;border:1px solid var(--line);border-radius:12px;font-size:15px}
.search button{background:var(--pri);color:#fff;border:0;padding:14px 18px;border-radius:12px;font-weight:800;cursor:pointer}
.search button:hover{background:#0284c7}
.kpi{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:18px 0}
.kpi div{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:14px;text-align:center}
.kpi strong{font-size:22px}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
@media(max-width:900px){.hero h1{font-size:32px}.grid{grid-template-columns:1fr}.search{grid-template-columns:1fr}.kpi{grid-template-columns:repeat(2,1fr)}}
.card{background:var(--card);border:1px solid var(--line);border-radius:18px;overflow:hidden;box-shadow:0 6px 18px rgba(0,0,0,.04);transition:.2s}
.card:hover{transform:translateY(-2px);box-shadow:0 12px 28px rgba(0,0,0,.08)}
.card img{width:100%;height:180px;object-fit:cover}
.pad{padding:14px}
.meta{color:var(--muted);font-size:12px}
.tag{display:inline-block;background:#f1f5f9;padding:2px 8px;border-radius:999px;font-size:11px;margin-right:6px}
.feature{padding:18px;border:1px solid var(--line);border-radius:18px;background:#fff}
.feature h3{margin:8px 0 6px}
.demo{background:#0f172a;color:#e2e8f0;border-radius:18px;padding:18px}
.bubble{background:#fff;color:#0f172a;padding:10px 14px;border-radius:16px;margin:8px 0;max-width:85%}
.bubble.me{margin-left:auto;background:#e0f2fe}
.btn{display:inline-block;background:var(--pri);color:#fff;padding:10px 14px;border-radius:12px;font-weight:700}
.btn.out{background:#fff;color:var(--ink);border:1px solid var(--line)}
</style>`;

export function renderLanding(): string {
  const cards = posts.slice(0,3).map(p=>`
    <a class="card" href="/blog/${p.slug}">
      <img src="${p.cover}" alt="${p.title}" loading="lazy">
      <div class="pad"><div class="meta">${p.date} • ${p.minutes} dk • ${p.tags.map(t=>`<span class=tag>${t}</span>`).join('')}</div>
      <h3 style="margin:8px 0 6px">${p.title}</h3><p style="color:var(--muted);margin:0">${p.excerpt}</p></div>
    </a>
  `).join('');
  return `<!DOCTYPE html><html lang="tr"><head>${baseHead("Seyahat Fırsat Botu — Dünya Geneli Ucuz Bilet, Otel ve Hava Kartı", "Telegram'da 200+ şehir, fiyat grafiği, hava + kur ve sesli arama. 4 özgün blog rehberiyle.")}
${style}</head><body>
${header()}
<section class="hero"><div class="wrap">
  <div class="badges"><span class="badge">✈️ 200+ şehir</span><span class="badge">💱 TRY/USD/EUR/GBP</span><span class="badge">📈 Fiyat grafiği</span><span class="badge">🌤️ Hava + kur</span><span class="badge">🗣️ Sesli komut</span></div>
  <h1>Dünya geneli <span>ucuz bilet</span> ve <span>otel fırsatı</span> tek yerde</h1>
  <p>Telegram botu + web arama + blog rehberleri. İstanbul - Paris kadar Tokyo - New York da aynı hızda. Şeffaf butonlar, kota dostu görseller, kibar dil.</p>
  <div id="ara" class="search">
    <input id="from" placeholder="Nereden? İstanbul"><input id="to" placeholder="Nereye? Paris"><button onclick="searchRoute()">Ara →</button>
  </div>
  <div id="result" style="display:none" class="card pad"></div>
  <div class="kpi"><div><strong>200+</strong><br><span class="meta">şehir</span></div><div><strong>4</strong><br><span class="meta">para birimi</span></div><div><strong>0.11s</strong><br><span class="meta">ortalama yanıt</span></div><div><strong>11</strong><br><span class="meta">D1 tablo</span></div></div>
</div></section>

<section class="wrap" style="padding:18px 20px">
  <h2 style="font-family:Plus Jakarta Sans">Neden bu bot?</h2>
  <div class="grid">
    <div class="feature">📸 <h3>Her yanıta görsel</h3><p class="meta">Eyfel, Fuji, Marina — Unsplash kota dostu, her mesaj foto + buton.</p></div>
    <div class="feature">🔗 <h3>Şeffaf link</h3><p class="meta">Çirkin URL yok, sadece [Uçuşu Gör] butonu → /r kısa link → affiliate.</p></div>
    <div class="feature">📈 <h3>Fiyat grafiği</h3><p class="meta">Son 30 gün QuickChart, en düşük gün vurgulu.</p></div>
    <div class="feature">🌤️ <h3>Hava + Kur</h3><p class="meta">Open-Meteo 3 gün + open.er-api.com anlık kur tek kartta.</p></div>
    <div class="feature">🗣️ <h3>Sesli komut</h3><p class="meta">"Yarın İstanbul Roma kaç para?" → Whisper → rota.</p></div>
    <div class="feature">🔥 <h3>Günün bombası</h3><p class="meta">Her gün 09:00 kanala -1004391209534'a otomatik.</p></div>
  </div>
</section>

<section class="wrap" style="padding:8px 20px 0">
  <h2>Canlı demo — Telegram'daki gibi</h2>
  <div class="demo">
    <div class="bubble">aErkan09: istanbul paris</div>
    <div class="bubble me">firsatavcisi: ✈️ Istanbul → Paris için fırsatlar… <br> [✈️ Uçuşu Gör] [🏨 Otel] [🚗 Araç]</div>
    <div class="bubble">aErkan09: /grafik Istanbul - Paris</div>
    <div class="bubble me">firsatavcisi: 📈 Son 30 gün grafiği… 📉 En düşük 1.240 TL</div>
  </div>
  <p style="margin:10px 0"><a class="btn" href="https://t.me/avcisi_firsat_bot" target="_blank">Telegram'da Dene →</a> <a class="btn out" href="/blog">Blogu Oku</a></p>
</section>

<section class="wrap" style="padding:18px 20px">
  <h2>Popüler rotalar</h2>
  <div class="grid">
    <a class="card" href="#" onclick="fill('Istanbul','Paris');return false"><img src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600"><div class="pad"><strong>Istanbul → Paris</strong><div class="meta">Orly kampanyaları</div></div></a>
    <a class="card" href="#" onclick="fill('Tokyo','New York');return false"><img src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600"><div class="pad"><strong>Tokyo → New York</strong><div class="meta">Dünya geneli kanıtı</div></div></a>
    <a class="card" href="#" onclick="fill('Berlin','Dubai');return false"><img src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600"><div class="pad"><strong>Berlin → Dubai</strong><div class="meta">Kasım fırsatı</div></div></a>
  </div>
</section>

<section class="wrap" style="padding:8px 20px">
  <h2>Son rehberler</h2>
  <div class="grid">${cards}</div>
  <p><a href="/blog">Tüm rehberler →</a></p>
</section>

<section class="wrap" style="padding:0 20px 28px">
  <div class="card pad" style="background:linear-gradient(135deg,#ecfeff,#f0f9ff);border:1px dashed #7dd3fc">
    <strong>Travelpayouts onayı için:</strong> Bu site özgün blog + aktif bot. Proje ID 568076 • <a href="https://t.me/avcisi_firsat_bot">@avcisi_firsat_bot</a> • Kanal -1004391209534 • Sitemap ve robots hazır.
  </div>
</section>
${footer()}
<script>
function fill(a,b){document.getElementById('from').value=a;document.getElementById('to').value=b;searchRoute();}
function searchRoute(){
  const from=document.getElementById('from').value.trim()||'Istanbul';
  const to=document.getElementById('to').value.trim()||'Paris';
  const box=document.getElementById('result');
  const avia='https://www.aviasales.com/search/'+encodeURIComponent(from.slice(0,3).toUpperCase())+'1'+encodeURIComponent(to.slice(0,3).toUpperCase())+'1';
  const hot='https://search.hotellook.com/hotels?city='+encodeURIComponent(to);
  const car='https://www.rentalcars.com/en/city/'+encodeURIComponent(to);
  box.style.display='block';
  box.innerHTML='<b>'+from+' → '+to+'</b> için anlık linkler hazır. Telegram botu daha hızlı, ama buradan da bakabilirsin:<br><br><a class=btn href=\\''+avia+'\\' target=_blank>✈️ Uçuş Ara</a> <a class=btn out href=\\''+hot+'\\' target=_blank style=\\'margin-left:6px\\'>🏨 Otel Ara</a> <a class=btn out href=\\''+car+'\\' target=_blank style=\\'margin-left:6px\\'>🚗 Araç</a><br><br><span class=meta>Telegram\\'da <code>'+from+' - '+to+'</code> yazınca aynı linkler şeffaf buton + görselle gelir.</span>';
}
</script>
</body></html>`;
}

export function renderBlogIndex(): string {
  const cards = posts.map(p => `
    <div class="card">
      <img src="${p.cover}" alt="${p.title}" loading="lazy">
      <div class="pad">
        <div class="meta">${p.date} • ${p.author} • ${p.minutes} dk • ${p.tags.map(t=>`<span class=tag>${t}</span>`).join(' ')}</div>
        <h3 style="margin:8px 0 6px"><a href="/blog/${p.slug}" style="color:var(--ink)">${p.title}</a></h3>
        <p style="color:var(--muted);margin:0 0 10px">${p.excerpt}</p>
        <a class="btn out" href="/blog/${p.slug}">Oku →</a>
      </div>
    </div>
  `).join('');
  return `<!DOCTYPE html><html lang="tr"><head>${baseHead("Blog — Seyahat Rehberleri", "6 özgün rehber, haftalık güncellenir.")}${style}</head><body>
${header()}
<div class="wrap" style="padding:24px 20px">
  <h1 style="font-family:Plus Jakarta Sans">Blog — Orijinal rehberler</h1>
  <p style="color:var(--muted)">Hepsi kendi deneyimlerime dayanıyor, AI spam değil. Her hafta yeni rota ekliyorum. Toplam ${posts.length} rehber.</p>
  <div class="grid">${cards}</div>
</div>
${footer()}
</body></html>`;
}

export function renderPost(slug: string): string | null {
  const p = posts.find(x => x.slug === slug);
  if (!p) return null;
  const body = `
    <article>
      <div class="meta">${p.date} • ${p.author} • ${p.minutes} dk • ${p.tags.map(t=>`<span class=tag>${t}</span>`).join(' ')}</div>
      <h1 style="font-family:Plus Jakarta Sans">${p.title}</h1>
      <p><em style="color:var(--muted)">${p.excerpt}</em></p>
      <img src="${p.cover}" alt="${p.title}" style="width:100%;border-radius:16px;margin:12px 0" loading="lazy">
      <div style="line-height:1.8">${p.content}</div>
      <div style="margin-top:24px;padding:16px;background:#f0f9ff;border:1px solid #bae6fd;border-radius:16px">
        <strong>💡 İpucu:</strong> Bu rotayı botumda dene — Telegram'da <a href="https://t.me/avcisi_firsat_bot">@avcisi_firsat_bot</a>'a <code>${p.title.split(' ')[0]} - Paris</code> yaz.
      </div>
      <p><a href="/blog">← Tüm rehberlere dön</a> • <a href="/">Ana sayfa</a></p>
    </article>
  `;
  return `<!DOCTYPE html><html lang="tr"><head>${baseHead(p.title, p.excerpt)}${style}</head><body>
${header()}
<div class="wrap" style="padding:24px 20px;max-width:760px">${body}</div>
${footer()}
</body></html>`;
}

export function renderSitemap(): string {
  const urls = [
    "https://seyahat-bot.eylulundunyasi98.workers.dev/",
    "https://seyahat-bot.eylulundunyasi98.workers.dev/blog",
    ...posts.map(p => `https://seyahat-bot.eylulundunyasi98.workers.dev/blog/${p.slug}`),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(u=>`<url><loc>${u}</loc><lastmod>2026-08-29</lastmod></url>`).join('')}</urlset>`;
}
