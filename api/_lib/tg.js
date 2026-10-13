// Общие утилиты для API: экранирование, отправка в Telegram, лимит запросов.
export const esc = (s = '') =>
  String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

export const clip = (s, n = 200) => String(s ?? '').replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, n);

export async function sendTelegram(text, chatId) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  chatId = chatId || process.env.TELEGRAM_CHAT_ID;
  if (process.env.DRY_RUN === '1') {
    console.log('[DRY_RUN telegram]', text);
    return { ok: true, dry: true };
  }
  // без токена заявка не должна «успешно» пропасть: пусть API ответит ошибкой
  if (!token || !chatId) throw new Error('telegram_not_configured');
  const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: true }),
  });
  if (!r.ok) throw new Error('telegram ' + r.status);
  return { ok: true };
}

const hits = new Map();
// грубый лимит в памяти инстанса: max запросов за окно на IP
export function limited(ip, max = 6, windowMs = 60_000) {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < windowMs);
  arr.push(now);
  hits.set(ip, arr);
  if (hits.size > 5000) hits.clear();
  return arr.length > max;
}

export const ipOf = (req) => (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket?.remoteAddress || 'unknown';

export function attrLines(b) {
  const src = [b.utm_source, b.utm_medium, b.utm_campaign].filter(Boolean).map((x) => clip(x, 60)).join(' / ');
  const ids = ['yclid', 'gclid', 'fbclid'].filter((k) => b[k]).map((k) => `${k}=${clip(b[k], 40)}`).join(', ');
  return [
    `🔗 Источник: <b>${esc(src || (b.referrer ? 'переход: ' + clip(b.referrer, 120) : 'прямой заход'))}</b>`,
    b.utm_content || b.utm_term ? `🏷 content/term: ${esc(clip(b.utm_content, 60))} / ${esc(clip(b.utm_term, 60))}` : '',
    ids ? `🆔 ${esc(ids)}` : '',
    `📱 ${esc(clip(b.device, 20))} · ${esc(clip(b.lang, 10))} · ${esc(clip(b.tz, 40))}`,
    `🧾 Визит: <code>${esc(clip(b.visit_id, 40))}</code> (код ${esc(clip(b.visit_id, 40).slice(-6))})`,
    b.first_landing ? `🚪 Лендинг: ${esc(clip(b.first_landing, 200))}` : '',
  ].filter(Boolean);
}
