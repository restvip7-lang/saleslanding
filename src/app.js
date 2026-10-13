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

  // lightbox (работает по текущему списку слайдера)
  var all = window.__PHOTOS || [], photos = all, lb = $('#lb'), idx = 0, sx = 0;
  function show(i) {
    idx = (i + photos.length) % photos.length;
    var im = $('img', lb); im.src = photos[idx].src; im.alt = photos[idx].alt;
    $('.c', lb).textContent = (idx + 1) + ' / ' + photos.length;
  }
  var lastFocus = null;
  function open(i) { lastFocus = document.activeElement; show(i); lb.classList.add('open'); document.body.style.overflow = 'hidden'; $('.x', lb).focus(); T.track('gallery_open', {}, true); }
  function close() { lb.classList.remove('open'); document.body.style.overflow = ''; syncSlider(idx); if (lastFocus && lastFocus.focus) lastFocus.focus(); }
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
    if (e.key === 'Tab') { var f = $$('button', lb), first = f[0], last = f[f.length - 1]; if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); } }
    if (e.key === 'ArrowLeft') show(idx - 1);
    if (e.key === 'ArrowRight') show(idx + 1);
  });

  // слайдер карточки объекта: вкладки, миниатюры, стрелки, свайп
  var lsImg = $('#lsImg'), lsCount = $('#lsCount'), thumbs = $$('.ls-t'), cur = 0, group = 'all';
  function syncSlider(i) {
    cur = (i + photos.length) % photos.length;
    var p = photos[cur];
    lsImg.style.animation = 'none'; void lsImg.offsetWidth; lsImg.style.animation = '';
    lsImg.src = p.src; lsImg.alt = p.alt;
    lsCount.textContent = (cur + 1) + ' / ' + photos.length;
    thumbs.forEach(function (t) {
      var on = !t.hidden && all[+t.dataset.i] === p;
      t.classList.toggle('on', on); t.setAttribute('aria-current', on ? 'true' : 'false');
      if (on) {
        var box = $('#lsThumbs');
        box.scrollTo({ left: t.offsetLeft - (box.clientWidth - t.offsetWidth) / 2, behavior: 'smooth' });
      }
    });
    var nx = photos[(cur + 1) % photos.length]; if (nx) { var pre = new Image(); pre.src = nx.src; }
  }
  function step(d, user) { syncSlider(cur + d); if (user) T.track('gallery_slide', {}, true); }
  $('#lsPrev').onclick = function () { step(-1, true); };
  $('#lsNext').onclick = function () { step(1, true); };
  $('#lsOpen').onclick = function () { open(cur); };
  thumbs.forEach(function (t) {
    t.addEventListener('click', function () {
      syncSlider(photos.indexOf(all[+t.dataset.i])); T.track('gallery_thumb', {}, true);
    });
  });
  $$('.ls-tabs button').forEach(function (b) {
    b.addEventListener('click', function () {
      group = b.dataset.g;
      $$('.ls-tabs button').forEach(function (x) { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      photos = group === 'all' ? all : all.filter(function (p) { return p.group === group; });
      thumbs.forEach(function (t) { t.hidden = !(group === 'all' || t.dataset.g === group); });
      $('#lsThumbs').scrollLeft = 0;
      syncSlider(0); T.track('gallery_tab_' + group, {}, true);
    });
  });
  var lsx = 0, main = $('.ls-main');
  main.addEventListener('touchstart', function (e) { lsx = e.touches[0].clientX; }, { passive: true });
  main.addEventListener('touchend', function (e) {
    var d = e.changedTouches[0].clientX - lsx;
    if (Math.abs(d) > 40) step(d < 0 ? 1 : -1, true);
  });
  syncSlider(0);

  // видеообзор: плеер по клику, события 25/50/75/100
  var tv = $('#tourVid'), tp = $('#tourPlay');
  if (tv && tp) {
    tp.addEventListener('click', function () { tv.controls = true; tp.hidden = true; tv.play(); });
    tv.addEventListener('play', function () { T.track('video_play', {}, true); tp.hidden = true; });
    tv.addEventListener('timeupdate', function () {
      if (!tv.duration) return;
      var p = tv.currentTime / tv.duration * 100;
      [25, 50, 75].forEach(function (m) { if (p >= m) T.track('video_' + m, {}, true); });
    });
    tv.addEventListener('ended', function () { T.track('video_100', {}, true); });
  }

  // карта: подгружается сама, когда блок приближается к экрану
  var mapBox = $('#map'), mb = $('#mapBtn');
  function loadMap() {
    var g = S.geo;
    if (!mapBox || !g || $('iframe', mapBox)) return;
    var f = document.createElement('iframe');
    f.src = 'https://yandex.ru/map-widget/v1/?ll=' + g.lng + '%2C' + g.lat + '&z=15&pt=' + g.lng + '%2C' + g.lat + '%2Cpm2rdm';
    f.loading = 'lazy'; f.title = 'Карта: расположение комплекса';
    mapBox.appendChild(f); if (mb) mb.hidden = true;
    T.track('map_view', {}, true);
  }
  if (mapBox && S.geo) {
    if (mb) mb.addEventListener('click', loadMap);
    if ('IntersectionObserver' in window) {
      var mio = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { loadMap(); mio.disconnect(); } }, { rootMargin: '300px 0px' });
      mio.observe(mapBox);
    } else loadMap();
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
    var fName = $('#fName'), fCons = $('input[name=consent]', form);
    fName.removeAttribute('aria-invalid'); ph.removeAttribute('aria-invalid');
    if (name.length < 2) { fName.setAttribute('aria-invalid', 'true'); fName.focus(); return (err.textContent = 'Укажите имя'); }
    if (digits.length < 11) { ph.setAttribute('aria-invalid', 'true'); ph.focus(); return (err.textContent = 'Укажите телефон полностью'); }
    if (!fd.get('consent')) { fCons.focus(); return (err.textContent = 'Нужно согласие на обработку данных'); }
    var btn = $('button[type=submit]', form); btn.disabled = true; btn.textContent = 'Отправляем…';
    var body = Object.assign(T.context(), {
      name: name, phone: '+' + digits, messenger: fd.get('messenger'), website: fd.get('website') || '', title: S.title,
    });
    function done(ok) {
      T.track(ok ? 'form_submit' : 'form_submit_failed', { messenger: body.messenger });
      form.style.display = 'none'; $('#thanks').classList.add('show'); $('#thanks').setAttribute('tabindex', '-1'); $('#thanks').focus();
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

/* ===== effects ===== */
(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia && window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  var fmt = function (n) { return new Intl.NumberFormat('ru-RU').format(Math.round(n)); };

  // дополнительные элементы для плавного появления, со ступенчатой задержкой
  var targets = 'section:not(.hero) h2, section:not(.hero) .eyebrow, .lead, .ls-media, .ls-card, .calc, .faq details, .form, .agent, .specs, .plan, .dist div, .fact';
  $$(targets).forEach(function (el) {
    if (!el.classList.contains('rv')) el.classList.add('rv');
    var sibs = el.parentNode ? Array.prototype.indexOf.call(el.parentNode.children, el) : 0;
    el.style.setProperty('--d', Math.min(sibs, 6));
  });
  $$('.tour-wrap.rv').forEach(function (e) { e.classList.add('from-r'); });
  if (window.IntersectionObserver) {
    var io2 = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io2.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    $$('.rv').forEach(function (el) { if (!el.classList.contains('in')) io2.observe(el); });
  } else $$('.rv').forEach(function (el) { el.classList.add('in'); });

  // счётчики
  function easeOut(t) { return 1 - Math.pow(2 - 2 * t, 3) / 8 > 1 ? 1 : 1 - Math.pow(1 - t, 4); }
  function countTo(el, to, suffix, dur) {
    if (reduce) { el.textContent = fmt(to) + suffix; return; }
    var t0 = null;
    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      el.textContent = fmt(to * easeOut(p)) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var hp = $('.hero-price b[data-count]');
  if (hp) { var tv = +hp.dataset.count, sf = hp.dataset.suffix || ''; hp.textContent = '0' + sf; setTimeout(function () { countTo(hp, tv, sf, 2200); }, 900); }
  var numIO = window.IntersectionObserver && new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      numIO.unobserve(e.target);
      var raw = e.target.dataset.raw, m = raw.match(/^(\d+(?:\s\d{3})*)(.*)$/);
      countTo(e.target, parseInt(m[1].replace(/\s/g, ''), 10), m[2], 1600);
    });
  }, { threshold: 0.6 });
  if (numIO) $$('.fact b, .dist b, .ig-num').forEach(function (b) {
    var t = b.textContent.trim();
    if (!/^\d/.test(t) || /[+]|из/.test(t) || /^(19|20)\d\d$/.test(t)) return;
    b.dataset.raw = t; numIO.observe(b);
  });

  // прогресс, липкая шапка, параллакс
  var prog = $('#prog'), stick = $('#stick'), par = $('#heroPar'), hero = $('.hero'), heroWrap = $('.hero-copy'), ticking = false;
  function onScroll() {
    var y = window.pageYOffset, h = document.documentElement.scrollHeight - window.innerHeight;
    if (prog) prog.style.transform = 'scaleX(' + (h > 0 ? y / h : 0) + ')';
    var hh = hero ? hero.offsetHeight : 700;
    if (stick) stick.classList.toggle('on', y > hh * 0.85);
    if (!reduce && y < hh * 1.3) {
      if (par) par.style.transform = 'translate3d(0,' + (y * 0.1).toFixed(1) + 'px,0) scale(' + (1.04 + y / hh * 0.08).toFixed(4) + ')';
      if (heroWrap && window.innerWidth > 759) { heroWrap.style.transform = 'translate3d(0,' + (y * -0.08).toFixed(1) + 'px,0)'; heroWrap.style.opacity = Math.max(0, 1 - y / (hh * 0.9)).toFixed(3); }
    }
    ticking = false;
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  if (fine && !reduce) {
    // подсветка за курсором на карточках
    $$('.spot, .ls-card, .term').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var b = el.getBoundingClientRect();
        el.style.setProperty('--mx', (e.clientX - b.left) + 'px'); el.style.setProperty('--my', (e.clientY - b.top) + 'px');
      });
    });
    // магнитные кнопки
    $$('.btn-primary, .btn-wa, .btn-tg').forEach(function (b) {
      b.addEventListener('mousemove', function (e) {
        var r = b.getBoundingClientRect(), x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
        b.style.transform = 'translate(' + (x * 0.18).toFixed(1) + 'px,' + (y * 0.28).toFixed(1) + 'px)';
      });
      b.addEventListener('mouseleave', function () { b.style.transform = ''; });
    });
    // лёгкий наклон главной карточки слайдера
    var main = $('.ls-main');
    if (main) {
      main.style.transition = 'transform .5s cubic-bezier(.2,.7,.2,1)';
      main.addEventListener('mousemove', function (e) {
        var b = main.getBoundingClientRect(), x = (e.clientX - b.left) / b.width - .5, y = (e.clientY - b.top) / b.height - .5;
        main.style.transform = 'perspective(1100px) rotateY(' + (x * 3).toFixed(2) + 'deg) rotateX(' + (-y * 3).toFixed(2) + 'deg)';
      });
      main.addEventListener('mouseleave', function () { main.style.transform = ''; });
    }
  }
})();
