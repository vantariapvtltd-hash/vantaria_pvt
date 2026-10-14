/* ============================================================
   VANTARIA PVT. LTD. — SITE SCRIPT
   Cover, cursor, menus, hero silk, houses carousel and pop-up,
   platform tiles, counters, globe, reveals and the three-step
   enquiry form (which opens the visitor's email app).
   ============================================================ */
(function () {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const CONTACT_EMAIL = 'vantariapvtltd@gmail.com';
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;

  /* ---------- House content (used by the carousel pop-up) ---------- */
  const HOUSES = [
    {
      name: 'Confectionery', code: 'NIC 10732 · 47219', img: 'images/house-confectionery.jpg', inquiry: 'domestic', cta: 'Enquire about distribution',
      text: [
        'Large-scale manufacturing, roasting, blending, moulding and packaging of chocolates, cocoa products, pralines, truffles and bakery items, with precision-engineered processes.',
        'Our products reach customers through domestic wholesale and retail distribution, across digital marketplaces and physical supermarket channels.'
      ],
      facts: [['Classification', 'NIC 10732 · 47219'], ['Categories', 'Chocolate · Cocoa · Pralines & truffles · Bakery'], ['Channels', 'Wholesale · Retail · Marketplaces · Supermarkets']]
    },
    {
      name: 'Personal Care', code: 'NIC 46491', img: 'images/house-personal-care.jpg', inquiry: 'franchise', cta: 'Enquire about brands & private label',
      text: [
        'Formulation, processing and bulk supply of premium perfumery, fragrances, deodorants, skincare, haircare and professional grooming items, meeting global standards.',
        'We offer turnkey brand development, repackaging and regulatory-compliant trade across domestic and international markets.'
      ],
      facts: [['Classification', 'NIC 46491'], ['Categories', 'Fragrance · Deodorants · Skincare · Haircare · Grooming'], ['Services', 'Brand development · Repackaging · Bulk supply']]
    },
    {
      name: 'Global Trade', code: 'Import · Export', img: 'images/house-trade.jpg', inquiry: 'export', cta: 'Enquire about trade',
      text: [
        'Our import-export framework sources high-grade raw ingredients, packaging materials and finished goods internationally through strategic partnerships.',
        'We operate cross-border distributorships, agency networks and joint ventures across key international trade corridors.'
      ],
      facts: [['Scope', 'Raw ingredients · Packaging · Finished goods'], ['Structures', 'Distributorships · Agency networks · Joint ventures'], ['Reach', '10+ trade corridors from New Delhi']]
    },
    {
      name: 'Digital Commerce', code: 'Omnichannel', img: 'images/house-digital.jpg', inquiry: 'domestic', cta: 'Enquire about retail partnerships',
      text: [
        'E-commerce platforms, digital marketplaces and omnichannel retail that put every Vantaria product within reach of customers.',
        'Digital channels work alongside our wholesale and supermarket distribution, so each house reaches customers wherever they buy.'
      ],
      facts: [['Channels', 'E-commerce · Marketplaces · Omnichannel retail'], ['Serves', 'Confectionery · Personal Care']]
    }
  ];
  const TYPE_LABEL = {
    domestic: 'Domestic distribution', export: 'Import & export trade', jv: 'Joint venture',
    franchise: 'Franchise & private label', supply: 'Supply & sourcing', other: 'General enquiry'
  };

  /* ---------- Opening cover ---------- */
  const cover = $('#cover');
  if (cover) {
    if (root.classList.contains('seen')) cover.remove();
    else {
      const skip = () => { if (!cover.classList.contains('skip')) { cover.classList.add('skip'); root.classList.add('seen'); } };
      cover.addEventListener('click', skip);
      window.addEventListener('keydown', skip, { once: true });
      cover.addEventListener('animationend', e => { if (e.animationName === 'coverOut') cover.remove(); });
    }
  }

  /* ---------- Header, progress bar, section spy ---------- */
  const header = $('#siteHeader');
  const progress = $('#progress');
  let scrollTick = false;
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 24);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? clamp(y / max, 0, 1) : 0})`;
    scrollTick = false;
  };
  window.addEventListener('scroll', () => { if (!scrollTick) { scrollTick = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  const SPY = { group: '[aria-controls="mm-group"]', houses: '[aria-controls="mm-houses"]', platform: '[aria-controls="mm-platform"]', reach: '.nav-link[href="#reach"]', corporate: '.nav-link[href="#corporate"]', enquiries: '.nav-cta' };
  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        $$('.nav-btn, .nav-link, .nav-cta').forEach(el => el.classList.remove('active'));
        const el = SPY[en.target.id] ? $(SPY[en.target.id]) : null; if (el) el.classList.add('active');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(SPY).concat('top').forEach(id => { const s = document.getElementById(id); if (s) spy.observe(s); });
  }

  /* ---------- Mega menus ---------- */
  const navBtns = $$('.nav-btn');
  const panel = b => document.getElementById(b.getAttribute('aria-controls'));
  let megaTimer;
  function openMega(btn) {
    navBtns.forEach(b => { const on = b === btn; b.setAttribute('aria-expanded', String(on)); panel(b).hidden = !on; });
    header.classList.add('mega-open');
  }
  function closeMega() {
    navBtns.forEach(b => { b.setAttribute('aria-expanded', 'false'); panel(b).hidden = true; });
    header.classList.remove('mega-open');
  }
  navBtns.forEach(btn => {
    btn.addEventListener('click', () => (btn.getAttribute('aria-expanded') === 'true' ? closeMega() : openMega(btn)));
    if (finePointer) btn.addEventListener('mouseenter', () => { clearTimeout(megaTimer); megaTimer = setTimeout(() => openMega(btn), 110); });
  });
  if (finePointer) {
    $$('.nav-link, .brand, .header-actions').forEach(el => el.addEventListener('mouseenter', () => { clearTimeout(megaTimer); megaTimer = setTimeout(closeMega, 140); }));
    header.addEventListener('mouseleave', () => { clearTimeout(megaTimer); megaTimer = setTimeout(closeMega, 260); });
    header.addEventListener('mouseenter', () => clearTimeout(megaTimer));
  }
  $$('.mega a').forEach(a => a.addEventListener('click', closeMega));
  document.addEventListener('click', e => { if (!e.target.closest('.site-header')) closeMega(); });

  // Houses menu: preview follows the hovered house
  const megaPreview = $('#megaPreview');
  $$('#megaHouses a').forEach((a, i) => {
    if (i === 0) a.classList.add('is-active');
    const show = () => {
      $$('#megaHouses a').forEach(x => x.classList.toggle('is-active', x === a));
      if (megaPreview.getAttribute('src') === a.dataset.preview) return;
      megaPreview.classList.add('swap');
      setTimeout(() => { megaPreview.src = a.dataset.preview; megaPreview.onload = () => megaPreview.classList.remove('swap'); if (megaPreview.complete) megaPreview.classList.remove('swap'); }, 180);
    };
    a.addEventListener('mouseenter', show);
    a.addEventListener('focus', show);
  });

  /* ---------- Full-screen menu (tablet & phone) ---------- */
  const menuBtn = $('#menuBtn');
  const overlay = $('#menuOverlay');
  function setMenu(open) {
    overlay.hidden = !open;
    menuBtn.setAttribute('aria-expanded', String(open));
    $('.menu-label', menuBtn).textContent = open ? 'Close' : 'Menu';
    header.classList.toggle('menu-open', open);
    root.style.overflow = open ? 'hidden' : '';
    if (open) { const first = $('a', overlay); if (first) first.focus({ preventScroll: true }); }
  }
  menuBtn.addEventListener('click', () => setMenu(overlay.hidden));
  overlay.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
  window.addEventListener('resize', () => { if (window.innerWidth > 1180 && !overlay.hidden) setMenu(false); });

  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    const openBtn = navBtns.find(b => b.getAttribute('aria-expanded') === 'true');
    if (openBtn) { closeMega(); openBtn.focus(); }
    if (!overlay.hidden) { setMenu(false); menuBtn.focus(); }
  });

  /* ---------- Hero: rotating phrase ---------- */
  const WORDS = ['fine confectionery', 'premium personal care', 'global trade', 'digital commerce'];
  const rot = $('#rotWord');
  if (rot) {
    let wi = 0;
    if (reduceMotion) {
      setInterval(() => { wi = (wi + 1) % WORDS.length; rot.textContent = WORDS[wi]; }, 3800);
    } else {
      let j = WORDS[0].length, deleting = false;
      const tick = () => {
        const w = WORDS[wi];
        if (!deleting) {
          if (j < w.length) { j++; rot.textContent = w.slice(0, j); setTimeout(tick, 65); }
          else { deleting = true; setTimeout(tick, 2300); }
        } else if (j > 0) { j--; rot.textContent = w.slice(0, j) || '​'; setTimeout(tick, 28); }
        else { deleting = false; wi = (wi + 1) % WORDS.length; setTimeout(tick, 260); }
      };
      setTimeout(tick, 4200);
    }
  }

  /* ---------- Animated canvases: shared helpers ---------- */
  function fitCanvas(cv, maxDpr) {
    const r = cv.getBoundingClientRect();
    const dpr = Math.min(maxDpr, window.devicePixelRatio || 1);
    const w = Math.max(1, Math.round(r.width)), h = Math.max(1, Math.round(r.height));
    if (cv.width !== Math.round(w * dpr) || cv.height !== Math.round(h * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); }
    const ctx = cv.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx, w, h };
  }
  function animate(cv, draw, fps) {
    let visible = true, raf = 0, last = 0;
    const gap = 1000 / fps;
    const loop = now => { raf = requestAnimationFrame(loop); if (now - last < gap) return; last = now; draw(now / 1000); };
    const start = () => { if (!raf && visible && !document.hidden) raf = requestAnimationFrame(loop); };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };
    if (reduceMotion) { draw(12); window.addEventListener('resize', () => draw(12)); return { redraw: () => draw(12) }; }
    if ('IntersectionObserver' in window) new IntersectionObserver(en => { visible = en[0].isIntersecting; visible ? start() : stop(); }).observe(cv);
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
    draw(0); start();
    return { redraw: () => draw(performance.now() / 1000) };
  }

  /* ---------- Hero: gold silk that follows the mouse ---------- */
  const silk = $('#silk');
  if (silk) {
    const hero = $('.hero');
    const ptr = { x: 0, y: 0, tx: 0, ty: 0, s: 0, ts: 0 };
    if (finePointer) {
      hero.addEventListener('pointermove', e => { const r = hero.getBoundingClientRect(); ptr.tx = e.clientX - r.left; ptr.ty = e.clientY - r.top; ptr.ts = 1; if (!ptr.s) { ptr.x = ptr.tx; ptr.y = ptr.ty; } });
      hero.addEventListener('pointerleave', () => { ptr.ts = 0; });
    }
    const LINES = 46;
    animate(silk, t => {
      const { ctx, w, h } = fitCanvas(silk, 1.5);
      ptr.x = lerp(ptr.x, ptr.tx, .08); ptr.y = lerp(ptr.y, ptr.ty, .08); ptr.s = lerp(ptr.s, ptr.ts, .05);
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      ctx.lineWidth = .8;
      const tall = h > w;
      const baseY = h * (tall ? .24 : .5), amp = h * (tall ? .08 : .15), sig = w * .11;
      for (let i = 0; i < LINES; i++) {
        const k = i / (LINES - 1), centre = 1 - Math.abs(k - .5) * 2;
        ctx.strokeStyle = `rgba(214, 190, 136, ${.04 + centre * .2})`;
        ctx.beginPath();
        for (let x = -40; x <= w + 40; x += 10) {
          const u = x / w;
          const twist = .55 + .45 * Math.sin(u * 3.2 + t * .12);
          let y = baseY + Math.sin(u * 4.1 + t * .18 + .6) * amp + Math.sin(u * 9.3 - t * .11) * amp * .22
            + (k - .5) * h * .34 * twist + Math.sin(u * 2 + k * 3 + t * .07) * h * .03;
          if (ptr.s > .01) { const dx = x - ptr.x; y += (ptr.y - y) * .26 * Math.exp(-(dx * dx) / (2 * sig * sig)) * ptr.s; }
          if (x === -40) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.globalCompositeOperation = 'source-over';
    }, 40);
  }

  /* ---------- Group statement lights up as you scroll ---------- */
  const lit = $('[data-lit]');
  if (lit && !reduceMotion) {
    const words = lit.textContent.trim().split(/\s+/);
    lit.innerHTML = words.map(w => `<span class="w">${w}</span>`).join(' ');
    const spans = $$('.w', lit);
    let shown = -1;
    const update = () => {
      const r = lit.getBoundingClientRect(), vh = window.innerHeight;
      const p = clamp((vh * .88 - r.top) / (r.height + vh * .38), 0, 1);
      const n = Math.round(p * spans.length * 1.08);
      if (n !== shown) { shown = n; spans.forEach((s, i) => s.classList.toggle('lit', i < n)); }
    };
    window.addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ---------- Houses carousel ---------- */
  const track = $('#storyTrack');
  const bar = $('#trackBar');
  const cards = $$('.story', track);
  const cardStep = () => cards[0].getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 16);
  const syncTrack = () => {
    const max = track.scrollWidth - track.clientWidth;
    const frac = track.clientWidth / track.scrollWidth;
    const barBox = bar.parentElement.clientWidth;
    bar.style.width = (frac * 100) + '%';
    bar.style.transform = `translateX(${max > 0 ? (track.scrollLeft / max) * (barBox * (1 - frac)) : 0}px)`;
    $('#storyPrev').disabled = track.scrollLeft < 4;
    $('#storyNext').disabled = track.scrollLeft > max - 4;
  };
  track.addEventListener('scroll', () => requestAnimationFrame(syncTrack), { passive: true });
  window.addEventListener('resize', syncTrack);
  syncTrack();
  $('#storyPrev').addEventListener('click', () => track.scrollBy({ left: -cardStep(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  $('#storyNext').addEventListener('click', () => track.scrollBy({ left: cardStep(), behavior: reduceMotion ? 'auto' : 'smooth' }));

  // Mouse drag with momentum (touch uses native swipe)
  let drag = null, moved = false;
  track.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    drag = { x: e.clientX, left: track.scrollLeft, lastX: e.clientX, lastT: performance.now(), v: 0 };
    moved = false;
  });
  window.addEventListener('pointermove', e => {
    if (!drag) return;
    const dx = e.clientX - drag.x;
    if (!moved && Math.abs(dx) > 6) { moved = true; track.classList.add('dragging'); }
    if (!moved) return;
    track.scrollLeft = drag.left - dx;
    const now = performance.now();
    drag.v = (e.clientX - drag.lastX) / Math.max(1, now - drag.lastT);
    drag.lastX = e.clientX; drag.lastT = now;
  });
  window.addEventListener('pointerup', () => {
    if (!drag) return;
    const wasMoved = moved; let v = drag.v * 16; drag = null;
    if (!wasMoved) return;
    const glide = () => {
      if (Math.abs(v) < .5 || reduceMotion) { track.classList.remove('dragging'); return; }
      track.scrollLeft -= v; v *= .93; requestAnimationFrame(glide);
    };
    requestAnimationFrame(glide);
    setTimeout(() => { moved = false; }, 0);
  });
  track.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);

  /* ---------- House story pop-up ---------- */
  const dlg = $('#storyDlg');
  let current = 0, lastFocus = null;
  function fillStory(i, animateSwap) {
    current = (i + HOUSES.length) % HOUSES.length;
    const h = HOUSES[current];
    const img = $('#sdImg');
    const apply = () => {
      img.src = h.img; img.alt = h.name;
      $('#sdCode').textContent = h.code;
      const parts = h.name.split(' ');
      $('#sdTitle').innerHTML = parts.length > 1 ? `${parts[0]} <em>${parts.slice(1).join(' ')}</em>` : `<em>${h.name}</em>`;
      $('#sdText').innerHTML = h.text.map(p => `<p>${p}</p>`).join('');
      $('#sdFacts').innerHTML = h.facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('');
      const cta = $('#sdCta'); cta.textContent = h.cta; cta.dataset.inquiry = h.inquiry;
      $('#sdPrevName').textContent = HOUSES[(current + HOUSES.length - 1) % HOUSES.length].name;
      $('#sdNextName').textContent = HOUSES[(current + 1) % HOUSES.length].name;
      $('#sdCount').textContent = `${current + 1} / ${HOUSES.length}`;
      img.classList.remove('swap');
      const body = $('.sd-body');
      body.classList.remove('sd-swap'); void body.offsetWidth; body.classList.add('sd-swap');
      body.scrollTop = 0;
    };
    if (animateSwap && !reduceMotion) { img.classList.add('swap'); setTimeout(apply, 260); } else apply();
  }
  function openStory(i) {
    lastFocus = document.activeElement;
    fillStory(i, false);
    if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
    root.style.overflow = 'hidden';
    $('#sdClose').focus({ preventScroll: true });
  }
  dlg.addEventListener('close', () => { root.style.overflow = ''; if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true }); });
  $('#sdClose').addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
  $('#sdPrev').addEventListener('click', () => fillStory(current - 1, true));
  $('#sdNext').addEventListener('click', () => fillStory(current + 1, true));
  dlg.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') fillStory(current + 1, true);
    if (e.key === 'ArrowLeft') fillStory(current - 1, true);
  });
  $('#sdCta').addEventListener('click', () => dlg.close());
  cards.forEach(c => c.addEventListener('click', () => openStory(+c.dataset.story)));
  document.addEventListener('click', e => {
    const a = e.target.closest('a[data-story]');
    if (!a) return;
    e.preventDefault();
    closeMega(); if (!overlay.hidden) setMenu(false);
    openStory(+a.dataset.story);
  });

  /* ---------- Quote band parallax ---------- */
  const band = $('.band'), bandImg = $('.band-img');
  if (band && bandImg && !reduceMotion) {
    const upd = () => {
      const r = band.getBoundingClientRect(), vh = window.innerHeight;
      if (r.bottom > 0 && r.top < vh) bandImg.style.transform = `translate3d(0, ${(-((r.top + r.height / 2 - vh / 2) / (vh + r.height)) * 8).toFixed(2)}%, 0)`;
    };
    window.addEventListener('scroll', () => requestAnimationFrame(upd), { passive: true });
    upd();
  }

  /* ---------- Platform tiles: spotlight + stagger ---------- */
  $$('.mosaic .tile').forEach((t, i) => {
    t.style.setProperty('--d', i % 3);
    if (finePointer) t.addEventListener('pointermove', e => {
      const r = t.getBoundingClientRect();
      t.style.setProperty('--mx', `${e.clientX - r.left}px`);
      t.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });

  /* ---------- Counters ---------- */
  const counters = $$('[data-count]');
  if (counters.length && 'IntersectionObserver' in window && !reduceMotion) {
    counters.forEach(c => { c.textContent = '0'; });
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        const el = en.target, end = +el.dataset.count, t0 = performance.now(), dur = 1600;
        const step = now => {
          const p = clamp((now - t0) / dur, 0, 1), e = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(end * e);
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    }, { threshold: .6 });
    counters.forEach(c => io.observe(c));
  }

  /* ---------- Global reach: draggable globe with region labels ---------- */
  const globe = $('#globe');
  if (globe) {
    const fig = globe.parentElement, tip = $('#globeTip');
    const rad = d => d * Math.PI / 180;
    const vec = (lat, lon) => [Math.cos(rad(lat)) * Math.sin(rad(lon)), Math.sin(rad(lat)), Math.cos(rad(lat)) * Math.cos(rad(lon))];
    const N = 1100, pts = [], golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) { const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = golden * i; pts.push([Math.cos(th) * r, y, Math.sin(th) * r]); }
    const HQ = vec(28.61, 77.21);
    const DEST = [
      ['Europe', 48.8, 9.0], ['Middle East', 25.2, 55.3], ['East Africa', -1.3, 36.8], ['Southeast Asia', 1.35, 103.8],
      ['Australia', -33.9, 151.2], ['Americas', 40.7, -74.0], ['East Asia', 35.7, 139.7]
    ].map(([n, a, b]) => ({ name: n, v: vec(a, b) }));
    const slerp = (a, b, t) => {
      const dot = clamp(a[0] * b[0] + a[1] * b[1] + a[2] * b[2], -1, 1), om = Math.acos(dot), s = Math.sin(om) || 1;
      const ka = Math.sin((1 - t) * om) / s, kb = Math.sin(t * om) / s, lift = 1 + Math.sin(Math.PI * t) * .22 * (om / Math.PI + .25);
      return [(a[0] * ka + b[0] * kb) * lift, (a[1] * ka + b[1] * kb) * lift, (a[2] * ka + b[2] * kb) * lift];
    };
    const ARCS = DEST.map(d => Array.from({ length: 61 }, (_, i) => slerp(HQ, d.v, i / 60)));
    const st = { lon: 0, tilt: 0, vLon: 0, dragging: false, lastX: 0, lastY: 0, idle: 0, hover: -1 };
    let marks = [];

    globe.addEventListener('pointerdown', e => {
      st.dragging = true; st.lastX = e.clientX; st.lastY = e.clientY; st.vLon = 0;
      globe.setPointerCapture(e.pointerId); globe.classList.add('grabbing'); tip.hidden = true;
    });
    globe.addEventListener('pointermove', e => {
      if (st.dragging) {
        const dx = e.clientX - st.lastX, dy = e.clientY - st.lastY;
        st.lon -= dx * .35; st.tilt = clamp(st.tilt + dy * .004, -.5, .7); st.vLon = -dx * .35;
        st.lastX = e.clientX; st.lastY = e.clientY; st.idle = performance.now();
        return;
      }
      const r = globe.getBoundingClientRect(), fr = fig.getBoundingClientRect();
      const mx = e.clientX - r.left, my = e.clientY - r.top;
      let best = -1, bd = 22;
      marks.forEach((m, i) => { if (m.z > 0) { const d = Math.hypot(m.x - mx, m.y - my); if (d < bd) { bd = d; best = i; } } });
      st.hover = best;
      if (best >= 0 && marks[best]) {
        tip.textContent = marks[best].name; tip.hidden = false;
        tip.style.left = (r.left - fr.left + marks[best].x) + 'px'; tip.style.top = (r.top - fr.top + marks[best].y) + 'px';
      } else tip.hidden = true;
    });
    const endDrag = () => { if (!st.dragging) return; st.dragging = false; globe.classList.remove('grabbing'); st.idle = performance.now(); };
    globe.addEventListener('pointerup', endDrag);
    globe.addEventListener('pointercancel', endDrag);
    globe.addEventListener('pointerleave', () => { tip.hidden = true; st.hover = -1; });

    let lastT = 0;
    animate(globe, t => {
      const { ctx, w, h } = fitCanvas(globe, 2);
      const dt = lastT ? Math.min(.1, t - lastT) : 0; lastT = t;
      if (!st.dragging) {
        st.lon += st.vLon; st.vLon *= .9;
        if (performance.now() - st.idle > 1800) { st.lon *= .985; st.tilt *= .985; }
      }
      ctx.clearRect(0, 0, w, h);
      const R = Math.min(w, h) * .4, cx = w / 2, cy = h / 2;
      const lon0 = rad(77.2 + Math.sin(t * .12) * 55 + st.lon), tiltA = .32 + st.tilt;
      const cl = Math.cos(lon0), sl = Math.sin(lon0), ct = Math.cos(tiltA), stl = Math.sin(tiltA);
      const proj = v => { const x1 = v[0] * cl - v[2] * sl, z1 = v[0] * sl + v[2] * cl, y2 = v[1] * ct - z1 * stl, z2 = v[1] * stl + z1 * ct; return [cx + x1 * R, cy - y2 * R, z2]; };

      const g = ctx.createRadialGradient(cx - R * .3, cy - R * .35, R * .1, cx, cy, R * 1.05);
      g.addColorStop(0, 'rgba(26, 64, 52, 0.55)'); g.addColorStop(1, 'rgba(11, 11, 12, 0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(201, 178, 124, 0.28)'; ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = 'rgba(201, 178, 124, 0.10)'; ctx.beginPath(); ctx.arc(cx, cy, R * 1.12, 0, Math.PI * 2); ctx.stroke();

      for (const p of pts) {
        const [x, y, z] = proj(p);
        if (z <= 0) continue;
        ctx.fillStyle = `rgba(236, 230, 216, ${.08 + z * .42})`;
        ctx.fillRect(x - .7, y - .7, 1.4 + z * .6, 1.4 + z * .6);
      }

      const newMarks = [];
      ARCS.forEach((arc, ai) => {
        const hot = st.hover === ai;
        ctx.lineWidth = hot ? 2 : 1.2;
        ctx.strokeStyle = hot ? 'rgba(230, 214, 174, 0.95)' : 'rgba(201, 178, 124, 0.55)';
        ctx.beginPath();
        let pen = false;
        for (const v of arc) { const [x, y, z] = proj(v); if (z > -.05) { if (pen) ctx.lineTo(x, y); else { ctx.moveTo(x, y); pen = true; } } else pen = false; }
        ctx.stroke();
        const s = (t * .22 + ai * .17) % 1;
        const [sx, sy, sz] = proj(arc[Math.floor(s * (arc.length - 1))]);
        if (sz > 0) { ctx.fillStyle = 'rgba(230, 214, 174, 0.95)'; ctx.shadowColor = 'rgba(230, 214, 174, 0.9)'; ctx.shadowBlur = 10; ctx.beginPath(); ctx.arc(sx, sy, 2.2, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0; }
        const [ex, ey, ez] = proj(arc[arc.length - 1]);
        newMarks[ai] = { x: ex, y: ey, z: ez, name: DEST[ai].name };
        if (ez > 0) { ctx.fillStyle = hot ? '#e6d6ae' : 'rgba(201, 178, 124, 0.85)'; ctx.beginPath(); ctx.arc(ex, ey, hot ? 4 : 2.6, 0, Math.PI * 2); ctx.fill(); }
      });
      const [hx, hy, hz] = proj(HQ);
      newMarks.push({ x: hx, y: hy, z: hz, name: 'New Delhi · Headquarters' });
      if (hz > 0) {
        const pulse = (t * .6) % 1;
        ctx.lineWidth = 1; ctx.strokeStyle = `rgba(201, 178, 124, ${.7 * (1 - pulse)})`;
        ctx.beginPath(); ctx.arc(hx, hy, 4 + pulse * 18, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = '#e6d6ae'; ctx.beginPath(); ctx.arc(hx, hy, 4, 0, Math.PI * 2); ctx.fill();
      }
      marks = newMarks;
      if (!tip.hidden && st.hover >= 0 && marks[st.hover]) {
        const m = marks[st.hover], r = globe.getBoundingClientRect(), fr = fig.getBoundingClientRect();
        if (m.z <= 0) tip.hidden = true; else { tip.style.left = (r.left - fr.left + m.x) + 'px'; tip.style.top = (r.top - fr.top + m.y) + 'px'; }
      }
    }, 40);
  }

  /* ---------- Scroll reveals ---------- */
  const reveals = $$('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        const el = en.target; io.unobserve(el); el.classList.add('in');
        setTimeout(() => el.classList.remove('reveal', 'in'), 1600);   // hand control back to hover effects
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .05 });
    reveals.forEach(el => io.observe(el));
  } else reveals.forEach(el => el.classList.remove('reveal'));

  /* ---------- Custom cursor + magnetic buttons (mouse only) ---------- */
  if (finePointer && !reduceMotion) {
    const ring = $('#cursor'), dot = $('#cursorDot'), label = $('#cursorLabel');
    const pos = { x: -100, y: -100, rx: -100, ry: -100 };
    root.classList.add('has-cursor');
    window.addEventListener('pointermove', e => { if (e.pointerType !== 'mouse') return; pos.x = e.clientX; pos.y = e.clientY; }, { passive: true });
    document.addEventListener('pointerleave', () => { ring.classList.add('is-hidden'); dot.classList.add('is-hidden'); });
    document.addEventListener('pointerenter', () => { ring.classList.remove('is-hidden'); dot.classList.remove('is-hidden'); });
    const loop = () => {
      pos.rx = lerp(pos.rx, pos.x, .2); pos.ry = lerp(pos.ry, pos.y, .2);
      ring.style.transform = `translate3d(${pos.rx}px, ${pos.ry}px, 0)`;
      dot.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
    document.addEventListener('pointerover', e => {
      const t = e.target;
      const zone = t.closest('[data-cursor]');
      const mode = zone ? zone.dataset.cursor : '';
      const field = t.closest('input, textarea, select');
      ring.classList.toggle('is-view', mode === 'view');
      ring.classList.toggle('is-drag', mode === 'drag');
      ring.classList.toggle('is-link', !mode && !!t.closest('a, button, label'));
      ring.classList.toggle('is-hidden', !!field); dot.classList.toggle('is-hidden', !!field);
      label.textContent = mode === 'view' ? 'Open' : mode === 'drag' ? 'Drag' : '';
    });
    $$('[data-magnetic]').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${dx * .22}px, ${dy * .32}px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }

  /* ---------- Three-step enquiry ---------- */
  const form = $('#enquiryForm'), done = $('#formDone'), wrap = $('.enq-form-wrap');
  const steps = $$('.step', form), dots = $$('[data-step-dot]'), stepsBar = $('#stepsBar');
  let step = 1;
  function showStep(n, focus) {
    step = n;
    steps.forEach(s => { s.hidden = +s.dataset.step !== n; });
    dots.forEach(d => { const k = +d.dataset.stepDot; d.classList.toggle('is-current', k === n); d.classList.toggle('is-done', k < n); });
    stepsBar.style.width = (n / 3 * 100) + '%';
    if (n === 3) buildSummary();
    if (focus) {
      const target = $(`.step[data-step="${n}"] input:not([type=radio]), .step[data-step="${n}"] textarea, .step[data-step="${n}"] input:checked`, form) || $(`.step[data-step="${n}"] input`, form);
      if (target) target.focus({ preventScroll: true });
      const r = wrap.getBoundingClientRect();
      if (r.top < 70 || r.top > window.innerHeight * .6) wrap.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    }
  }
  function setErr(field, msg) {
    const id = field.id + 'Err'; let p = document.getElementById(id);
    if (msg) {
      if (!p) { p = document.createElement('p'); p.className = 'err'; p.id = id; field.parentNode.appendChild(p); }
      p.textContent = msg; field.setAttribute('aria-invalid', 'true'); field.setAttribute('aria-describedby', id);
    } else { if (p) p.remove(); field.removeAttribute('aria-invalid'); field.removeAttribute('aria-describedby'); }
  }
  const MSG = { fullName: 'Please enter your full name.', email: 'Please enter your email address.', message: 'Please add a short message.' };
  function check(f) {
    const v = f.value.trim(); let msg = '';
    if (f.required && !v) msg = MSG[f.id] || 'This field is required.';
    else if (f.type === 'email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) msg = 'Please enter an email address like name@company.com.';
    setErr(f, msg); return !msg;
  }
  const chosenType = () => { const r = $('input[name="inquiryType"]:checked', form); return r ? r.value : ''; };
  function buildSummary() {
    const rows = [['Enquiry', TYPE_LABEL[chosenType()] || '—'], ['Name', $('#fullName').value.trim() || '—'], ['Company', $('#companyName').value.trim() || '—'], ['Email', $('#email').value.trim() || '—'], ['Telephone', $('#phone').value.trim() || '—']];
    $('#summary').innerHTML = rows.map(([k, v]) => `<div><dt>${k}</dt><dd></dd></div>`).join('');
    $$('#summary dd').forEach((dd, i) => { dd.textContent = rows[i][1]; });
  }
  $$('[data-next]', form).forEach(b => b.addEventListener('click', () => {
    if (step === 1) {
      const ok = !!chosenType(); $('#typeErr').hidden = ok;
      if (!ok) { const first = $('input[name="inquiryType"]', form); if (first) first.focus(); return; }
      showStep(2, true);
    } else if (step === 2) {
      const bad = ['fullName', 'email'].map(id => $('#' + id)).filter(f => !check(f));
      if (bad.length) { bad[0].focus(); return; }
      showStep(3, true);
    }
  }));
  $$('[data-back]', form).forEach(b => b.addEventListener('click', () => showStep(step - 1, true)));
  $$('input[name="inquiryType"]', form).forEach(r => r.addEventListener('change', () => { $('#typeErr').hidden = true; }));
  $$('#fullName, #email, #message').forEach(f => f.addEventListener('blur', () => { if (f.getAttribute('aria-invalid') || f.value) check(f); }));
  form.addEventListener('keydown', e => {
    if (e.key === 'Enter' && e.target.tagName === 'INPUT' && step < 3) { e.preventDefault(); const nx = $(`.step[data-step="${step}"] [data-next]`, form); if (nx) nx.click(); }
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (step !== 3) return;
    if (!check($('#message'))) { $('#message').focus(); return; }
    const val = id => $('#' + id).value.trim();
    const typeLabel = TYPE_LABEL[chosenType()] || 'General enquiry';
    const subject = `Enquiry: ${typeLabel} — ${val('fullName')}`;
    const body = [`Name: ${val('fullName')}`, `Company: ${val('companyName') || '—'}`, `Email: ${val('email')}`, `Telephone: ${val('phone') || '—'}`, `Nature of enquiry: ${typeLabel}`, '', val('message')].join('\n');
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    form.hidden = true; $('.steps', wrap).hidden = true; $('.steps-bar', wrap).hidden = true;
    done.hidden = false; done.focus();
  });
  $('#formReset').addEventListener('click', () => {
    form.reset(); done.hidden = true; form.hidden = false; $('.steps', wrap).hidden = false; $('.steps-bar', wrap).hidden = false;
    showStep(1, true);
  });
  $('#copyEmail').addEventListener('click', async e => {
    const btn = e.currentTarget;
    try { await navigator.clipboard.writeText(CONTACT_EMAIL); btn.textContent = 'Email address copied'; }
    catch (err) { btn.textContent = CONTACT_EMAIL; }
  });
  // Links that pre-select the enquiry type
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-inquiry]');
    if (!a || form.hidden) return;
    const r = $(`input[name="inquiryType"][value="${a.dataset.inquiry}"]`, form);
    if (r) { r.checked = true; $('#typeErr').hidden = true; if (step !== 1) showStep(1, false); }
  });
  showStep(1, false);
})();
