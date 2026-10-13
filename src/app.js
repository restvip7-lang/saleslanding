(function () {
  var T = window.SLTrack || { track: function () {}, context: function () { return {}; } };
  var S = window.__SITE || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var fmt = function (n) { return new Intl.NumberFormat('ru-RU').format(Math.round(n)); };

  // reveal
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    $$('.rv').forEach(function (el) { io.observe(el); });
  } else $$('.rv').forEach(function (el) { el.classList.add('in'); });

  // галерея: показать все
  var mr = $('#moreBtn');
  if (mr) mr.addEventListener('click', function () {
    $$('.g-item.more').forEach(function (el) { el.classList.remove('more'); el.classList.add('in'); });
    mr.parentNode.remove();
  });

  // lightbox
  var photos = window.__PHOTOS || [], lb = $('#lb'), idx = 0, sx = 0;
  function show(i) {
    idx = (i + photos.length) % photos.length;
    var im = $('img', lb); im.src = photos[idx].src; im.alt = photos[idx].alt;
    $('.c', lb).textContent = (idx + 1) + ' / ' + photos.length;
  }
  function open(i) { show(i); lb.classList.add('open'); document.body.style.overflow = 'hidden'; T.track('gallery_open', {}, true); }
  function close() { lb.classList.remove('open'); document.body.style.overflow = ''; }
  $$('.g-item').forEach(function (b) { b.addEventListener('click', function () { open(+b.dataset.i); }); });
  $('.x', lb).onclick = close;
  $('.p', lb).onclick = function () { show(idx - 1); };
  $('.n', lb).onclick = function () { show(idx + 1); };
  lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
  lb.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) {
    var d = e.changedTouches[0].clientX - sx;
    if (Math.abs(d) > 50) show(idx + (d < 0 ? 1 : -1));
  });
  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(idx - 1);
    if (e.key === 'ArrowRight') show(idx + 1);
  });

  // карта по клику (не грузим тяжёлый iframe заранее)
  var mb = $('#mapBtn');
  if (mb && S.geo) {
    mb.addEventListener('click', function () {
      var g = S.geo;
      if (!g) return;
      var f = document.createElement('iframe');
      f.src = 'https://yandex.ru/map-widget/v1/?ll=' + g.lng + '%2C' + g.lat + '&z=15&pt=' + g.lng + '%2C' + g.lat + '%2Cpm2rdm';
      f.loading = 'lazy'; f.title = 'Карта';
      $('#map').appendChild(f); mb.remove();
    });
  }

  // калькулятор
  var cD = $('#cDown');
  if (cD) {
    var cY = $('#cYears'), cR = $('#cRate');
    var calc = function (user) {
      var price = S.price, dp = +cD.value, years = +cY.value, rate = +cR.value;
      $('#oDown').textContent = dp + '% · ' + fmt(price * dp / 100) + ' ₽';
      $('#oYears').textContent = years + ' лет';
      $('#oRate').textContent = rate + '%';
      var loan = price * (1 - dp / 100), r = rate / 100 / 12, n = years * 12;
      var pay = r ? loan * r / (1 - Math.pow(1 + r, -n)) : loan / n;
      $('#cRes').textContent = fmt(pay) + ' ₽';
      $('#cNote').textContent = 'Сумма кредита ' + fmt(loan) + ' ₽';
      if (user) T.track('calc_use', {}, true);
    };
    [cD, cY, cR].forEach(function (el) { el.addEventListener('input', function () { calc(true); }); });
    calc(false);
  }

  // форма
  var form = $('#leadForm'), err = $('#fErr'), started = false;
  var ph = $('#fPhone');
  function maskPhone(v) {
    var d = v.replace(/\D/g, '');
    if (d[0] === '8') d = '7' + d.slice(1);
    if (d && d[0] !== '7') d = '7' + d;
    d = d.slice(0, 11);
    var o = '+7';
    if (d.length > 1) o += ' (' + d.slice(1, 4);
    if (d.length >= 5) o += ') ' + d.slice(4, 7);
    if (d.length >= 8) o += '-' + d.slice(7, 9);
    if (d.length >= 10) o += '-' + d.slice(9, 11);
    return o;
  }
  ph.addEventListener('input', function () { ph.value = maskPhone(ph.value); });
  form.addEventListener('focusin', function () { if (!started) { started = true; T.track('form_start', {}, true); } });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    err.textContent = '';
    var fd = new FormData(form);
    var name = (fd.get('name') || '').toString().trim();
    var digits = (fd.get('phone') || '').toString().replace(/\D/g, '');
    if (name.length < 2) return (err.textContent = 'Укажите имя');
    if (digits.length < 11) return (err.textContent = 'Укажите телефон полностью');
    if (!fd.get('consent')) return (err.textContent = 'Нужно согласие на обработку данных');
    var btn = $('button[type=submit]', form); btn.disabled = true; btn.textContent = 'Отправляем…';
    var body = Object.assign(T.context(), {
      name: name, phone: '+' + digits, messenger: fd.get('messenger'), website: fd.get('website') || '', title: S.title,
    });
    function done(ok) {
      T.track(ok ? 'form_submit' : 'form_submit_failed', { messenger: body.messenger });
      form.style.display = 'none'; $('#thanks').classList.add('show');
      $('#thanks').scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    fetch('/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      .then(function (r) { if (!r.ok) throw new Error(r.status); done(true); })
      .catch(function () { done(false); });
  });

  // cookie
  var ck = $('#cookie');
  try { if (!localStorage.getItem('sl_cookie')) setTimeout(function () { ck.classList.add('show'); }, 8000); } catch (e) {}
  $('#cookieOk').onclick = function () { ck.classList.remove('show'); try { localStorage.setItem('sl_cookie', '1'); } catch (e) {} };
})();
