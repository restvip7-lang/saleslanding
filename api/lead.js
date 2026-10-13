import { esc, clip, sendTelegram, limited, ipOf, attrLines } from './_lib/tg.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false });
  const b = typeof req.body === 'string' ? safeJson(req.body) : req.body || {};

  // honeypot: боту отвечаем «успех», ничего не отправляем
  if (b.website) return res.status(200).json({ ok: true });
  if (limited(ipOf(req))) return res.status(429).json({ ok: false, error: 'rate_limited' });

  const name = clip(b.name, 80);
  const phone = clip(b.phone, 20);
  if (name.length < 2 || !/^\+7\d{10}$/.test(phone)) return res.status(400).json({ ok: false, error: 'invalid' });

  const channel = { whatsapp: 'WhatsApp', telegram: 'Telegram', call: 'Звонок' }[b.messenger] || 'не указан';
  const text = [
    `🏠 <b>НОВАЯ ЗАЯВКА</b> — ${esc(clip(b.title, 100) || clip(b.site, 40))}`,
    `👤 ${esc(name)}`,
    `📞 ${esc(phone)}`,
    `💬 Ответить в: <b>${channel}</b>`,
    '',
    ...attrLines(b),
    `🌐 ${esc(clip(b.page, 200))}`,
    `🕒 ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })} (МСК)`,
  ].join('\n');

  try {
    await sendTelegram(text);
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('lead send failed', e.message);
    return res.status(502).json({ ok: false, error: 'send_failed' });
  }
}

function safeJson(s) { try { return JSON.parse(s); } catch { return {}; } }
