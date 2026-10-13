/* Трекинг: visit_id, UTM/click-id, события -> Метрика, GA4, Meta/VK Pixel и /api/track. */
(function () {
  var S = window.__SITE || {};
  var A = S.analytics || {};
  var LS = 'sl_attr_v1';
  var now = Date.now();

  function rnd() {
    var a = new Uint8Array(5);
    (window.crypto || window.msCrypto).getRandomValues(a);
    return Array.prototype.map.call(a, function (b) { return ('0' + b.toString(16)).slice(-2); }).join('');
  }
  function getCookie(n) {
    var m = document.cookie.match(new RegExp('(?:^|; )' + n + '=([^;]*)'));
    return m ? decodeURIComponent(m[1]) : '';
  }
  function setCookie(n, v, days) {
    document.cookie = n + '=' + encodeURIComponent(v) + ';path=/;max-age=' + days * 86400 + ';SameSite=Lax';
  }
  function lsGet() { try { return JSON.parse(localStorage.getItem(LS) || 'null'); } catch (e) { return null; } }
  function lsSet(v) { try { localStorage.setItem(LS, JSON.stringify(v)); } catch (e) {} }

  var q = new URLSearchParams(location.search);
  var KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'yclid', 'gclid', 'fbclid', 'ysclid', 'vkclid', 'ref'];
  var fresh = {};
  KEYS.forEach(function (k) { if (q.get(k)) fresh[k] = q.get(k).slice(0, 200); });

  var stored = lsGet();
  var visitId = getCookie('sl_vid') || (stored && stored.visit_id);
  var isNew = !visitId;
  if (!visitId) visitId = 'v' + now.toString(36) + rnd();
  setCookie('sl_vid', visitId, 90);

  // first-touch сохраняем; если пришли с новыми метками — обновляем last-touch
  var attr = stored || { visit_id: visitId, first_seen: now, first: {}, last: {} };
  attr.visit_id = visitId;
  var ref = document.referrer && document.referrer.indexOf(location.host) === -1 ? document.referrer : '';
  if (isNew || !attr.first.landing) {
    attr.first = Object.assign({}, fresh, { referrer: ref, landing: location.href });
  }
  if (Object.keys(fresh).length || ref) {
    attr.last = Object.assign({}, fresh, { referrer: ref, landing: location.href });
  }
  lsSet(attr);

  var ua = navigator.userAgent || '';
  var device = /Mobi|Android|iPhone/i.test(ua) ? 'mobile' : /iPad|Tablet/i.test(ua) ? 'tablet' : 'desktop';

  function context() {
    var src = Object.keys(attr.last || {}).length > 1 ? attr.last : attr.first;
    return {
      visit_id: visitId,
      site: S.id,
      page: location.href.split('#')[0],
      utm_source: src.utm_source || '', utm_medium: src.utm_medium || '', utm_campaign: src.utm_campaign || '',
      utm_content: src.utm_content || '', utm_term: src.utm_term || '',
      yclid: src.yclid || '', gclid: src.gclid || '', fbclid: src.fbclid || '',
      referrer: (attr.first && attr.first.referrer) || (src.referrer || ''),
      first_landing: (attr.first && attr.first.landing) || '',
      device: device, lang: navigator.language || '', tz: (Intl.DateTimeFormat().resolvedOptions() || {}).timeZone || '',
      screen: screen.width + 'x' + screen.height,
    };
  }

  // ---- загрузка счётчиков ----
  function loadScript(src) { var s = document.createElement('script'); s.async = true; s.src = src; document.head.appendChild(s); }

  if (A.yandexMetrika) {
    (function (m, e, t, r, i) { m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments); }; m[i].l = 1 * new Date(); var k = e.createElement(t); k.async = 1; k.src = r; e.head.appendChild(k); })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');
    window.ym(A.yandexMetrika, 'init', { clickmap: true, trackLinks: true, accurateTrackBounce: true, webvisor: true, params: { visit_id: visitId } });
    window.ym(A.yandexMetrika, 'userParams', { visit_id: visitId });
  }
  if (A.ga4) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    loadScript('https://www.googletagmanager.com/gtag/js?id=' + A.ga4);
    window.gtag('js', new Date());
    window.gtag('config', A.ga4, { user_id: visitId });
  }
  if (A.metaPixel) {
    !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', A.metaPixel); window.fbq('track', 'PageView');
  }
  if (A.vkPixel) {
    window._tmr = window._tmr || [];
    window._tmr.push({ id: A.vkPixel, type: 'pageView', start: now });
    loadScript('https://top-fwz1.mail.ru/js/code.js');
  }

  var LEAD_EVENTS = { form_submit: 'Lead', click_whatsapp: 'Contact', click_telegram: 'Contact', click_phone: 'Contact' };

  function send(name, params) {
    params = params || {};
    try { if (A.yandexMetrika && window.ym) window.ym(A.yandexMetrika, 'reachGoal', name, params); } catch (e) {}
    try { if (A.ga4 && window.gtag) window.gtag('event', name, params); } catch (e) {}
    try {
      if (A.metaPixel && window.fbq) {
        var base = name.replace(/_(bar|lead|thanks)$/, '');
        if (LEAD_EVENTS[base]) window.fbq('track', LEAD_EVENTS[base], params); else window.fbq('trackCustom', name, params);
      }
    } catch (e) {}
    try { if (A.vkPixel && window._tmr) window._tmr.push({ type: 'reachGoal', id: A.vkPixel, goal: name }); } catch (e) {}
    var body = JSON.stringify(Object.assign({ event: name, params: params, ts: Date.now() }, context()));
    try {
      if (navigator.sendBeacon) navigator.sendBeacon('/api/track', new Blob([body], { type: 'application/json' }));
      else fetch('/api/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: body, keepalive: true });
    } catch (e) {}
  }

  var once = {};
  function track(name, params, onlyOnce) {
    if (onlyOnce) { if (once[name]) return; once[name] = 1; }
    send(name, params);
  }

  // ссылки на мессенджеры дополняем кодом визита, чтобы менеджер видел источник
  function decorateLinks() {
    var code = ' (код ' + visitId.slice(-6) + ')';
    document.querySelectorAll('a[data-channel]').forEach(function (a) {
      if (a.href.indexOf('t.me/+') !== -1) return; // phone-ссылки Telegram не поддерживают text
      try {
        var u = new URL(a.href);
        var t = u.searchParams.get('text') || '';
        if (t.indexOf('(код ') === -1) u.searchParams.set('text', t + code);
        a.href = u.toString();
      } catch (e) {}
    });
  }

  // клики по [data-track]
  document.addEventListener('click', function (e) {
    var el = e.target.closest && e.target.closest('[data-track]');
    if (!el) return;
    track(el.getAttribute('data-track'), { href: el.getAttribute('href') || '' });
  }, true);

  // скролл и время
  var marks = [25, 50, 75, 100];
  window.addEventListener('scroll', function () {
    var h = document.documentElement;
    var pct = (h.scrollTop + window.innerHeight) / h.scrollHeight * 100;
    marks.forEach(function (m) { if (pct >= m - 1) track('scroll_' + m, {}, true); });
  }, { passive: true });
  setTimeout(function () { track('time_30s', {}, true); }, 30000);
  setTimeout(function () { track('time_60s', {}, true); }, 60000);

  window.SLTrack = { track: track, context: context, visitId: visitId, decorate: decorateLinks };
  document.addEventListener('DOMContentLoaded', decorateLinks);
  track(isNew ? 'view_new' : 'view_return', {}, true);
  track('view', {}, true);
})();
