// Генерирует HTML страницы из property.json. Без зависимостей.

const esc = (s = '') =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const money = (n, cur = 'RUB') =>
  new Intl.NumberFormat('ru-RU').format(n) + (cur === 'RUB' ? ' ₽' : ' ' + cur);

const ICONS = {
  sea: '<path d="M2 16c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2M2 20c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2M12 3v7M8 7l4-4 4 4"/>',
  key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M16 7l3 3M14 9l2 2"/>',
  car: '<path d="M5 17h14M3 13l2-6h14l2 6v4H3zM7 17v2M17 17v2"/><circle cx="7.5" cy="13.5" r=".5"/><circle cx="16.5" cy="13.5" r=".5"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
  spa: '<path d="M12 21c-4 0-7-3-7-7 4 0 7 3 7 7zM12 21c4 0 7-3 7-7-4 0-7 3-7 7zM12 14c-3-2-3-7 0-11 3 4 3 9 0 11z"/>',
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
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Manrope:wght@400;600;700&display=swap&subset=cyrillic">
<link rel="stylesheet" href="assets/styles.css">
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
</head>
<body>
<header class="top"><div class="wrap">
  <a class="logo" href="#top">${esc(p.title)}</a>
  ${c.phone ? `<a class="top-phone" href="${telHref}" ${trk('click_phone')}>${esc(c.phoneDisplay || c.phone)}</a>` : ''}
</div></header>

<main id="top">
<section class="hero">
  <div class="hero-bg"><img src="${esc(hero.src)}" alt="${esc(hero.alt)}" width="${hero.w}" height="${hero.h}" fetchpriority="high"></div>
  <div class="wrap">
    <span class="badge">${esc(p.type)} · ${esc(p.city)} · ${esc(p.status)}</span>
    <h1>${esc(p.title)}</h1>
    <p class="sub">${esc(p.tagline)}</p>
    <div class="hero-meta">${(p.heroFacts || []).map((f) => `<span class="chip">${esc(f)}</span>`).join('')}</div>
    <div class="hero-price"><b>${money(p.price, p.currency)}</b></div>
    <div class="hero-cta">
      <a class="btn btn-primary" href="#lead" ${trk('cta_hero_presentation')}>Получить презентацию</a>
      ${btnWa('btn-ghost-wa', 'click_whatsapp', 'WhatsApp')}
    </div>
  </div>
</section>

<section class="facts"><div class="wrap"><div class="facts-grid">
  ${(p.facts || []).map((f) => `<div class="fact"><b>${esc(f.value)}</b><span>${esc(f.label)}</span></div>`).join('')}
</div></div></section>

<section id="about"><div class="wrap about-grid">
  <div class="about-text rv">
    <span class="eyebrow">Об объекте</span>
    <h2>Жизнь, которую вы заслужили</h2>
    ${(p.description || []).map((x) => `<p>${esc(x)}</p>`).join('')}
    <a class="btn btn-dark" href="#lead" ${trk('cta_about')}>Записаться на показ</a>
  </div>
  <div class="features rv">
    ${(p.features || []).map((f) => `<div class="feature">${icon(f.icon)}<div><h3>${esc(f.title)}</h3><p>${esc(f.text)}</p></div></div>`).join('')}
  </div>
</div></section>

<section class="gallery" id="gallery"><div class="wrap">
  <span class="eyebrow">Галерея</span><h2>Смотрите детали</h2>
  <div class="g-grid">
    ${p.photos.map((ph, i) => `<button class="g-item rv" type="button" data-i="${i}" aria-label="Открыть фото ${i + 1}"><img src="${esc(ph.src)}" alt="${esc(ph.alt)}" width="${ph.w}" height="${ph.h}" ${i ? 'loading="lazy"' : ''}></button>`).join('')}
  </div>
  ${p.video?.embed ? `<div class="video-box"><iframe src="${esc(p.video.embed)}" loading="lazy" allowfullscreen title="Видео объекта"></iframe></div>` : ''}
</div></section>

<section id="specs"><div class="wrap spec-grid">
  <div class="rv"><span class="eyebrow">Характеристики</span><h2>Всё о квартире</h2>
    <dl class="specs">${(p.specs || []).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl></div>
  ${p.plan ? `<div class="rv"><span class="eyebrow">Планировка</span><h2>Продуманное пространство</h2>
    <div class="plan"><img src="${esc(p.plan.src)}" alt="${esc(p.plan.alt)}" width="${p.plan.w}" height="${p.plan.h}" loading="lazy"></div></div>` : ''}
</div></section>

<section class="loc" id="location"><div class="wrap">
  <span class="eyebrow" style="color:#f1d9a1">Локация</span>
  <h2>${esc(p.city)}, ${esc(p.address)}</h2>
  <p class="lead">${esc(p.location?.intro || '')}</p>
  <div class="dist">${(p.location?.distances || []).map((x) => `<div><b>${esc(x.value)}</b><span>${esc(x.label)}</span></div>`).join('')}</div>
  <div class="map" id="map">${p.geo ? `<button class="btn btn-primary" type="button" id="mapBtn" ${trk('map_open')}>Показать на карте</button>` : ''}</div>
  ${p.geo ? `<div class="map-actions"><a class="btn btn-ghost" target="_blank" rel="noopener" href="https://yandex.ru/maps/?rtext=~${p.geo.lat},${p.geo.lng}&rtt=auto" ${trk('route_click')}>Построить маршрут</a></div>` : ''}
</div></section>

<section id="mortgage"><div class="wrap">
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
</div></section>

<section class="trust" id="trust"><div class="wrap">
  <span class="eyebrow">Безопасная сделка</span><h2>Как мы работаем</h2>
  <div class="steps">${(p.steps || []).map((s) => `<div class="step rv"><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div>`).join('')}</div>
  ${p.agent ? `<div class="agent"><img src="${esc(p.agent.photo)}" alt="${esc(p.agent.name)}" width="84" height="84" loading="lazy"><div><b>${esc(p.agent.name)}</b><span>${esc(p.agent.role)}</span><span>${esc(p.agent.experience)}</span></div></div>` : ''}
</div></section>

${p.faq?.length ? `<section class="faq" id="faq"><div class="wrap" style="max-width:820px">
  <span class="eyebrow">FAQ</span><h2>Частые вопросы</h2>
  ${p.faq.map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}
</div></section>` : ''}

<section class="lead-sec" id="lead"><div class="wrap lead-box">
  <div>
    <span class="eyebrow" style="color:#f1d9a1">Заявка</span>
    <h2>${esc(p.leadFormTitle)}</h2>
    <p class="lead">${esc(p.leadFormSubtitle)}</p>
    <div style="display:flex;flex-wrap:wrap;gap:12px;margin-top:26px">
      ${btnWa('', 'click_whatsapp_lead', 'WhatsApp')}${btnTg('', 'click_telegram_lead', 'Telegram')}
    </div>
  </div>
  <div>
    <form class="form" id="leadForm" novalidate>
      <div class="row"><label for="fName">Ваше имя</label><input id="fName" name="name" type="text" autocomplete="name" required></div>
      <div class="row"><label for="fPhone">Телефон</label><input id="fPhone" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="+7 (___) ___-__-__" required></div>
      <div class="row"><label>Где удобно ответить?</label>
        <div class="seg">
          <input type="radio" id="m1" name="messenger" value="whatsapp" checked><label for="m1">WhatsApp</label>
          <input type="radio" id="m2" name="messenger" value="telegram"><label for="m2">Telegram</label>
          <input type="radio" id="m3" name="messenger" value="call"><label for="m3">Звонок</label>
        </div></div>
      <input class="hp" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
      <label class="consent"><input type="checkbox" name="consent" required><span>Согласен на обработку персональных данных согласно <a href="privacy.html" target="_blank" rel="noopener">политике конфиденциальности</a></span></label>
      <button class="btn btn-primary" type="submit">Получить презентацию</button>
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

<div class="lb" id="lb" role="dialog" aria-modal="true" aria-label="Галерея">
  <button class="x" type="button" aria-label="Закрыть">×</button><button class="p" type="button" aria-label="Назад">‹</button><button class="n" type="button" aria-label="Вперёд">›</button>
  <img alt=""><div class="c"></div>
</div>

<div class="cookie" id="cookie"><span>Сайт использует cookie и сервисы аналитики для улучшения работы.</span><button type="button" id="cookieOk">Ок</button></div>

<script>window.__SITE=${JSON.stringify(clientCfg).replace(/</g, '\\u003c')};window.__PHOTOS=${JSON.stringify(p.photos.map((x) => ({ src: x.src, alt: x.alt }))).replace(/</g, '\\u003c')};</script>
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
