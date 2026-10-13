import { esc, clip, sendTelegram, limited, ipOf, attrLines } from './_lib/tg.js';

// В Telegram-лог попадают только ключевые события (клики по контактам и формы).
const KEY = /^(click_(whatsapp|telegram|phone)|form_submit(_failed)?|route_click)/;
const LABEL = { whatsapp: '💬 WhatsApp', telegram: '✈️ Telegram', phone: '📞 Звонок' };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const b = typeof req.body === 'string' ? safeJson(req.body) : req.body || {};
  const ev = clip(b.event, 60);
  if (!KEY.test(ev) && !(process.env.TRACK_VIEWS === '1' && ev === 'view_new')) return res.status(204).end();
  if (limited(ipOf(req), 30)) return res.status(204).end();

  const m = ev.match(/^click_(whatsapp|telegram|phone)/);
  const title = m ? `${LABEL[m[1]]} — клик` : ev.startsWith('form_submit') ? '📝 Отправка формы' : ev === 'view_new' ? '👀 Новый визит' : `▶️ ${ev}`;
  const text = [`<b>${esc(title)}</b> · <code>${esc(ev)}</code> · ${esc(clip(b.site, 40))}`, ...attrLines(b), `🌐 ${esc(clip(b.page, 200))}`].join('\n');

  try { await sendTelegram(text, process.env.TELEGRAM_LOG_CHAT_ID); } catch (e) { console.error('track send failed', e.message); }
  return res.status(204).end();
}

function safeJson(s) { try { return JSON.parse(s); } catch { return {}; } }
