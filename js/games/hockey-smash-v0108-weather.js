(function () {
  const DESIGN_WIDTH = 1024;
  const DESIGN_HEIGHT = 576;
  const WEATHER_TYPES = ['clear', 'rain', 'snow'];
  const MAX_PARTICLES = 130;

  let api = null;
  let canvas = null;
  let layer = null;
  let parallax = [];
  let weather = 'clear';
  let particles = [];
  let lastFrame = performance.now();

  function onReady() {
    api = window.RTA_HOCKEY_SMASH;
    canvas = document.getElementById('hockey-canvas');
    if (!api || !canvas) return;
    ensureLayer();
    window.requestAnimationFrame(loop);
  }

  function ensureLayer() {
    layer = document.getElementById('hockey-weather-layer');
    if (!layer) {
      layer = document.createElement('div');
      layer.id = 'hockey-weather-layer';
      layer.setAttribute('aria-hidden', 'true');
      document.body.appendChild(layer);
    }
    Object.assign(layer.style, {
      position: 'fixed',
      left: '0',
      top: '0',
      width: '0',
      height: '0',
      zIndex: '7',
      pointerEvents: 'none',
      overflow: 'hidden',
    });
    if (!parallax.length) {
      ['near', 'mid', 'far'].forEach((depth) => {
        const band = document.createElement('span');
        band.dataset.parallaxDepth = depth;
        Object.assign(band.style, {
          position: 'absolute',
          left: '-12%',
          right: '-12%',
          height: depth === 'near' ? '18px' : '12px',
          bottom: depth === 'near' ? '18%' : depth === 'mid' ? '31%' : '46%',
          borderRadius: '999px',
          background: depth === 'near'
            ? 'rgba(255,255,255,.18)'
            : depth === 'mid'
              ? 'rgba(125,211,252,.14)'
              : 'rgba(15,23,42,.1)',
          filter: 'blur(1px)',
          opacity: depth === 'far' ? '0.45' : '0.62',
          transform: 'translateX(0)',
        });
        layer.appendChild(band);
        parallax.push(band);
      });
    }
  }

  function loop(now) {
    const dt = Math.min(0.05, Math.max(0.008, (now - lastFrame) / 1000 || 0.016));
    lastFrame = now;
    const state = api?.getState?.();
    if (state?.mode === 'playing' || state?.mode === 'bossIntro' || state?.mode === 'bossFight') {
      updateWeather(state);
      updateParticles(dt);
      syncLayer();
      syncParallax(state);
      renderParticles();
    } else {
      clearParticles();
    }
    window.requestAnimationFrame(loop);
  }

  function syncParallax(state) {
    const distance = Number(state?.distance || state?.time || 0);
    parallax.forEach((band, index) => {
      const speed = [42, 24, 12][index] || 16;
      const offset = -((distance * speed) % 140);
      band.style.transform = `translateX(${offset}px)`;
    });
  }

  function setWeather(type) {
    weather = WEATHER_TYPES.includes(type) ? type : 'clear';
  }

  function updateWeather(state) {
    if (Math.random() >= 0.0008) return;
    weather = Math.random() > 0.5 ? 'rain' : 'snow';
    state.weather = weather;
    state.message = weather === 'rain' ? 'Rain started!' : 'Snow started!';
    const status = document.getElementById('hockey-status');
    if (status) status.textContent = state.message;
  }

  function updateParticles(dt) {
    if (weather === 'rain' && Math.random() < 0.6) {
      particles.push({ x: Math.random() * DESIGN_WIDTH, y: -20, vx: -120, vy: 620, life: 1.2, kind: 'rain', node: null });
    } else if (weather === 'snow' && Math.random() < 0.34) {
      particles.push({ x: Math.random() * DESIGN_WIDTH, y: -18, vx: -20 + Math.random() * 40, vy: 95 + Math.random() * 70, life: 5.2, kind: 'snow', phase: Math.random() * Math.PI * 2, node: null });
    }

    particles.forEach((particle) => {
      particle.life -= dt;
      particle.phase = (particle.phase || 0) + dt * 3;
      particle.x += ((particle.vx || 0) + Math.sin(particle.phase || 0) * (particle.kind === 'snow' ? 28 : 0)) * dt;
      particle.y += (particle.vy || 0) * dt;
    });

    particles = particles
      .filter((particle) => {
        const alive = particle.life > 0 && particle.y < DESIGN_HEIGHT + 50;
        if (!alive) particle.node?.remove?.();
        return alive;
      })
      .slice(-MAX_PARTICLES);
  }

  function syncLayer() {
    if (!layer || !canvas) return;
    const rect = canvas.getBoundingClientRect();
    Object.assign(layer.style, {
      left: `${rect.left}px`,
      top: `${rect.top}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
    });
    layer.dataset.weather = weather;
  }

  function renderParticles() {
    if (!layer || !canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const scaleX = rect.width / DESIGN_WIDTH;
    const scaleY = rect.height / DESIGN_HEIGHT;

    particles.forEach((particle) => {
      if (!particle.node) particle.node = createParticleNode(particle.kind);
      Object.assign(particle.node.style, {
        left: `${particle.x * scaleX}px`,
        top: `${particle.y * scaleY}px`,
        opacity: String(Math.max(0, Math.min(1, particle.life))),
      });
    });
  }

  function createParticleNode(kind) {
    const node = document.createElement('span');
    node.dataset.weatherParticle = kind;
    Object.assign(node.style, {
      position: 'absolute',
      display: 'block',
      pointerEvents: 'none',
      willChange: 'transform, opacity',
    });
    if (kind === 'rain') {
      Object.assign(node.style, {
        width: '2px',
        height: '18px',
        borderRadius: '999px',
        background: 'rgba(186,230,253,.72)',
        transform: 'rotate(14deg)',
      });
    } else {
      Object.assign(node.style, {
        width: '7px',
        height: '7px',
        borderRadius: '999px',
        background: 'rgba(255,255,255,.9)',
        boxShadow: '0 0 8px rgba(255,255,255,.75)',
      });
    }
    layer.appendChild(node);
    return node;
  }

  function clearParticles() {
    particles.forEach((particle) => particle.node?.remove?.());
    particles = [];
    if (layer) layer.dataset.weather = 'clear';
  }

  window.setWeather = setWeather;
  window.RTA_HOCKEY_SMASH_WEATHER = {
    setWeather,
    getWeather: () => weather,
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', onReady);
  else onReady();
})();
