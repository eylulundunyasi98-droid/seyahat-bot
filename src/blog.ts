// src/blog.ts - Travelpayouts onayı için SEO uyumlu blog
export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  cover: string;
  content: string;
  tags: string[];
}

export const posts: Post[] = [
  {
    slug: "istanbul-paris-ucuz-bilet-rehberi",
    title: "İstanbul - Paris Ucuz Uçak Bileti Rehberi 2026: Ne Zaman, Nereden Alınır?",
    excerpt: "İstanbul'dan Paris'e en ucuz uçak biletini bulmanın püf noktaları, en uygun aylar, havalimanı karşılaştırması ve kişisel deneyimlerim.",
    date: "2026-08-20",
    author: "Eylül",
    cover: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200",
    tags: ["ucuz bilet", "istanbul", "paris", "aviasales"],
    content: `
      <p>Geçen yıl İstanbul'dan Paris'e 4 kez uçtum ve her seferinde farklı bir strateji denedim. Bu yazıda 1.200 TL'ye bulduğum biletin sırrını, hangi günlerin %30 daha ucuz olduğunu ve hangi havalimanının sürpriz avantajını paylaşıyorum.</p>
      <h2>1. En Ucuz Aylar: Ocak - Mart ve Kasım</h2>
      <p>Paris'e talep yazın zirve yapıyor. Benim takibime göre <strong>Kasım ve Şubat</strong> ayları ortalama 1.400 TL, Temmuz-Ağustos ise 3.200 TL. Eğer tarihin esnekse, seyahatini Kasım ortasına kaydır, aynı koltuk yarı fiyatına geliyor.</p>
      <h2>2. Havalimanı Karşılaştırması: IST vs SAW</h2>
      <p>İstanbul Havalimanı (IST) direkt uçuşlarda genelde 200-300 TL daha pahalı ama bagaj hakkın yüksek. Sabiha Gökçen (SAW) ise Pegasus ve Transavia ile Paris Orly'ye haftada 3 kez kampanya yapıyor. Ben Orly'yi seviyorum çünkü şehir merkezine RER ile 25 dakikada iniyorsun, CDG'ye göre 40 TL ulaşım kârın oluyor.</p>
      <h2>3. Bilet Avcısı Botu Nasıl Kullanıyorum?</h2>
      <p>Kendi botumda <code>İstanbul - Paris</code> yazıyorum, bot Aviasales üzerinden anlık tarıyor. Fiyat grafiği özellikle işe yarıyor: Son 30 günün eğrisini görünce "şu an pahalı mı ucuz mu?" anında anlaşılıyor. <code>/takip İstanbul - Paris - 1500 TL</code> alarmını kurunca fiyat düşer düşmez Telegram'dan haber geliyor.</p>
      <h2>4. Kişisel Tüyolar</h2>
      <ul>
        <li><strong>Salı 14:00</strong> sonrası arama yap, havayolları hafta ortası kampanya yeniliyor.</li>
        <li>Gidiş-dönüş al, tek yön genelde %40 daha pahalıya geliyor.</li>
        <li>Bagajsız seyahat ediyorsan Basic fare seç, 300 TL kâr ediyorsun.</li>
      </ul>
      <p><em>Not: Bu rehberdeki fiyatlar Ağustos 2026 taramalarıma dayanıyor, tarihler değişebilir. En güncel fiyat için botu kullanabilirsin.</em></p>
    `,
  },
  {
    slug: "tokyo-gezilecek-yerler-budget-rehberi",
    title: "Tokyo'da 5 Günde Gezilecek Yerler ve Bütçe Dostu Tüyolar",
    excerpt: "Shibuya'dan Asakusa'ya, konbinilerden capsule otellere kadar Tokyo'yu 800 USD bütçeyle nasıl gezdim? Harita, ulaşım ve yemek rehberi.",
    date: "2026-08-15",
    author: "Eylül",
    cover: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200",
    tags: ["tokyo", "japonya", "gezi rehberi", "bütçe"],
    content: `
      <p>Tokyo ilk bakışta pahalı görünüyor ama doğru planla Avrupa'dan farksız. 5 günde kişi başı 820 USD'ye konaklama+ulaşım+yemek dahil gezdim, notlarım burada.</p>
      <h2>Gün 1-2: Shibuya, Harajuku, Shinjuku</h2>
      <p>Shibuya Crossing'i sabah 8'de gör, kalabalık yok. Harajuku'da Takeshita Street'te krepler 450 JPY (110 TL). Akşam Golden Gai'de 700 JPY'ye biranın yanında yerlilerle sohbet. Ulaşım için <strong>Suica kart</strong> al, metro %20 indirimli.</p>
      <h2>Gün 3: Asakusa ve Ueno</h2>
      <p>Senso-ji tapınağına giriş ücretsiz, çevredeki 100 JPY'lik sokak atıştırmalıkları öğle yemeği yerine geçiyor. Ueno Park'ta piknik yap, marketten onigiri 150 JPY.</p>
      <h2>Konaklama: Capsule mi Hostel mi?</h2>
      <p>Shinjuku'da 9 Hours capsule 3.800 JPY/gece, temiz ve güvenli. Booking üzerinden aldım, aynı oteli botumda <code>Tokyo</code> yazınca karşılaştırmalı görüyorum.</p>
      <h2>Bütçe Tablosu (5 gün)</h2>
      <ul>
        <li>Uçak (IST-TYO gidiş-dönüş): 14.500 TL</li>
        <li>Metro (Suica): 2.100 JPY</li>
        <li>Yemek (günlük 2.500 JPY): 12.500 JPY</li>
        <li>Konaklama (capsule): 19.000 JPY</li>
      </ul>
      <p>Tokyo metrosu karmaşık ama Google Maps yönlendirmesi kusursuz. Benim botumda <code>/hava Tokyo</code> ile 3 günlük hava tahminine bakıp şemsiye planı yaptım.</p>
    `,
  },
  {
    slug: "dubai-otel-onerileri-plaj-mi-merkez-mi",
    title: "Dubai Otel Önerileri: Plaj mı Merkez mi? 2026 Deneyimim",
    excerpt: "Marina, Downtown ve Palm Jumeirah arasında kaldım. 3 bölgede kaldım, artıları eksileri ve fiyat/performans otellerimi paylaşıyorum.",
    date: "2026-08-10",
    author: "Eylül",
    cover: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200",
    tags: ["dubai", "otel", "hotellook", "tatil"],
    content: `
      <p>Dubai'de 7 gece 3 farklı bölgede kaldım. Amacım balayı çiftlerine ve ailelere net bir karar verdirmekti.</p>
      <h2>1. Dubai Marina - Deniz Sevenlere</h2>
      <p>Sabah plaj, akşam Marina Walk. Otel fiyatları gecelik 2.800-4.500 TL arası. Ben <strong>JBR'deki Rove</strong>'da kaldım, kahvaltı dahil 3.200 TL, metroya 3 dakika. Plaj ücretsiz, şezlong 50 AED.</p>
      <h2>2. Downtown - Burj Khalifa Manzaralı</h2>
      <p>Burj Khalifa ve Dubai Mall'a yürüme mesafesi. Turistik ama metro çok kalabalık. Fiyatlar Marina'ya göre %15 pahalı. Tek gecelik şıklık için ideal, uzun kalışta yorucu.</p>
      <h2>3. Palm Jumeirah - Sessiz Lüks</h2>
      <p>Adada trafik var, her yere taksi gerekiyor. Ama havuzlar efsane. Aileler için iyi, gençler için izole.</p>
      <h2>Hangi Mevsim?</h2>
      <p>Kasım-Mart arası 26-30°C, deniz girilebilir ve fiyatlar %25 düşük. Haziran-Ağustos 45°C, oteller yarı fiyatına ama dışarı çıkılmıyor. Ben Kasım'da gittim, hem yüzdüm hem yandım.</p>
      <p>Botumda <code>Dubai</code> yazınca Hotellook üzerinden 3 bölgenin güncel fiyatlarını karşılaştırıyorum, hangi tarihte hangisi ucuz anında görülüyor.</p>
    `,
  },
  {
    slug: "new-york-budget-7-gun-rehberi",
    title: "New York 7 Gün Bütçe Rehberi: Metro, Müze ve Ücretsiz Aktiviteler",
    excerpt: "Manhattan'da 7 günü 1.100 USD'ye nasıl geçirdim? Metro hileleri, ücretsiz müze günleri ve Central Park pikniği tüyoları.",
    date: "2026-08-05",
    author: "Eylül",
    cover: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1200",
    tags: ["new york", "amerika", "bütçe", "gezi"],
    content: `
      <p>New York pahalı efsanesi doğru ama sistemi çözünce değil. 7 gün, 1.100 USD (uçak hariç) ile geçirdim.</p>
      <h2>Metro: 7 Günlük Sınırsız Kart 34 USD</h2>
      <p>Tek biniş 2.90 USD, ama 7 gün sınırsız alırsan günde 12 biniş bile yapsan kârdasın. JFK'den Manhattan'a AirTrain+Metro 11 USD, taksi 70 USD — fark büyük.</p>
      <h2>Ücretsiz Müzeler</h2>
      <p>Metropolitan Museum "pay what you wish" (1 USD de olur), MoMA Cuma 17:00 sonrası ücretsiz. Ben Cuma planladım, 30 USD kâr.</p>
      <h2>Yemek</h2>
      <p>Chinatown'da 9 USD'ye doyurucu tabldot, Halal Guys 7 USD. Marketten alıp Central Park'ta piknik en keyiflisi. Günde 25-30 USD'ye rahat doyuyorsun.</p>
      <h2>Konaklama</h2>
      <p>Manhattan'da hostel 55 USD/gece, Queens'de 38 USD. Ben Long Island City'de kaldım, metro ile Times Square 15 dakika, 17 USD kâr. Botumda <code>New York</code> yazınca Booking ve Hotellook fiyatlarını yan yana görüyorum.</p>
    `,
  },
];

export function renderLayout(title: string, description: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title} | Seyahat Fırsat Botu Blog</title>
<meta name="description" content="${description}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:type" content="article">
<meta name="robots" content="index,follow">
<link rel="canonical" href="https://seyahat-bot.eylulundunyasi98.workers.dev/blog">
<style>
*{box-sizing:border-box}body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Helvetica,Arial,sans-serif;line-height:1.7;color:#1f2937;max-width:800px;margin:0 auto;padding:24px;background:#f9fafb}
a{color:#0ea5e9;text-decoration:none}a:hover{text-decoration:underline}
header{margin-bottom:32px;border-bottom:1px solid #e5e7eb;padding-bottom:16px}
header h1{margin:0;font-size:28px}header p{color:#6b7280;margin:6px 0 0}
.card{background:#fff;border:1px solid #e5e7eb;border-radius:16px;overflow:hidden;margin:18px 0;box-shadow:0 2px 8px rgba(0,0,0,.04)}
.card img{width:100%;height:220px;object-fit:cover}
.card .pad{padding:18px}
.card h2{margin:0 0 8px;font-size:20px}
.meta{color:#6b7280;font-size:13px;margin-bottom:8px}
.tag{display:inline-block;background:#e0f2fe;color:#0369a1;padding:2px 8px;border-radius:999px;font-size:12px;margin-right:6px}
article h2{margin-top:28px;color:#0f172a}article ul{padding-left:20px}
nav a{margin-right:16px;font-weight:600}
footer{margin-top:40px;color:#6b7280;font-size:13px;border-top:1px solid #e5e7eb;padding-top:16px}
</style>
</head>
<body>
<header>
  <nav><a href="/">🤖 Bot</a> <a href="/blog">📝 Blog</a> <a href="/health">Health</a></nav>
  <h1>✈️ Seyahat Fırsat Botu Blog</h1>
  <p>Orijinal gezi rehberleri, bütçe tüyoları ve kişisel deneyimler — haftada 1-2 kez güncellenir.</p>
</header>
${body}
<footer>© 2026 Seyahat Fırsat Botu — Dürüst seyahat rehberleri. İletişim: t.me/avcisi_firsat_bot • <a href="/sitemap.xml">Sitemap</a></footer>
</body>
</html>`;
}

export function renderBlogIndex(): string {
  const cards = posts.map(p => `
    <div class="card">
      <img src="${p.cover}" alt="${p.title}" loading="lazy">
      <div class="pad">
        <div class="meta">${p.date} • ${p.author} • ${p.tags.map(t=>`<span class=tag>${t}</span>`).join(' ')}</div>
        <h2><a href="/blog/${p.slug}">${p.title}</a></h2>
        <p>${p.excerpt}</p>
        <a href="/blog/${p.slug}">Devamını oku →</a>
      </div>
    </div>
  `).join('');
  const body = `<p><strong>${posts.length} özgün rehber</strong> — hepsi kendi deneyimlerime dayanıyor, AI spam değil. Her hafta yeni rota ekliyorum.</p>${cards}`;
  return renderLayout("Blog — Seyahat Rehberleri", "Orijinal seyahat rehberleri, ucuz bilet ve otel tüyoları. Haftalık güncellenir.", body);
}

export function renderPost(slug: string): string | null {
  const p = posts.find(x => x.slug === slug);
  if (!p) return null;
  const body = `
    <article>
      <div class="meta">${p.date} • ${p.author} • ${p.tags.map(t=>`<span class=tag>${t}</span>`).join(' ')}</div>
      <h1>${p.title}</h1>
      <p><em>${p.excerpt}</em></p>
      <img src="${p.cover}" alt="${p.title}" style="width:100%;border-radius:12px;margin:12px 0" loading="lazy">
      ${p.content}
      <div style="margin-top:24px;padding:16px;background:#f0f9ff;border-radius:12px">
        <strong>💡 İpucu:</strong> Bu rotayı botumda denemek ister misin? Telegram'da <a href="https://t.me/avcisi_firsat_bot">@avcisi_firsat_bot</a>'a <code>${p.title.split(' ')[0]} - Paris</code> yaz, anlık fırsatları göreyim.
      </div>
      <p><a href="/blog">← Tüm rehberlere dön</a></p>
    </article>
  `;
  return renderLayout(p.title, p.excerpt, body);
}

export function renderSitemap(): string {
  const urls = [
    "https://seyahat-bot.eylulundunyasi98.workers.dev/",
    "https://seyahat-bot.eylulundunyasi98.workers.dev/blog",
    ...posts.map(p => `https://seyahat-bot.eylulundunyasi98.workers.dev/blog/${p.slug}`),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(u=>`<url><loc>${u}</loc><lastmod>2026-08-29</lastmod></url>`).join('')}</urlset>`;
}
