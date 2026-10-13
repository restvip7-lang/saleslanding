// Генерирует HTML страницы из property.json. Без зависимостей.

const esc = (s = '') =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const money = (n, cur = 'RUB') =>
  new Intl.NumberFormat('ru-RU').format(n) + ({ RUB: ' ₽', EUR: ' €', USD: ' $' }[cur] || ' ' + cur);

const ICONS = {
  sea: '<path d="M2 16c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2M2 20c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2M12 3v7M8 7l4-4 4 4"/>',
  key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M16 7l3 3M14 9l2 2"/>',
  car: '<path d="M5 17h14M3 13l2-6h14l2 6v4H3zM7 17v2M17 17v2"/><circle cx="7.5" cy="13.5" r=".5"/><circle cx="16.5" cy="13.5" r=".5"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
  spa: '<path d="M12 21c-4 0-7-3-7-7 4 0 7 3 7 7zM12 21c4 0 7-3 7-7-4 0-7 3-7 7zM12 14c-3-2-3-7 0-11 3 4 3 9 0 11z"/>',
  bed: '<path d="M3 19V6M3 14h18v5M21 19v-3a3 3 0 00-3-3h-7v4"/><circle cx="7" cy="10.5" r="1.6"/>',
  area: '<path d="M4 4h16v16H4zM4 9h4M4 14h3M9 4v4M14 4v3"/>',
  sofa: '<path d="M5 11V8a3 3 0 013-3h8a3 3 0 013 3v3M3 13a2 2 0 014 0v2h10v-2a2 2 0 014 0v5H3zM6 18v2M18 18v2"/>',
  floor: '<path d="M5 21V5l9-2v18M14 8h5v13M8 9h2M8 13h2M8 17h2M3 21h18"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  home: '<path d="M3 11l9-8 9 8v9a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1z"/>',
};
const icon = (n) => `<span class="ico"><svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[n] || ICONS.home}</svg></span>`;

const SVG = {
  wa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 21l1.6-4.9A8.5 8.5 0 1112 20.5a8.4 8.4 0 01-4.1-1.1z"/><path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.5-2-1-1 .8c-1-.4-2-1.4-2.4-2.4l.8-1-1-2z"/></svg>',
  tg: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21.9 4.3L18.7 19.4c-.2 1-.9 1.3-1.7.8l-4.7-3.5-2.3 2.2c-.3.3-.5.5-1 .5l.3-4.8 8.7-7.9c.4-.3-.1-.5-.6-.2L6.6 13.2 2 11.8c-1-.3-1-1 .2-1.5L20.3 3.3c.8-.3 1.6.2 1.6 1z"/></svg>',
  ph: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z"/></svg>',
  go: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 6h16v12H4zM4 7l8 6 8-6"/></svg>',
};

export function render(p, { origin }) {
  const c = p.contacts || {};
  const url = origin + '/';
  const t = p.seo?.title || p.title;
  const d = p.seo?.description || p.tagline;
  const hero = p.photos[0];
  const waText = `Здравствуйте! Интересует объект «${p.title}»`;
  const tgText = waText;
  const waHref = c.whatsapp ? `https://wa.me/${esc(c.whatsapp)}?text=${encodeURIComponent(waText)}` : '';
  const tgHref = c.telegram ? `https://t.me/${esc(c.telegram)}?text=${encodeURIComponent(tgText)}` : '';
  const telHref = c.phone ? `tel:${esc(c.phone)}` : '';
  const absImg = (s) => origin + '/' + s;

  const clientCfg = {
    id: p.id,
    title: p.title,
    contacts: { whatsapp: c.whatsapp || '', telegram: c.telegram || '', phone: c.phone || '' },
    analytics: p.analytics || {},
    price: p.price,
    mortgage: p.mortgage || { rate: 6, years: 20, downPaymentPercent: 20 },
    geo: p.geo || null,
    consentRequired: false,
  };

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'RealEstateListing',
      name: t,
      description: d,
      url,
      image: p.photos.map((x) => absImg(x.src)),
      datePosted: new Date().toISOString().slice(0, 10),
      offers: { '@type': 'Offer', price: p.price, priceCurrency: p.currency || 'RUB', availability: 'https://schema.org/InStock', url },
      about: {
        '@type': 'Apartment',
        name: p.title,
        address: { '@type': 'PostalAddress', addressLocality: p.city, streetAddress: p.address, addressCountry: 'RU' },
        ...(p.geo ? { geo: { '@type': 'GeoCoordinates', latitude: p.geo.lat, longitude: p.geo.lng } } : {}),
      },
    },
    ...(p.faq?.length
      ? [{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: p.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
        }]
      : []),
  ];

  const trk = (name) => `data-track="${name}"`;

  const btnWa = (cls = '', ev = 'click_whatsapp', label = 'Написать в WhatsApp') =>
    waHref ? `<a class="btn btn-wa ${cls}" href="${waHref}" target="_blank" rel="noopener" data-channel="wa" ${trk(ev)}>${SVG.wa}${label}</a>` : '';
  const btnTg = (cls = '', ev = 'click_telegram', label = 'Написать в Telegram') =>
    tgHref ? `<a class="btn btn-tg ${cls}" href="${tgHref}" target="_blank" rel="noopener" data-channel="tg" ${trk(ev)}>${SVG.tg}${label}</a>` : '';

  return `<!doctype html>
<html lang="${esc(p.lang || 'ru')}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(t)}</title>
<meta name="description" content="${esc(d)}">
<meta name="robots" content="${p.noindex ? 'noindex,nofollow' : 'index,follow,max-image-preview:large'}">
<meta name="theme-color" content="#10231d">
<link rel="canonical" href="${esc(url)}">
<meta property="og:type" content="website">
<meta property="og:locale" content="ru_RU">
<meta property="og:title" content="${esc(t)}">
<meta property="og:description" content="${esc(d)}">
<meta property="og:url" content="${esc(url)}">
<meta property="og:image" content="${esc(absImg(hero.src))}">
<meta name="twitter:card" content="summary_large_image">
<link rel="preload" as="image" href="${esc(hero.src)}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Prata&family=Golos+Text:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="assets/styles.css">
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
</head>
<body>
<script>document.documentElement.classList.add('js')</script>
<a class="skip" href="#top">Перейти к содержимому</a>
<div class="progress" id="prog" aria-hidden="true"></div>
<div class="stick" id="stick" aria-hidden="true"><div class="wrap">
  <b class="stick-name">${esc(p.brand || p.title)}</b>
  <span class="stick-price">${money(p.price, p.currency)}</span>
  <a class="btn btn-primary" href="#lead" tabindex="-1" ${trk('cta_sticky')}>Записаться</a>
</div></div>
<header class="top"><div class="wrap">
  <a class="logo" href="#top">${esc(p.brand || p.title)}</a>
  ${c.phone ? `<a class="top-phone" href="${telHref}" ${trk('click_phone')}>${esc(c.phoneDisplay || c.phone)}</a>` : ''}
</div></header>

<main id="top">
<section class="hero">
  <div class="hero-ghost" aria-hidden="true">${esc(p.title.split(' ').slice(-1)[0])}</div>
  <div class="hero-orb o1" aria-hidden="true"></div><div class="hero-orb o2" aria-hidden="true"></div>
  <div class="wrap hero-grid">
    <div class="hero-copy">
      <span class="badge">${esc(p.type)} · ${esc(p.city)} · ${esc(p.status)}</span>
      <h1 aria-label="${esc(p.title)}">${p.title.split(' ').map((w, i) => `<span class="w" aria-hidden="true"><span style="--i:${i}">${esc(w)}</span></span>`).join(' ')}</h1>
      <p class="sub">${esc(p.tagline)}</p>
      <div class="hero-meta">${(p.heroFacts || []).map((f) => `<span class="chip">${esc(f)}</span>`).join('')}</div>
      <div class="hero-price"><span class="sr">${money(p.price, p.currency)}</span><b aria-hidden="true" data-count="${p.price}" data-suffix="${p.currency === 'EUR' ? ' €' : p.currency === 'RUB' ? ' ₽' : ' ' + esc(p.currency)}">${money(p.price, p.currency)}</b>${p.rubRate && p.currency !== 'RUB' ? `<span>≈ ${money(Math.round(p.price * p.rubRate / 10000) * 10000)} по текущему курсу, уточняйте у менеджера</span>` : ''}</div>
      <div class="hero-cta">
        <a class="btn btn-primary" href="#lead" ${trk('cta_hero_viewing')}>Записаться на показ</a>
        ${btnWa('btn-ghost-wa', 'click_whatsapp', 'WhatsApp')}
      </div>
    </div>
    <div class="hero-fig">
      <div class="arch"><div class="hero-par" id="heroPar"><img src="${esc(hero.src)}" alt="${esc(hero.alt)}" width="${hero.w}" height="${hero.h}" fetchpriority="high"></div></div>
      <svg class="seal" viewBox="0 0 200 200" aria-hidden="true"><circle class="bg" cx="100" cy="100" r="99"/><defs><path id="sealp" d="M100,100 m-76,0 a76,76 0 1,1 152,0 a76,76 0 1,1 -152,0"/></defs><g class="seal-rot"><text textLength="470" lengthAdjust="spacing"><textPath href="#sealp">${esc([p.city.split(',')[0], ...(p.heroFacts || [])].join(' ✦ ').toUpperCase())} ✦ </textPath></text></g><circle cx="100" cy="100" r="34"/><path d="M100 88v24m0 0l-9-9m9 9l9-9"/></svg>
      <span class="hero-tag"><i></i>${esc(p.city)}</span>
    </div>
  </div>
  <a class="scroll-cue" href="#gallery" aria-label="Листать вниз"><i></i></a>
</section>

<section class="facts"><div class="wrap"><div class="facts-grid">
  ${(p.facts || []).map((f) => `<div class="fact"><b>${esc(f.value)}</b><span>${esc(f.label)}</span></div>`).join('')}
</div></div></section>

<section class="listing" id="gallery"><div class="wrap">
  <div class="ls-head"><span class="eyebrow">Фото и цена</span><h2>${esc(p.title)}</h2></div>
  <div class="ls-grid">
    <div class="ls-media">
      ${p.listingChips?.length ? `<ul class="ls-chips">${p.listingChips.map((c) => `<li class="spot">${icon(c.icon)}<div><b>${esc(c.value)}</b><span>${esc(c.label)}</span></div></li>`).join('')}</ul>` : ''}
      <div class="ls-main">
        <div class="ls-tabs" role="group" aria-label="Категория фото">
          <button type="button" class="on" data-g="all" aria-pressed="true">Все фото</button>
          ${(p.photoGroups || []).map((g) => `<button type="button" data-g="${esc(g.id)}" aria-pressed="false">${esc(g.label)}</button>`).join('')}
        </div>
        <button class="ls-open" type="button" id="lsOpen" aria-label="Открыть фото на весь экран"><img id="lsImg" src="${esc(p.photos[0].src)}" alt="${esc(p.photos[0].alt)}" width="${p.photos[0].w}" height="${p.photos[0].h}" fetchpriority="low"></button>
        <button class="ls-nav ls-prev" type="button" id="lsPrev" aria-label="Предыдущее фото">‹</button>
        <button class="ls-nav ls-next" type="button" id="lsNext" aria-label="Следующее фото">›</button>
        <span class="ls-count" id="lsCount">1 / ${p.photos.length}</span>
      </div>
      <div class="ls-thumbs" id="lsThumbs">
        ${p.photos.map((ph, i) => `<button type="button" class="ls-t${i ? '' : ' on'}" data-i="${i}" aria-current="${i ? 'false' : 'true'}" data-g="${esc(ph.group || '')}" aria-label="Фото ${i + 1}"><img src="${esc(ph.thumb || ph.src)}" alt="" width="120" height="80" loading="lazy"></button>`).join('')}
      </div>
    </div>
    <aside class="ls-card">
      <div class="ls-price">${money(p.price, p.currency)}</div>
      ${p.rubRate && p.currency !== 'RUB' ? `<div class="ls-rub">≈ ${money(Math.round(p.price * p.rubRate / 10000) * 10000)}</div>` : ''}
      ${p.priceChecked ? `<div class="ls-check"><span class="ls-ok" aria-hidden="true">✓</span><div><b>Цена и наличие подтверждены</b><small>Последняя проверка: ${esc(p.priceChecked)}</small><p>${esc(p.priceNote || '')}</p></div></div>` : '<p class="ls-note">Стоимость и наличие подтверждаем перед показом.</p>'}
      <a class="btn btn-primary" href="#lead" ${trk('cta_card_price')}>Получить актуальную цену</a>
      <div class="ls-msg">${btnWa('', 'click_whatsapp_card', 'WhatsApp')}${btnTg('', 'click_telegram_card', 'Telegram')}</div>
      <a class="ls-cheaper" href="#lead" ${trk('cta_cheaper')}><b>Нашли дешевле?</b><span>Сравним предложение и подберём условия</span></a>
      ${p.manager ? `<div class="ls-man"><span class="ls-ava" aria-hidden="true">${esc((p.brand || p.manager.name || '').replace(/[^A-Za-zА-Яа-я ]/g, '').split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase())}</span><div><b>${esc(p.manager.name)}</b><span>${esc(p.manager.role)}</span></div><div class="ls-man-ic">${waHref ? `<a class="wa" href="${waHref}" target="_blank" rel="noopener" data-channel="wa" aria-label="WhatsApp" ${trk('click_whatsapp_manager')}>${SVG.wa}</a>` : ''}${tgHref ? `<a class="tg" href="${tgHref}" target="_blank" rel="noopener" data-channel="tg" aria-label="Telegram" ${trk('click_telegram_manager')}>${SVG.tg}</a>` : ''}</div></div>` : ''}
    </aside>
  </div>
</div></section>

${p.video?.file || p.video?.embed ? `<section class="tour" id="video"><div class="wrap tour-grid">
  <div class="tour-text rv">
    <span class="eyebrow">Видеообзор</span>
    <h2>${esc(p.video.title || 'Видеообзор')}</h2>
    <p>${esc(p.video.text || '')}</p>
    <a class="btn btn-primary" href="#lead" ${trk('cta_video')}>Записаться на показ</a>
  </div>
  <div class="tour-wrap rv">${p.video.file ? `<div class="tour-player">
    <video id="tourVid" aria-label="Видеообзор квартиры" preload="none" playsinline poster="${esc(p.video.poster || '')}" width="${p.video.w || 478}" height="${p.video.h || 850}"><source src="${esc(p.video.file)}" type="video/mp4"></video>
    <button class="tour-play" id="tourPlay" type="button" aria-label="Смотреть видеообзор"><span>▶</span></button>
  </div>` : `<div class="video-box"><iframe src="${esc(p.video.embed)}" loading="lazy" allowfullscreen title="Видеообзор"></iframe></div>`}</div>
</div></section>` : ''}

<section id="about"><div class="wrap">
  <div class="about-top">
    <div class="about-fig rv from-l">
      ${(() => { const ap = p.photos.filter((x) => x.group === 'apartment'); const a1 = ap[1] || p.photos[1], a2 = ap[0] || p.photos[0]; return `<div class="arch sm"><img src="${esc(a1.src)}" alt="${esc(a1.alt)}" width="${a1.w}" height="${a1.h}" loading="lazy"></div><div class="circ"><img src="${esc(a2.thumb || a2.src)}" alt="${esc(a2.alt)}" width="320" height="320" loading="lazy"></div>`; })()}
    </div>
    <div class="about-text rv from-r">
      <span class="eyebrow">Об объекте</span>
      <h2>Жизнь, которую вы заслужили</h2>
      ${(p.description || []).map((x) => `<p>${esc(x)}</p>`).join('')}
      <a class="btn btn-dark" href="#lead" ${trk('cta_about')}>Записаться на показ</a>
    </div>
  </div>
  <div class="features">
    ${(p.features || []).map((f, i) => `<div class="feature spot rv"><em>${String(i + 1).padStart(2, '0')}</em>${icon(f.icon)}<div><h3>${esc(f.title)}</h3><p>${esc(f.text)}</p></div></div>`).join('')}
  </div>
</div></section>



${p.amenities?.length ? `<section class="marq-sec" aria-labelledby="amen-h"><div class="wrap marq-head"><span class="eyebrow lt">Инфраструктура комплекса</span><h2 id="amen-h">Всё для жизни и отдыха</h2><ul class="sr">${p.amenities.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></div>
  ${[0, 1].map((row) => { const items = p.amenities.filter((_, i) => i % 2 === row); const html = items.map((t) => `<span>${esc(t)}</span>`).join(''); return `<div class="marq ${row ? 'rev' : ''}" aria-hidden="true"><div class="marq-track">${html}${html}${html}${html}</div></div>`; }).join('')}
</section>` : ''}
<section id="specs">${p.infographic ? `<div class="wrap">
  <span class="eyebrow">Характеристики</span><h2>Квартира в цифрах</h2>
  ${(() => { const g = p.infographic;
    const floors = Array.from({ length: g.floor.total }, (_, i) => { const n = g.floor.total - i; const y = 8 + i * 16; const on = n === g.floor.n; return `<g class="fl${on ? ' on' : ''}" style="--i:${g.floor.total - n}"><rect x="20" y="${y}" width="76" height="13" rx="3"/>${[0, 1, 2, 3].map((w) => `<rect class="win" x="${28 + w * 17}" y="${y + 3.5}" width="8" height="6" rx="1.5"/>`).join('')}</g>`; }).join('');
    const H = g.floor.total * 16 + 14;
    const pt = { 'С': [60, 8], 'В': [112, 60], 'Ю': [60, 112], 'З': [8, 60] };
    const comp = Object.entries(pt).map(([k, [x, y]]) => { const on = g.compass.dirs.includes(k); const rot = { 'С': 0, 'В': 90, 'Ю': 180, 'З': 270 }[k]; return `<g class="cp${on ? ' on' : ''}"><path d="M60 60 L52 40 L60 14 L68 40 Z" transform="rotate(${rot} 60 60)"/><text x="${x}" y="${y + 4}" text-anchor="middle">${k}</text></g>`; }).join('');
    const rooms = [...Array(g.rooms.bedrooms).fill('спальня'), ...Array(g.rooms.living).fill('гостиная')].map((t, i, arr) => `<div class="rm${t === 'гостиная' ? ' big' : ''}" style="--i:${i}"><i></i><span>${t}</span></div>`).join('');
    const km = (g.sea.meters / 1000).toLocaleString('ru-RU');
    return `<div class="ig">
    <div class="ig-t ig-area rv"><div class="ig-area-l"><span class="ig-k">${esc(g.area.label)}</span><div class="ig-big"><b class="ig-num">${g.area.value}</b><em>${esc(g.area.unit)}</em></div><p class="ig-cap">Условная схема планировки</p></div>
      ${(() => { let i = 0; const P = (d, c) => `<path class="pl ${c}" pathLength="1" style="--i:${i++}" d="${d}"/>`; const Rr = (x, y, w, h) => `M${x} ${y}h${w}v${h}h${-w}z`; const C = (cx, cy, r, c) => `<circle class="pl ${c}" pathLength="1" style="--i:${i++}" cx="${cx}" cy="${cy}" r="${r}"/>`; const T = (x, y, s, sz) => `<text class="plb" x="${x}" y="${y}" text-anchor="middle" style="font-size:${sz || 7}px">${s}</text>`;
        return `<svg viewBox="0 0 252 152" class="ig-plan" role="img" aria-label="Схема планировки: две спальни, гостиная-кухня, санузел, прихожая">
        ${P('M6 6H234V144H6Z', 'w')}${P('M82 6V72M158 6V72', 'w')}${P('M6 72H26M48 72H102M124 72H168', 'w')}${P('M158 46H176M196 46H234', 'w')}
        ${P('M20 6H68M96 6H144M180 6H212', 'win')}${P('M26 144H212', 'win')}${P('M6 90V126', 'win')}
        ${P('M26 72V50M26 50A22 22 0 0 1 48 72', 't')}${P('M102 72V50M102 50A22 22 0 0 1 124 72', 't')}${P('M176 46V26M176 26A20 20 0 0 1 196 46', 't')}
        ${P(Rr(20, 24, 40, 36), 'f')}${P(Rr(24, 27, 14, 9) + Rr(42, 27, 14, 9), 'f')}
        ${P(Rr(96, 24, 40, 36), 'f')}${P(Rr(100, 27, 14, 9) + Rr(118, 27, 14, 9), 'f')}
        ${P(Rr(164, 12, 44, 20), 'f')}${P(Rr(216, 12, 12, 9), 'f')}${C(222, 33, 5, 'f')}
        ${P(Rr(18, 86, 58, 20) + Rr(18, 106, 20, 26), 'f')}
        ${C(120, 112, 13, 'f')}${C(98, 112, 4, 'f')}${C(142, 112, 4, 'f')}${C(120, 90, 4, 'f')}${C(120, 134, 4, 'f')}
        ${P(Rr(212, 78, 22, 62), 'f')}${C(223, 94, 3, 'f')}${C(223, 104, 3, 'f')}${P(Rr(168, 78, 32, 12), 'f')}
        ${P('M240 59H224M229 54L224 59L229 64', 'door')}
        ${T(40, 19, 'Спальня')}${T(116, 19, 'Спальня')}${T(166, 41, 'С/у', 6.5)}${T(196, 63, 'Прихожая', 6.5)}${T(124, 82, 'Гостиная · кухня', 7.5)}${T(246, 49, 'вход', 6)}
      </svg>`; })()}</div>
    <div class="ig-t ig-floor rv"><span class="ig-k">${esc(g.floor.label)}</span><div class="ig-big"><b class="ig-num">${g.floor.n}</b><em>из ${g.floor.total}</em></div>
      <svg viewBox="0 0 116 ${H}" class="ig-bld" aria-hidden="true">${floors}<rect x="10" y="${H - 6}" width="96" height="3" rx="1.5" class="gr"/></svg></div>
    <div class="ig-t ig-compass rv"><span class="ig-k">Стороны света</span>
      <svg viewBox="0 0 120 120" class="ig-cmp" aria-hidden="true"><circle cx="60" cy="60" r="54"/>${comp}<circle cx="60" cy="60" r="5" class="hub"/></svg>
      <p>${esc(g.compass.label)}</p></div>
    <div class="ig-t ig-sea rv"><span class="ig-k">${esc(g.sea.label)}</span><div class="ig-big"><b class="ig-num">${km}</b><em>км</em></div>
      <svg viewBox="0 0 520 90" class="ig-route" aria-hidden="true"><path class="rt" d="M40 60 H400"/><g class="home"><path d="M24 62V40l16-14 16 14v22z"/></g><g class="wv"><path d="M420 54q10-12 20 0t20 0 20 0 20 0"/><path d="M420 70q10-12 20 0t20 0 20 0 20 0"/></g><text x="215" y="46" text-anchor="middle">${g.sea.meters.toLocaleString('ru-RU')} м</text></svg></div>
    <div class="ig-t ig-rooms rv"><span class="ig-k">Планировка</span><div class="ig-big"><b>${esc(g.rooms.label)}</b></div><div class="rms">${rooms}</div><p>${esc(g.rooms.note)}</p></div>
    <div class="ig-t ig-sm ig-view rv"><span class="ig-k">Вид из окон</span><ul>${g.view.map((v) => `<li>${esc(v)}</li>`).join('')}</ul></div>
    <div class="ig-t ig-sm rv"><span class="ig-k">${esc(g.year.label)}</span><b class="ig-s">${g.year.value}</b></div>
    <div class="ig-t ig-sm rv"><span class="ig-k">${esc(g.furnished.label)}</span><b class="ig-s">${esc(g.furnished.value)}</b></div>
    <div class="ig-t ig-sm rv"><span class="ig-k">${esc(g.bath.label)}</span><b class="ig-s">${esc(g.bath.value)}</b></div>
  </div>
  <p class="ig-tags">${(g.tags || []).map((t) => `<span>${esc(t)}</span>`).join('')}</p>`; })()}
</div>` : `<div class="wrap spec-grid">
  <div class="rv"><span class="eyebrow">Характеристики</span><h2>Всё об объекте</h2>
    <dl class="specs">${(p.specs || []).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl></div>
  ${p.plan ? `<div class="rv"><span class="eyebrow">Планировка</span><h2>Продуманное пространство</h2>
    <div class="plan"><img src="${esc(p.plan.src)}" alt="${esc(p.plan.alt)}" width="${p.plan.w}" height="${p.plan.h}" loading="lazy"></div></div>` : ''}
</div>`}</section>

<section class="loc" id="location"><div class="wrap">
  <span class="eyebrow lt">Локация</span>
  <h2>${esc(p.city)}</h2>
  <p class="lead">${esc(p.location?.intro || '')}</p>
  <div class="dist">${(p.location?.distances || []).map((x) => `<div><b>${esc(x.value)}</b><span>${esc(x.label)}</span></div>`).join('')}</div>
  <div class="map" id="map">${p.geo ? `<button class="btn btn-primary" type="button" id="mapBtn" ${trk('map_open')}>Показать на карте</button>` : ''}</div>
  ${p.geo ? `<div class="map-actions"><a class="btn btn-ghost" target="_blank" rel="noopener" href="https://yandex.ru/maps/?rtext=~${p.geo.lat},${p.geo.lng}&rtt=auto" ${trk('route_click')}>Построить маршрут</a></div>` : ''}
</div></section>

${p.mortgage ? `<section id="mortgage"><div class="wrap">
  <span class="eyebrow">Ипотека</span><h2>Рассчитайте платёж</h2>
  <p class="lead" style="margin-bottom:28px">Ориентировочный расчёт. Точные условия подберём под ваш банк.</p>
  <div class="calc rv">
    <div>
      <div class="field"><label for="cDown">Первоначальный взнос <output id="oDown"></output></label><input id="cDown" type="range" min="10" max="90" step="5" value="${p.mortgage?.downPaymentPercent ?? 20}"></div>
      <div class="field"><label for="cYears">Срок <output id="oYears"></output></label><input id="cYears" type="range" min="3" max="30" step="1" value="${p.mortgage?.years ?? 20}"></div>
      <div class="field"><label for="cRate">Ставка <output id="oRate"></output></label><input id="cRate" type="range" min="1" max="25" step="0.5" value="${p.mortgage?.rate ?? 6}"></div>
    </div>
    <div class="calc-res"><small>Платёж в месяц</small><b id="cRes">—</b><p id="cNote"></p><a class="btn btn-primary" href="#lead" ${trk('cta_calc')}>Получить расчёт у менеджера</a></div>
  </div>
</div></section>` : ''}
${p.terms?.length ? `<section id="terms"><div class="wrap">
  <span class="eyebrow">Условия покупки</span><h2>Просто и безопасно</h2>
  <div class="terms">${p.terms.map((x) => `<div class="term rv"><h3>${esc(x.title)}</h3><p>${esc(x.text)}</p></div>`).join('')}</div>
  <div style="margin-top:28px"><a class="btn btn-dark" href="#lead" ${trk('cta_terms')}>Узнать условия</a></div>
</div></section>` : ''}

<section class="trust" id="trust"><div class="wrap">
  <span class="eyebrow">Безопасная сделка</span><h2>Как мы работаем</h2>
  <div class="steps">${(p.steps || []).map((s) => `<div class="step rv"><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div>`).join('')}</div>
  ${p.agent ? `<div class="agent"><img src="${esc(p.agent.photo)}" alt="${esc(p.agent.name)}" width="84" height="84" loading="lazy"><div><b>${esc(p.agent.name)}</b><span>${esc(p.agent.role)}</span><span>${esc(p.agent.experience)}</span></div></div>` : ''}
</div></section>

${p.faq?.length ? `<section class="faq" id="faq"><div class="wrap faq-grid">
  <div class="faq-side">
    <span class="eyebrow">Вопросы</span><h2>Частые вопросы</h2>
    <p class="lead">Не нашли ответ? Спросите менеджера, ответим в течение 15 минут.</p>
    <div class="faq-cta">${btnWa('', 'click_whatsapp_faq', 'WhatsApp')}${btnTg('', 'click_telegram_faq', 'Telegram')}</div>
  </div>
  <div class="faq-list">
  ${p.faq.map((f) => `<details><summary><span>${esc(f.q)}</span></summary><p>${esc(f.a)}</p></details>`).join('')}
  </div>
</div></section>` : ''}

<section class="lead-sec" id="lead"><div class="wrap lead-box">
  <div>
    <span class="eyebrow lt">Заявка</span>
    <h2>${esc(p.leadFormTitle)}</h2>
    <p class="lead">${esc(p.leadFormSubtitle)}</p>
    <div style="display:flex;flex-wrap:wrap;gap:12px;margin-top:26px">
      ${btnWa('', 'click_whatsapp_lead', 'WhatsApp')}${btnTg('', 'click_telegram_lead', 'Telegram')}
    </div>
  </div>
  <div>
    <form class="form" id="leadForm" novalidate>
      <div class="row"><label for="fName">Ваше имя</label><input id="fName" name="name" type="text" autocomplete="name" required aria-describedby="fErr"></div>
      <div class="row"><label for="fPhone">Телефон</label><input id="fPhone" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="+7 (___) ___-__-__" required aria-describedby="fErr"></div>
      <div class="row" role="group" aria-labelledby="msgLbl"><span class="lbl" id="msgLbl">Где удобно ответить?</span>
        <div class="seg">
          <input type="radio" id="m1" name="messenger" value="whatsapp" checked><label for="m1">WhatsApp</label>
          <input type="radio" id="m2" name="messenger" value="telegram"><label for="m2">Telegram</label>
          <input type="radio" id="m3" name="messenger" value="call"><label for="m3">Звонок</label>
        </div></div>
      <input class="hp" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
      <label class="consent"><input type="checkbox" name="consent" required><span>Согласен на обработку персональных данных согласно <a href="privacy.html" target="_blank" rel="noopener">политике конфиденциальности</a></span></label>
      <button class="btn btn-primary" type="submit">Записаться на показ</button>
      <div class="err" id="fErr" role="alert"></div>
    </form>
    <div class="form thanks" id="thanks">
      <h3>Спасибо! Заявка принята</h3>
      <p>Менеджер свяжется с вами в ближайшее время. Чтобы быстрее — напишите нам сами:</p>
      ${btnWa('', 'click_whatsapp_thanks', 'Написать в WhatsApp')}
      ${btnTg('', 'click_telegram_thanks', 'Написать в Telegram')}
    </div>
  </div>
</div></section>
</main>

<footer><div class="wrap f-grid">
  <div>${esc(p.company?.name || '')}${p.company?.inn ? ` · ИНН ${esc(p.company.inn)}` : ''}${p.company?.ogrn ? ` · ОГРН ${esc(p.company.ogrn)}` : ''}<br>${esc(p.company?.address || '')}<br>
    <small>Информация на сайте не является публичной офертой.</small></div>
  <div>${p.company?.email ? `<a href="mailto:${esc(p.company.email)}">${esc(p.company.email)}</a><br>` : ''}<a href="privacy.html">Политика конфиденциальности</a></div>
</div></footer>

<nav class="bar" aria-label="Быстрая связь">
  ${waHref ? `<a class="wa" href="${waHref}" target="_blank" rel="noopener" data-channel="wa" ${trk('click_whatsapp_bar')}>${SVG.wa}WhatsApp</a>` : ''}
  ${tgHref ? `<a class="tg" href="${tgHref}" target="_blank" rel="noopener" data-channel="tg" ${trk('click_telegram_bar')}>${SVG.tg}Telegram</a>` : ''}
  ${telHref ? `<a href="${telHref}" ${trk('click_phone_bar')}>${SVG.ph}Позвонить</a>` : ''}
  <a class="go" href="#lead" ${trk('cta_bar_lead')}>${SVG.go}Заявка</a>
</nav>

<div class="lb" id="lb" role="dialog" aria-modal="true" aria-label="Просмотр фото" tabindex="-1">
  <button class="x" type="button" aria-label="Закрыть">×</button><button class="p" type="button" aria-label="Назад">‹</button><button class="n" type="button" aria-label="Вперёд">›</button>
  <img alt=""><div class="c"></div>
</div>

<div class="cookie" id="cookie" role="region" aria-label="Уведомление об использовании cookie"><span>Сайт использует cookie и сервисы аналитики для улучшения работы.</span><button type="button" id="cookieOk">Ок</button></div>

<script>window.__SITE=${JSON.stringify(clientCfg).replace(/</g, '\\u003c')};window.__PHOTOS=${JSON.stringify(p.photos.map((x) => ({ src: x.src, alt: x.alt, group: x.group || '' }))).replace(/</g, '\\u003c')};</script>
<script src="assets/tracking.js"></script>
<script src="assets/app.js" defer></script>
</body>
</html>
`;
}

export function renderPrivacy(p, { origin }) {
  const co = p.company || {};
  return `<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Политика конфиденциальности — ${esc(p.title)}</title><meta name="robots" content="noindex">
<style>body{font-family:system-ui,sans-serif;max-width:760px;margin:40px auto;padding:0 20px;line-height:1.65;color:#222}h1{font-size:28px}</style></head><body>
<h1>Политика конфиденциальности</h1>
<p>Оператор персональных данных: ${esc(co.name)}${co.inn ? `, ИНН ${esc(co.inn)}` : ''}${co.address ? `, ${esc(co.address)}` : ''}${co.email ? `, ${esc(co.email)}` : ''}.</p>
<p>Мы обрабатываем имя, номер телефона и выбранный способ связи, которые вы указываете в форме, а также технические данные (источник перехода, UTM-метки, тип устройства, cookie) для связи с вами по вопросу объекта и оценки эффективности рекламы.</p>
<p>Данные не передаются третьим лицам, кроме сервисов, необходимых для обработки заявки (мессенджеры, системы аналитики). Срок хранения — до достижения цели обработки или до отзыва согласия.</p>
<p>Вы можете отозвать согласие и потребовать удаления данных, написав на ${esc(co.email || 'адрес оператора')}.</p>
<p><a href="./">← Вернуться на сайт</a></p></body></html>`;
}
