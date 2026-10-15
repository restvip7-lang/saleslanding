// Шаблоны рекламных картинок (Instagram / Stories / Telegram). HTML для рендера в PNG: tools/render-promo.mjs
// Данные берутся из property.json; пути к файлам абсолютные (file://), рендер идёт локально.
import { pathToFileURL } from 'node:url';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const esc = (s = '') => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmt = (n) => new Intl.NumberFormat('ru-RU').format(n);
const money = (n, cur) => fmt(n) + ({ RUB: ' ₽', EUR: ' €', USD: ' $' }[cur] || ' ' + cur);

export const FORMATS = [
  { id: 'post-4x5', w: 1080, h: 1350, label: 'Instagram пост 4:5', hint: 'Лента Instagram, Facebook' },
  { id: 'story-9x16', w: 1080, h: 1920, label: 'Stories и статус 9:16', hint: 'Instagram Stories, статус WhatsApp, Reels' },
  { id: 'wide-16x9', w: 1280, h: 720, label: 'Telegram-канал 16:9', hint: 'Посты в Telegram-каналах, превью ссылок' },
];
export const VARIANTS = [
  { id: 'photo', label: 'Фото и цена' },
  { id: 'info', label: 'Инфографика' },
];

export function promoPages(p, propDir) {
  const url = (rel) => pathToFileURL(join(propDir, rel)).href;
  const font = (f) => pathToFileURL(join(here, 'promo', 'fonts', f)).href;
  const g = p.infographic || {};
  const price = money(p.price, p.currency || 'EUR');
  const sea = g.sea ? `${(g.sea.meters / 1000).toLocaleString('ru-RU')} км` : '';
  const heroPhoto = p.photos.find((x) => x.group === 'complex') || p.photos[0];
  const icon = (n) => url(`assets/icons/${n}.svg`);
  const brand = esc(p.brand || '');
  const place = esc(p.city || '');

  const base = (w, h, body, css) => `<!doctype html><html lang="ru"><meta charset="utf-8"><style>
@font-face{font-family:Prata;src:url("${font('Prata-400.ttf')}")}
${[400, 500, 600, 700].map((x) => `@font-face{font-family:"Golos Text";font-weight:${x};src:url("${font(`GolosText-${x}.ttf`)}")}`).join('')}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${w}px;height:${h}px;overflow:hidden;background:#0a2231}
body{position:relative;font-family:"Golos Text",sans-serif;color:#f2ede3;-webkit-font-smoothing:antialiased}
.serif{font-family:Prata,Georgia,serif;font-weight:400}
.brand{display:flex;align-items:center;gap:14px;font:400 30px/1 Prata,serif;letter-spacing:.14em;text-transform:uppercase}
.brand i{display:block;width:44px;height:44px;border-radius:50%;border:2px solid #ee8156;position:relative}
.brand i::after{content:"";position:absolute;left:50%;top:50%;width:14px;height:14px;background:#ee8156;transform:translate(-50%,-50%) rotate(45deg)}
${css}
</style><body>${body}</body></html>`;

  const chips = (cls = '') => [g.area && `${g.area.value} ${g.area.unit}`, g.floor && `${g.floor.n} из ${g.floor.total} этаж`, sea && `${sea} до моря`]
    .filter(Boolean).map((t) => `<span class="${cls}">${esc(t)}</span>`).join('');

  const out = [];
  for (const f of FORMATS) {
    const { w, h } = f;
    const story = f.id === 'story-9x16', wide = f.id === 'wide-16x9';
    const S = wide ? 0.62 : 1; // масштаб шрифтов для широкого формата
    const px = (n) => Math.round(n * S);
    const padX = wide ? 56 : 72, padT = story ? 230 : wide ? 44 : 72, padB = story ? 260 : wide ? 44 : 72;

    // ---------- вариант 1: фото и цена ----------
    const photoCss = `
.bg{position:absolute;inset:0;background:url("${url(heroPhoto.src)}") center/cover}
.sh{position:absolute;inset:0;background:linear-gradient(180deg,rgba(10,34,49,.55) 0%,rgba(10,34,49,0) 20%,rgba(10,34,49,.3) 40%,rgba(10,34,49,.88) 60%,rgba(10,34,49,.96) 100%)}
${wide ? '.sh{background:linear-gradient(90deg,rgba(10,34,49,.94) 0%,rgba(10,34,49,.7) 42%,rgba(10,34,49,0) 72%)}' : ''}
.wrap{position:absolute;inset:0;padding:${padT}px ${padX}px ${padB}px;display:flex;flex-direction:column;justify-content:space-between}
.brand{font-size:${px(30)}px}.brand i{width:${px(44)}px;height:${px(44)}px}
.copy{${wide ? 'max-width:56%' : ''}}
.eyebrow{font:600 ${px(26)}px/1.2 "Golos Text";letter-spacing:.2em;text-transform:uppercase;color:#ee8156;margin-bottom:${px(22)}px}
h1{font:400 ${px(story ? 132 : 112)}px/1.02 Prata,serif;letter-spacing:-.01em;margin-bottom:${px(30)}px;text-wrap:balance}
.chips{display:flex;flex-wrap:wrap;gap:${px(14)}px;margin-bottom:${px(34)}px}
.chip{padding:${px(14)}px ${px(26)}px;border:2px solid rgba(242,237,227,.55);border-radius:999px;font:600 ${px(28)}px/1 "Golos Text";background:rgba(10,34,49,.35)}
.price{display:inline-flex;align-items:baseline;gap:${px(18)}px;padding:${px(20)}px ${px(40)}px;background:#c94a1e;border-radius:999px;font:400 ${px(story ? 84 : 76)}px/1 Prata,serif}
.price small{font:600 ${px(24)}px/1 "Golos Text";letter-spacing:.14em;text-transform:uppercase;opacity:.9}`;
    const photoBody = `<div class="bg"></div><div class="sh"></div><div class="wrap">
  <div class="brand"><i></i>${brand}</div>
  <div class="copy"><div class="eyebrow">${esc(p.type)} · ${place}</div><h1>${esc(p.title)}</h1>
  <div class="chips">${chips('chip')}</div><div class="price"><small>Цена</small>${esc(price)}</div></div></div>`;

    // ---------- вариант 2: инфографика ----------
    const tiles = [
      { ic: 'area', v: g.area && `${g.area.value}`, u: g.area && g.area.unit, l: 'Общая площадь' },
      { ic: 'bed', v: g.rooms && g.rooms.label, l: 'Две спальни и гостиная' },
      { ic: 'floor-5-of-7', v: g.floor && `${g.floor.n} из ${g.floor.total}`, l: 'Этаж' },
      { ic: 'sea-distance-ic', v: sea, l: 'До моря' },
      { ic: 'year-building', v: g.year && g.year.value, l: 'Год постройки' },
      { ic: 'sofa', v: 'С мебелью', l: 'Готова к проживанию' },
    ];
    const tileHtml = tiles.map((t) => `<div class="tile"><span class="ti"><img src="${icon(t.ic === 'sea-distance-ic' ? 'sea' : t.ic)}" alt=""></span><div><b>${esc(t.v)}${t.u ? `<em>${esc(t.u)}</em>` : ''}</b><span>${esc(t.l)}</span></div></div>`).join('');
    const cols = 2;
    const photoH = story ? 520 : wide ? 0 : 380;
    const infoCss = `
body{background:radial-gradient(900px 600px at 0 100%,rgba(201,74,30,.3),transparent 60%),radial-gradient(800px 500px at 100% 0,rgba(56,196,189,.16),transparent 60%),#0a2231}
.wrap{position:absolute;inset:0;padding:${padT}px ${padX}px ${padB}px;display:flex;${wide ? 'flex-direction:row;gap:48px;align-items:stretch' : 'flex-direction:column;gap:' + px(story ? 36 : 30) + 'px'}}
.brand{font-size:${px(30)}px}.brand i{width:${px(44)}px;height:${px(44)}px}
.left{${wide ? 'flex:0 0 44%;display:flex;flex-direction:column;min-width:0' : ''}}
.lph{display:none}${wide ? `.lph{display:block;position:relative;flex:1;margin-top:22px;border-radius:26px;background:url("${url(heroPhoto.src)}") center/cover;min-height:0}.lph .price{position:absolute;left:18px;bottom:18px;box-shadow:0 12px 30px -10px rgba(0,0,0,.6)}` : ''}
.eyebrow{font:600 ${px(24)}px/1.2 "Golos Text";letter-spacing:.2em;text-transform:uppercase;color:#ee8156;margin:${px(26)}px 0 ${px(14)}px}
h1{font:400 ${wide ? 60 : px(story ? 104 : 92)}px/1.04 Prata,serif;text-wrap:balance}
${photoH ? `.ph{height:${photoH}px;border-radius:32px;background:url("${url(heroPhoto.src)}") center/cover;flex:none}` : ''}
.grid{flex:1;display:grid;grid-template-columns:repeat(${cols},1fr);gap:${wide ? 14 : 18}px;align-content:stretch}
.tile{display:flex;align-items:center;gap:${wide ? 14 : 22}px;padding:${wide ? 12 : 22}px ${wide ? 18 : 26}px;background:#f4efe5;color:#0a2231;border-radius:${wide ? 18 : 28}px;min-width:0}
.ti{flex:none;display:grid;place-items:center;width:${wide ? 64 : 92}px;height:${wide ? 64 : 92}px;border-radius:50%;background:#0a2231}
.ti img{width:${wide ? 42 : 52}px;height:${wide ? 42 : 52}px;filter:brightness(0) invert(.93)}
.tile b{display:block;font:400 ${wide ? 35 : story ? 56 : 54}px/1.05 Prata,serif;white-space:nowrap}
.tile b em{font:400 .5em Prata;margin-left:.2em;font-style:normal}
.tile span:not(.ti){display:block;font:600 ${wide ? 16 : 22}px/1.25 "Golos Text";color:#5a6872;margin-top:${wide ? 6 : 8}px;letter-spacing:.02em}
.foot{display:flex;align-items:center;justify-content:space-between;gap:24px}
.price{display:inline-flex;align-items:baseline;gap:${px(18)}px;padding:${wide ? 14 : px(20)}px ${wide ? 30 : px(40)}px;background:#c94a1e;border-radius:999px;font:400 ${wide ? 52 : px(story ? 80 : 72)}px/1 Prata,serif}
.price small{font:600 ${px(24)}px/1 "Golos Text";letter-spacing:.14em;text-transform:uppercase;opacity:.9}
.tag{font:500 ${wide ? 14 : 24}px/1.3 "Golos Text";color:rgba(242,237,227,.75);text-align:right}`;
    const infoBody = wide
      ? `<div class="wrap"><div class="left"><div><div class="brand"><i></i>${brand}</div><div class="eyebrow">${esc(p.type)} · ${place}</div><h1>${esc(p.title)}</h1></div><div class="lph"><div class="price"><small>Цена</small>${esc(price)}</div></div></div><div class="grid">${tileHtml}</div></div>`
      : `<div class="wrap"><div class="top"><div class="brand"><i></i>${brand}</div><div class="eyebrow">${esc(p.type)} · ${place}</div><h1>${esc(p.title)}</h1></div>${photoH ? '<div class="ph"></div>' : ''}<div class="grid">${tileHtml}</div><div class="foot"><div class="price"><small>Цена</small>${esc(price)}</div><div class="tag">${esc(p.listingNote || 'Вторичный рынок')}</div></div></div>`;

    out.push({ ...f, variant: 'photo', variantLabel: VARIANTS[0].label, file: `${f.id}-photo.png`, html: base(w, h, photoBody, photoCss) });
    out.push({ ...f, variant: 'info', variantLabel: VARIANTS[1].label, file: `${f.id}-info.png`, html: base(w, h, infoBody, infoCss) });
  }
  return out;
}
