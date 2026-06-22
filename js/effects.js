/* ── OMNIA IA — Dynamic Effects ── */

/* ── 1. Scroll progress bar ── */
(function initScrollProgress() {
  const bar = document.createElement('div');
  bar.id = 'scroll-bar';
  bar.style.cssText = `
    position:fixed;top:0;left:0;height:3px;width:0%;z-index:9999;
    background:linear-gradient(90deg,#29b6f6,#0288d1,#29b6f6);
    background-size:200% 100%;
    animation:barShimmer 2s linear infinite;
    transition:width 0.1s linear;pointer-events:none;
  `;
  document.head.insertAdjacentHTML('beforeend',
    '<style>@keyframes barShimmer{0%{background-position:0%}100%{background-position:200%}}</style>');
  document.body.prepend(bar);
  window.addEventListener('scroll', () => {
    const doc = document.documentElement;
    const pct = (doc.scrollTop / (doc.scrollHeight - doc.clientHeight)) * 100;
    bar.style.width = pct + '%';
  }, { passive: true });
})();


/* ── 2. Hero neural-network canvas ── */
(function initHeroCanvas() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const canvas = document.createElement('canvas');
  canvas.id = 'hero-canvas';
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;opacity:0.55;';
  hero.prepend(canvas);

  const ctx = canvas.getContext('2d');
  let W, H, nodes, RAF;
  const COUNT = 55;
  const MAX_DIST = 160;
  const BLUE = '41,182,246';

  function resize() {
    W = canvas.width  = hero.offsetWidth;
    H = canvas.height = hero.offsetHeight;
  }

  function makeNode() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 2 + 1.2,
    };
  }

  function init() {
    resize();
    nodes = Array.from({ length: COUNT }, makeNode);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      a.x += a.vx; a.y += a.vy;
      if (a.x < 0 || a.x > W) a.vx *= -1;
      if (a.y < 0 || a.y > H) a.vy *= -1;

      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.35;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${BLUE},${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      ctx.beginPath();
      ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${BLUE},0.65)`;
      ctx.fill();
    }
    RAF = requestAnimationFrame(draw);
  }

  init();
  draw();
  window.addEventListener('resize', () => { resize(); }, { passive: true });
})();


/* ── 3. Floating gradient orbs ── */
(function initOrbs() {
  const targets = document.querySelectorAll('.orb-section');
  targets.forEach(section => {
    section.style.position = 'relative';
    section.style.overflow = 'hidden';
    [
      { w: 420, h: 420, t: '-120px', l: '-100px', op: 0.07 },
      { w: 320, h: 320, b: '-80px',  r: '-60px',  op: 0.05 },
    ].forEach(cfg => {
      const orb = document.createElement('div');
      orb.style.cssText = `
        position:absolute;border-radius:50%;pointer-events:none;
        width:${cfg.w}px;height:${cfg.h}px;
        background:radial-gradient(circle,rgba(41,182,246,${cfg.op}) 0%,transparent 70%);
        ${cfg.t ? 'top:'+cfg.t : ''}${cfg.b ? ';bottom:'+cfg.b : ''};
        ${cfg.l ? 'left:'+cfg.l : ''}${cfg.r ? ';right:'+cfg.r : ''};
        animation:orbFloat ${10 + Math.random()*6}s ease-in-out infinite alternate;
        z-index:0;
      `;
      section.prepend(orb);
    });
  });
  document.head.insertAdjacentHTML('beforeend', `
    <style>
      @keyframes orbFloat{0%{transform:translate(0,0) scale(1)}100%{transform:translate(30px,20px) scale(1.08)}}
    </style>
  `);
})();


/* ── 4. 3-D tilt on cards ── */
(function initTilt() {
  const TILT = 8;
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * TILT}deg) rotateX(${-y * TILT}deg) translateY(-6px)`;
      card.style.transition = 'transform 0.08s linear';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.45s ease';
    });
  });
})();


/* ── 5. Magnetic buttons ── */
(function initMagnetic() {
  document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width  / 2) * 0.28;
      const y = (e.clientY - r.top  - r.height / 2) * 0.28;
      btn.style.transform = `translate(${x}px,${y}px)`;
      btn.style.transition = 'transform 0.1s linear';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
      btn.style.transition = 'transform 0.4s ease';
    });
  });
})();


/* ── 6. Typed cycling subtitle in hero ── */
(function initTyped() {
  const el = document.getElementById('typed-text');
  if (!el) return;
  const phrases = ['decisiones más inteligentes.', 'crecimiento sostenible.', 'ventajas competitivas.', 'resultados medibles.'];
  let pi = 0, ci = 0, deleting = false;

  function tick() {
    const full = phrases[pi];
    if (deleting) {
      ci--;
      el.textContent = full.slice(0, ci);
      if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
      setTimeout(tick, 45);
    } else {
      ci++;
      el.textContent = full.slice(0, ci);
      if (ci === full.length) {
        deleting = true;
        setTimeout(tick, 2200);
      } else {
        setTimeout(tick, 65);
      }
    }
  }
  setTimeout(tick, 1200);
})();


/* ── 7. Parallax on hero image ── */
(function initParallax() {
  const heroImg = document.querySelector('.hero-img-wrap');
  if (!heroImg) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    heroImg.style.transform = `translateY(${y * 0.08}px)`;
  }, { passive: true });
})();


/* ── 8. Number counter with suffix ── */
(function initCounters() {
  document.querySelectorAll('[data-count-animated]').forEach(el => {
    const target = parseFloat(el.dataset.countAnimated);
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    let started = false;
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !started) {
        started = true;
        const start = performance.now();
        function tick(now) {
          const t = Math.min((now - start) / duration, 1);
          const ease = 1 - Math.pow(1 - t, 4);
          const val = target < 10 ? (ease * target).toFixed(target % 1 === 0 ? 0 : 1) : Math.round(ease * target);
          el.textContent = val + suffix;
          if (t < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        obs.disconnect();
      }
    }, { threshold: 0.5 });
    obs.observe(el);
  });
})();
