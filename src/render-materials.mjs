// Страница /materials: готовые рекламные картинки для менеджеров (скрытая ссылка, noindex).
import { FORMATS, VARIANTS } from './render-promo.mjs';

const esc = (s = '') => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export function renderMaterials(p, { origin, hasZip }) {
  const g = { A: 'photo', B: 'info' };
  const cards = FORMATS.map((f) => `
  <section class="mt-fmt">
    <div class="mt-fh"><h2>${esc(f.label)}</h2><p>${esc(f.hint)} · ${f.w}×${f.h} px</p></div>
    <div class="mt-row mt-${f.id}">${VARIANTS.map((v) => {
      const file = `promo/${f.id}-${v.id}.png`;
      return `<figure class="mt-card">
        <a class="mt-prev" href="${file}" target="_blank" rel="noopener" data-track="open_promo_${f.id}_${v.id}"><img src="${file}" width="${f.w}" height="${f.h}" alt="${esc(p.title)}: ${esc(v.label)}, ${esc(f.label)}" decoding="async"></a>
        <figcaption><b>${esc(v.label)}</b><div class="mt-btns"><a class="btn btn-primary" href="${file}" download="${esc(p.id)}-${f.id}-${v.id}.png" data-track="download_promo_${f.id}_${v.id}">Скачать</a><a class="btn btn-ghost" href="${file}" target="_blank" rel="noopener" data-track="open_promo_${f.id}_${v.id}">Открыть</a></div></figcaption></figure>`;
    }).join('')}</div>
  </section>`).join('');
  return `<!doctype html>
<html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>Материалы для менеджеров — ${esc(p.title)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Prata&family=Golos+Text:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="assets/styles.css">
<style>
body{padding-bottom:0}
.mt-wrap{max-width:1180px;margin:0 auto;padding:48px 20px 72px}
.mt-top{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:20px;margin-bottom:34px}
.mt-top h1{font-size:clamp(34px,5vw,60px);color:var(--ink);margin:6px 0 10px}
.mt-top p{color:var(--muted);max-width:42em}
.mt-fmt{padding:0;margin-top:40px}
.mt-fh h2{font-size:clamp(24px,3vw,34px);margin:0 0 4px}.mt-fh p{color:var(--muted);font-size:14px;margin-bottom:16px}
.mt-row{display:grid;gap:18px;grid-template-columns:1fr}
.mt-card{background:#fff;border:1px solid var(--line);border-radius:22px;padding:14px;display:flex;flex-direction:column;gap:12px;box-shadow:0 18px 44px -34px rgba(10,34,49,.4)}
.mt-prev{display:block;border-radius:14px;overflow:hidden;background:var(--paper-2)}
.mt-prev img{width:100%;height:auto;display:block;transition:transform .5s var(--ease)}.mt-prev:hover img{transform:scale(1.02)}
.mt-card figcaption{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px}
.mt-card figcaption b{font-size:16px;color:var(--ink)}
.mt-btns{display:flex;gap:8px}.mt-btns .btn{min-height:42px;padding:0 20px;font-size:14px}.mt-btns .btn-ghost{background:transparent;color:var(--ink);border:1.5px solid var(--ink)}.mt-btns .btn-ghost:hover{background:var(--ink);color:#fff}
.mt-top .eyebrow::before{display:none}
@media (min-width:760px){.mt-row{grid-template-columns:1fr 1fr}.mt-story-9x16{grid-template-columns:repeat(2,minmax(0,380px));justify-content:start}}
.mt-tips{background:var(--ink);color:var(--paper);border-radius:22px;padding:24px 28px;margin-top:44px}
.mt-tips h3{font-size:24px;color:#fff;margin-bottom:10px}.mt-tips ul{margin-left:20px;color:rgba(242,237,227,.85);line-height:1.7}
</style></head><body>
<main class="mt-wrap">
  <div class="mt-top"><div><span class="eyebrow" style="counter-increment:none">${esc(p.brand)}</span><h1>Материалы для рекламы</h1>
    <p>${esc(p.title)}, ${esc(p.type)}, ${esc(p.city)}. Готовые картинки для Instagram, WhatsApp и Telegram: выберите формат и нажмите «Скачать».</p></div>
    ${hasZip ? `<a class="btn btn-dark" href="promo/${esc(p.id)}-promo.zip" download data-track="download_promo_zip">Скачать всё (ZIP)</a>` : ''}</div>
  ${cards}
  <div class="mt-tips"><h3>Где что использовать</h3><ul>
    <li><b>4:5</b> — пост в ленту Instagram и Facebook.</li>
    <li><b>9:16</b> — Instagram Stories, Reels (обложка) и статус в WhatsApp.</li>
    <li><b>16:9</b> — пост в Telegram-канал и превью для ссылок.</li></ul></div>
</main>
<script>window.__SITE=${JSON.stringify({ id: p.id, analytics: p.analytics || {} }).replace(/</g, '\\u003c')};</script>
<script src="assets/tracking.js" defer></script>
</body></html>`;
}
