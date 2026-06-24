/* ── Zepeling — Dynamic Effects ── */

window.addEventListener('load', function () {

  /* ── 1. Scroll progress bar ── */
  (function () {
    const style = document.createElement('style');
    style.textContent = `
      #Zepeling-progress {
        position:fixed;top:0;left:0;height:3px;width:0%;z-index:99999;
        background:linear-gradient(90deg,#29b6f6,#0288d1,#67d0fa);
        background-size:200% 100%;
        animation:ZepelingShimmer 2s linear infinite;
        pointer-events:none;
        transition:width 0.1s linear;
      }
      @keyframes ZepelingShimmer{0%{background-position:0%}100%{background-position:200%}}
    `;
    document.head.appendChild(style);
    const bar = document.createElement('div');
    bar.id = 'Zepeling-progress';
    document.body.prepend(bar);
    window.addEventListener('scroll', function () {
      const d = document.documentElement;
      const pct = (d.scrollTop / (d.scrollHeight - d.clientHeight)) * 100;
      bar.style.width = Math.min(pct, 100) + '%';
    }, { passive: true });
  })();


  /* ── 2. Neural-network canvas on any hero ── */
  (function () {
    const hero = document.querySelector('.hero, .page-hero, .plan-detail-hero');
    if (!hero) return;

    /* ensure positioning */
    const cs = getComputedStyle(hero);
    if (cs.position === 'static') hero.style.position = 'relative';

    const canvas = document.createElement('canvas');
    Object.assign(canvas.style, {
      position: 'absolute', inset: '0',
      width: '100%', height: '100%',
      pointerEvents: 'none', zIndex: '0', opacity: '0.8'
    });
    hero.prepend(canvas);

    const ctx = canvas.getContext('2d');
    let W = 0, H = 0, nodes = [];
    const COUNT = 60, DIST = 160, C = '41,182,246';

    function resize() {
      W = canvas.width  = hero.offsetWidth  || window.innerWidth;
      H = canvas.height = hero.offsetHeight || 600;
    }

    function mkNode() {
      return {
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.8 + 1
      };
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      nodes.forEach(a => {
        a.x += a.vx; a.y += a.vy;
        if (a.x < 0 || a.x > W) a.vx *= -1;
        if (a.y < 0 || a.y > H) a.vy *= -1;
      });
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
          const d = Math.sqrt(dx*dx + dy*dy);
          if (d < DIST) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(${C},${(1 - d/DIST) * 0.4})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
        ctx.beginPath();
        ctx.arc(nodes[i].x, nodes[i].y, nodes[i].r, 0, Math.PI*2);
        ctx.fillStyle = `rgba(${C},0.7)`;
        ctx.fill();
      }
      requestAnimationFrame(draw);
    }

    resize();
    nodes = Array.from({ length: COUNT }, mkNode);
    draw();
    window.addEventListener('resize', resize, { passive: true });
  })();


  /* ── 3. Floating gradient orbs ── */
  (function () {
    const style = document.createElement('style');
    style.textContent = `
      .Zepeling-orb {
        position:absolute;border-radius:50%;pointer-events:none;
        background:radial-gradient(circle, rgba(41,182,246,VAR) 0%, transparent 70%);
        z-index:0;
      }
      @keyframes ZepelingOrb{0%{transform:translate(0,0) scale(1)}100%{transform:translate(28px,18px) scale(1.1)}}
    `;
    document.head.appendChild(style);

    document.querySelectorAll('.orb-section').forEach(function (section) {
      const cs = getComputedStyle(section);
      if (cs.position === 'static') section.style.position = 'relative';
      if (cs.overflow === 'visible') section.style.overflow = 'hidden';

      [
        { w:500, h:500, top:'-150px', left:'-120px', op:'0.14', dur:'11s' },
        { w:380, h:380, bottom:'-100px', right:'-80px', op:'0.10', dur:'14s' },
      ].forEach(function (cfg) {
        const orb = document.createElement('div');
        orb.className = 'Zepeling-orb';
        Object.assign(orb.style, {
          width: cfg.w + 'px', height: cfg.h + 'px',
          top: cfg.top || '', left: cfg.left || '',
          bottom: cfg.bottom || '', right: cfg.right || '',
          background: `radial-gradient(circle, rgba(41,182,246,${cfg.op}) 0%, transparent 70%)`,
          animation: `ZepelingOrb ${cfg.dur} ease-in-out infinite alternate`
        });
        section.prepend(orb);
      });
    });
  })();


  /* ── 4. 3-D tilt on cards ── */
  (function () {
    document.querySelectorAll('.tilt-card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width  - 0.5;
        const y = (e.clientY - r.top)  / r.height - 0.5;
        card.style.transform = `perspective(900px) rotateY(${x*9}deg) rotateX(${-y*9}deg) translateY(-6px)`;
        card.style.transition = 'transform 0.08s linear';
        card.style.boxShadow = '0 20px 60px rgba(41,182,246,0.2)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
        card.style.transition = 'transform 0.5s ease, box-shadow 0.5s ease';
        card.style.boxShadow = '';
      });
    });
  })();


  /* ── 5. Magnetic buttons ── */
  (function () {
    document.querySelectorAll('.btn-primary').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width/2)  * 0.3;
        const y = (e.clientY - r.top  - r.height/2) * 0.3;
        btn.style.transform = `translate(${x}px,${y}px)`;
        btn.style.transition = 'transform 0.1s linear';
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.transform = '';
        btn.style.transition = 'transform 0.45s ease';
      });
    });
  })();


  /* ── 6. Typed cycling text in hero ── */
  (function () {
    const el = document.getElementById('typed-text');
    if (!el) return;
    const phrases = [
      'decisiones más inteligentes.',
      'crecimiento sostenible.',
      'ventajas competitivas.',
      'resultados medibles.'
    ];
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
        if (ci === full.length) { deleting = true; setTimeout(tick, 2400); }
        else setTimeout(tick, 65);
      }
    }
    setTimeout(tick, 800);
  })();


  /* ── 7. Parallax on hero image ── */
  (function () {
    const img = document.querySelector('.hero-img-wrap');
    if (!img) return;
    window.addEventListener('scroll', function () {
      img.style.transform = `translateY(${window.scrollY * 0.08}px)`;
    }, { passive: true });
  })();


  /* ── 8. Animated counters ── */
  (function () {
    document.querySelectorAll('[data-count-animated]').forEach(function (el) {
      const target = parseFloat(el.dataset.countAnimated);
      const suffix = el.dataset.suffix || '';
      let started = false;
      const obs = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting && !started) {
          started = true;
          const t0 = performance.now();
          const dur = 2000;
          (function tick(now) {
            const t = Math.min((now - t0) / dur, 1);
            const ease = 1 - Math.pow(1 - t, 4);
            el.textContent = Math.round(ease * target) + suffix;
            if (t < 1) requestAnimationFrame(tick);
          })(t0);
          obs.disconnect();
        }
      }, { threshold: 0.5 });
      obs.observe(el);
    });
  })();

}); /* end window load */
