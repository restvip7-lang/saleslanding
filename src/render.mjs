// Генерирует HTML страницы из property.json. Без зависимостей.

const esc = (s = '') =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const imgI = (n, c = '') => `<img class="${c}" src="img/icons/${n}.svg" alt="" loading="lazy" decoding="async">`;
const compass = (dirs) => { const arm = (k, rot, lx, ly) => `<g class="cp${dirs.includes(k) ? ' on' : ''}"><path d="M60 60L50 40 60 10 70 40z" transform="rotate(${rot} 60 60)"/><text x="${lx}" y="${ly}" text-anchor="middle">${k}</text></g>`;
  return `<svg viewBox="0 0 150 150" class="ig-cmp2" aria-hidden="true" focusable="false"><g transform="translate(15 15)"><circle cx="60" cy="60" r="58" class="rng"/>${arm('С', 0, 60, -2)}${arm('В', 90, 126, 66)}${arm('Ю', 180, 60, 130)}${arm('З', 270, -6, 66)}<circle cx="60" cy="60" r="6" class="hub"/></g></svg>`; };

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
  pin: '<path d="M12 21s-7-6.2-7-11a7 7 0 0114 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  bus: '<path d="M5 16V6a2 2 0 012-2h10a2 2 0 012 2v10M5 16h14M5 11h14M7 16v3M17 16v3"/><circle cx="8.5" cy="13.5" r=".6"/><circle cx="15.5" cy="13.5" r=".6"/>',
  road: '<path d="M8 3L5 21M16 3l3 18M12 4v3M12 10v4M12 17v3"/>',
  home: '<path d="M3 11l9-8 9 8v9a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1z"/>',
};
const icon = (n) => `<span class="ico"><svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[n] || ICONS.home}</svg></span>`;

const SVG = {
  arr: '<svg class="arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17L17 7M8 7h9v9"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 22s-7-6.2-7-12a7 7 0 0114 0c0 5.800-7 12-7 12zm0-9a3 3 0 100-6 3 3 0 000 6z"/></svg>',
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
  const tgHref = c.telegram ? (String(c.telegram).startsWith('+') ? `https://t.me/${esc(c.telegram)}` : `https://t.me/${esc(c.telegram)}?text=${encodeURIComponent(tgText)}`) : '';
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
      ${p.manager ? `<div class="ls-man">${p.manager.photo ? `<img class="ls-ava" src="${esc(p.manager.photo)}" alt="${esc(p.manager.name)}" width="56" height="56" loading="lazy">` : `<span class="ls-ava" aria-hidden="true">${esc((p.brand || p.manager.name || '').replace(/[^A-Za-zА-Яа-я ]/g, '').split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase())}</span>`}<div><b>${esc(p.manager.name)}</b><span>${esc(p.manager.role)}</span></div><div class="ls-man-ic">${waHref ? `<a class="wa" href="${waHref}" target="_blank" rel="noopener" data-channel="wa" aria-label="WhatsApp" ${trk('click_whatsapp_manager')}>${SVG.wa}</a>` : ''}${tgHref ? `<a class="tg" href="${tgHref}" target="_blank" rel="noopener" data-channel="tg" aria-label="Telegram" ${trk('click_telegram_manager')}>${SVG.tg}</a>` : ''}</div></div>` : ''}
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
  <div class="sp-head"><div><span class="eyebrow">Характеристики</span><h2>Квартира в цифрах</h2></div><p class="ig-tags">${(p.infographic.tags || []).map((t, i) => `<span class="${i ? 'f' : ''}">${esc(t)}</span>`).join('')}</p></div>
  ${(() => { const g = p.infographic;
    const floors = Array.from({ length: g.floor.total }, (_, i) => { const n = g.floor.total - i; const y = 6 + i * 14; const on = n === g.floor.n; return `<g class="fl${on ? ' on' : ''}" style="--i:${g.floor.total - n}"><rect x="12" y="${y}" width="64" height="11" rx="2"/></g><text x="92" y="${y + 9}" class="fn${on ? ' on' : ''}">${n}</text>`; }).join('');
    const H = g.floor.total * 14 + 12;
    const km = (g.sea.meters / 1000).toLocaleString('ru-RU');
        const viewIc = (v) => { const t = v.toLowerCase(); return imgI(t.startsWith('мор') ? 'sea' : t.startsWith('город') ? 'city' : t.startsWith('гор') ? 'mountains' : 'city', 'ig-v'); };
    return `<div class="ig">
    <div class="ig-t ig-area rv"><span class="ig-ic"><svg class="ig-planic" viewBox="0 0 64 64" aria-hidden="true" focusable="false"><rect x="6" y="8" width="52" height="48" rx="3"/><path d="M6 30h22M28 8v34M28 42h30M44 42v14M44 22h14"/></svg></span><div class="ig-body"><div class="ig-big"><b class="ig-num">${g.area.value}</b><em>${esc(g.area.unit)}</em></div><span class="ig-k">${esc(g.area.label)}</span></div></div>
    <div class="ig-t ig-rooms rv"><span class="ig-ic acc">${imgI('bed')}</span><div class="ig-body"><div class="ig-big"><b>${esc(g.rooms.label)}</b></div><span class="ig-k">${esc(g.rooms.note)}</span></div></div>
    <div class="ig-t ig-floor rv"><svg viewBox="0 0 104 ${H}" class="ig-bld" aria-hidden="true">${floors}<path class="gr" d="M6 ${H - 2}h72"/></svg><div class="ig-body"><div class="ig-big"><b class="ig-num t">${g.floor.n}</b><em>из ${g.floor.total}</em></div><span class="ig-k">${esc(g.floor.label)}</span></div></div>
    <div class="ig-t ig-plan rv"><div class="plan-h"><b>Планировка</b><span>Условная схема · не в масштабе</span></div>
      <div class="plan-g" role="img" aria-label="Условная схема планировки: две спальни, санузел, прихожая, гостиная с кухней">
        <div class="pr-room pr-b1">${imgI('bed', 'pr-ic')}<span>Спальня 1</span></div><div class="pr-room pr-b2">${imgI('bed', 'pr-ic')}<span>Спальня 2</span></div>
        <div class="pr-room pr-ba">${imgI('bathroom', 'pr-ic')}<span>Санузел</span></div><div class="pr-room pr-lv">${imgI('sofa', 'pr-ic')}<span>Гостиная + кухня</span></div>
        <div class="pr-room pr-ha"><span>Прихожая</span><i class="pr-door" aria-hidden="true">←</i></div></div></div>
    <div class="ig-t ig-sea rv"><div class="ig-big"><b class="ig-num">${km}</b><em>км</em></div><span class="ig-k">${esc(g.sea.label)}</span><svg class="ig-seasc" viewBox="0 0 300 150" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false"><path class="mt" d="M0 92l50-34 40 26 46-40 56 52 36-22 72 32v44H0z"/><path class="hl" d="M0 128q60-40 120-14t180-8v44H0z"/><path class="hs" d="M38 112v-24l18-15 18 15v24z"/><path class="rt" d="M76 120q70-26 150-4"/><g class="wv"><path d="M236 118q8-9 16 0t16 0 16 0M236 132q8-9 16 0t16 0 16 0"/></g></svg></div>
    <div class="ig-t ig-view rv"><span class="ig-k">Вид из окон</span><ul>${g.view.map((v) => `<li>${viewIc(v)}<span>${esc(v)}</span></li>`).join('')}</ul></div>
    <div class="ig-t ig-compass rv"><span class="ig-k">Окна выходят</span>${compass(g.compass.dirs)}<p>${esc(g.compass.label.replace(/^Окна выходят /, '').replace(/ и /g, ' · ').replace(/,/g, ' ·').replace(/^на /, '').replace(/^./, (c) => c.toUpperCase()))}</p></div>
    <div class="ig-t ig-year rv"><span class="ig-k">${esc(g.year.label)}</span>${imgI('year-building', 'ig-bd')}<b class="ig-s">${g.year.value}</b></div>
    <div class="ig-t ig-furn rv"><span class="ig-k">${esc(g.furnished.value)} ${esc(g.furnished.label.toLowerCase())}</span><span class="ig-sofa-w">${imgI('sofa', 'ig-sofa')}</span><div class="ig-bath">${imgI('bathroom', 'ig-i2')}<b>${esc(g.bath.value)}</b></div></div>
  </div>`; })()}
</div>` : `<div class="wrap spec-grid">
  <div class="rv"><span class="eyebrow">Характеристики</span><h2>Всё об объекте</h2>
    <dl class="specs">${(p.specs || []).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl></div>
  ${p.plan ? `<div class="rv"><span class="eyebrow">Планировка</span><h2>Продуманное пространство</h2>
    <div class="plan"><img src="${esc(p.plan.src)}" alt="${esc(p.plan.alt)}" width="${p.plan.w}" height="${p.plan.h}" loading="lazy"></div></div>` : ''}
</div>`}</section>

<section class="loc" id="location"><div class="wrap">
  <div class="loc-grid">
    <div class="loc-text">
      <span class="eyebrow lt">Локация</span>
      <h2>${esc(p.city)}</h2>
      <p class="lead">${esc(p.location?.intro || '')}</p>
      <div class="dist">${(p.location?.distances || []).map((x) => `<div class="spot rv">${icon(x.icon || 'pin')}<div><b>${esc(x.value)}</b><span>${esc(x.label)}</span></div></div>`).join('')}</div>
    </div>
    ${p.location?.radar?.length ? (() => { const rings = p.location.radar; const n = rings.length; const R = (k) => (n === 3 ? [64, 112, 168][k] : 60 + k * (110 / Math.max(1, n - 1)));
      const waves = (cx, cy) => `<path d="M${cx - 16} ${cy}q4-6 8 0t8 0 8 0 8 0"/><path d="M${cx - 16} ${cy + 7}q4-6 8 0t8 0 8 0 8 0"/>`;
      const items = rings.map((g, k) => { const r = R(k); const ang = [-152, -28, 62][k % 3] * Math.PI / 180; const x = 200 + r * Math.cos(ang), y = 200 + r * Math.sin(ang);
        const mark = g.kind === 'sea' ? `<g class="rd-sea" transform="translate(0 0)">${waves(x, y)}</g>` : `<circle class="rd-dot" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5"/>`;
        const tx = g.kind === 'sea' ? x : (x > 200 ? x + 12 : x - 12), an = g.kind === 'sea' ? 'middle' : (x > 200 ? 'start' : 'end');
        return `<g class="rd-ring" style="--k:${k}"><circle class="rd-c" cx="200" cy="200" r="${r}"/>${mark}<text x="${tx.toFixed(1)}" y="${(y + (g.kind === 'sea' ? 24 : 4)).toFixed(1)}" text-anchor="${an}">${esc(g.label)}</text></g>`; }).join('');
      return `<div class="radar rv"><svg viewBox="0 0 400 400" role="img" aria-label="Схема: рядом остановки, главная улица, море в ${esc(p.location.distances?.[0]?.value || '2 км')}"><path class="rd-ax" d="M200 8V392M8 200H392"/>${items}<g class="rd-pin"><circle class="rd-pulse" cx="200" cy="200" r="24"/><circle cx="200" cy="200" r="22"/><path d="M190 202v-9l10-8 10 8v9z"/></g></svg><p class="rd-cap">Схема расположения · не в масштабе</p></div>`; })() : ''}
  </div>
  <div class="mapcard rv">
    <div class="mc-h"><span class="mc-t">${SVG.pin}${esc(p.mapTitle || 'Район ' + (p.location?.district || ''))}</span>${p.geo ? `<a class="btn btn-primary" id="mapOpen" target="_blank" rel="noopener" href="https://yandex.ru/maps/?ll=${p.geo.lng}%2C${p.geo.lat}&z=14" ${trk('map_open_ext')}>Открыть карту ${SVG.arr}</a>` : ''}</div>
    <div class="map" id="map">${p.geo ? `<button class="btn btn-primary" type="button" id="mapBtn" ${trk('map_open')}>Показать на карте</button>` : ''}</div>
    <div class="mc-f"><span>${SVG.pin}${p.geo && !p.geo.exact ? 'Показан район. Точный адрес сообщим при записи на показ.' : 'Расположение на карте'}</span><a href="#lead" ${trk('cta_map')}>Записаться на показ ${SVG.arr}</a></div>
  </div>
  ${p.geo?.exact ? `<div class="map-actions"><a class="btn btn-ghost" target="_blank" rel="noopener" href="https://yandex.ru/maps/?rtext=~${p.geo.lat},${p.geo.lng}&rtt=auto" ${trk('route_click')}>Построить маршрут</a></div>` : ''}
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
${p.terms?.length ? `<section class="terms-sec" id="terms"><div class="wrap">
  <span class="eyebrow">Условия покупки</span><h2>Просто и безопасно</h2>
  <img class="terms-deco" src="img/terms-scene.webp" alt="" width="532" height="172" loading="lazy" decoding="async">
  <div class="mosaic">
    ${(() => { const t = p.terms, art = ['financing-villa-calendar', 'documents-shield', 'aftercare-villa-key']; const card = (x, i) => i === 0
      ? `<article class="finance rv"><div class="finance-copy"><h3>${esc(x.title)}</h3><p>${esc(x.text)}</p><a class="btn btn-primary" href="#lead" ${trk('cta_terms')}>Узнать условия ${SVG.arr}</a></div><img class="finance-art" src="img/${art[0]}.webp" alt="" width="1100" height="833" loading="lazy" decoding="async"></article>`
      : `<article class="feature f${i} rv"><div><h3>${esc(x.title)}</h3><p>${esc(x.text)}</p></div><img src="img/${art[i]}.webp" alt="" loading="lazy" decoding="async"></article>`;
      return `${card(t[0], 0)}<div class="side">${t.slice(1, 3).map((x, i) => card(x, i + 1)).join('')}</div>`; })()}
  </div>
</div></section>` : ''}

<section class="trust" id="trust"><div class="wrap">
  <span class="eyebrow">Этапы сделки</span><h2>Как мы работаем</h2>
  <img class="trust-deco" src="img/steps-olive.webp" alt="" loading="lazy" decoding="async"><ol class="steps">${(p.steps || []).map((s, i) => `<li class="step rv"><img src="img/icons/step-0${i + 1}-${['message', 'tour', 'check', 'key'][i]}.svg" alt="" width="170" height="125" loading="lazy" decoding="async"><div><span class="step-num">0${i + 1}</span><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div></li>`).join('')}</ol>
  <div class="cta-band rv"><img class="cb-l" src="img/banner-left.webp" alt="" loading="lazy" decoding="async"><img class="cb-scene" src="img/banner-right.webp" alt="" loading="lazy" decoding="async"><p class="cb-t">Обсудим покупку вашей квартиры</p><a class="btn btn-light" href="#lead" ${trk('cta_trust')}>Получить консультацию ${SVG.arr}</a></div>
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
  <div class="lead-l">
    <span class="eyebrow lt">Заявка</span>
    <h2>${esc(p.leadFormTitle)}</h2>
    <p class="lead">${esc(p.leadFormSubtitle)}</p>
    ${p.manager?.cut ? `<div class="portrait-stage"><img class="lead-ph" src="${esc(p.manager.cut)}" alt="${esc(p.manager.name)}, ${esc(p.manager.role)}" width="1000" height="1000" loading="lazy" decoding="async"></div>` : ''}
    <div class="lead-man">
      <svg class="lm-ic" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="13" r="7"/><path d="M6 36c0-8 6-13 14-13s14 5 14 13z"/></svg>
      <div class="lm-t"><b>Ваш менеджер</b><span>Поможет с просмотром и ответит на вопросы.</span></div>
      <div class="lm-b">${btnWa('btn-o-wa', 'click_whatsapp_lead', 'WhatsApp')}${btnTg('btn-o-tg', 'click_telegram_lead', 'Telegram')}</div>
    </div>
  </div>
  <div class="lead-r">
    <form class="form" id="leadForm" novalidate>
      <h3 class="form-h">${esc(p.formTitle || 'Записаться на показ')}</h3>
      <p class="form-s">${esc(p.formSubtitle || 'Оставьте контакты — согласуем удобное время.')}</p>
      <div class="row"><label for="fName">Ваше имя</label><input id="fName" name="name" type="text" autocomplete="name" required aria-describedby="fErr"></div>
      <div class="row"><label for="fPhone">Телефон</label><input id="fPhone" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="+7 (___) ___-__-__" required aria-describedby="fErr"></div>
      <div class="row" role="group" aria-labelledby="msgLbl"><span class="lbl" id="msgLbl">Где удобно ответить?</span>
        <div class="seg">
          <input type="radio" id="m1" name="messenger" value="whatsapp" checked><label for="m1">${SVG.wa}WhatsApp</label>
          <input type="radio" id="m2" name="messenger" value="telegram"><label for="m2">${SVG.tg}Telegram</label>
          <input type="radio" id="m3" name="messenger" value="call"><label for="m3">${SVG.ph}Звонок</label>
        </div></div>
      <input class="hp" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
      <label class="consent"><input type="checkbox" name="consent" required><span>Согласен на обработку персональных данных согласно <a href="privacy.html" target="_blank" rel="noopener">политике конфиденциальности</a></span></label>
      <button class="btn btn-primary" type="submit">Записаться на показ ${SVG.arr}</button>
      <p class="form-n"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="8"/><path d="M10 5v5l3 2"/></svg>Ответим в рабочее время.</p>
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
