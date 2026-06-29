(function () {
  const DISPLAY_VERSION = 'Hockey Smash v0.13.6 + Earthquake';
  const DESIGN_WIDTH = 1024;
  const DESIGN_HEIGHT = 576;
  const GROUND_Y = DESIGN_HEIGHT * 0.82;
  const DEFAULT_DURATION_MS = 9000;
  const TARGET_TYPES = new Set(['bear', 'moose', 'mom', 'sister', 'teacher', 'danceInstructor']);

  let api = null;
  let status = null;
  let isActive = false;
  let endTime = 0;
  let activatedAt = 0;
  let lastPulseAt = 0;
  let flashNode = null;

  function onReady() {
    api = window.RTA_HOCKEY_SMASH;
    status = document.getElementById('hockey-status');
    if (!api) return;

    window.addEventListener('earthquakeActivate', (event) => {
      activateEarthquake(event?.detail?.duration || DEFAULT_DURATION_MS);
    });
    window.requestAnimationFrame(loop);
  }

  function activateEarthquake(duration = DEFAULT_DURATION_MS) {
    const state = getPlayableState();
    if (!state) return;

    const now = performance.now();
    isActive = true;
    activatedAt = now;
    endTime = now + duration;
    lastPulseAt = 0;
    ensureFlashNode();

    state.message = 'EARTHQUAKE MODE ACTIVATED!';
    if (status) status.textContent = state.message;
    state.effects?.push?.({ x: DESIGN_WIDTH / 2, y: 180, text: 'QUAKE!', life: 0.75 });

    damageAndStumbleEnemies(state, 2);
  }

  function getPlayableState() {
    const state = api?.getState?.();
    if (!state || !state.player || ['splash', 'transition', 'tryAgain'].includes(state.mode)) return null;
    return state;
  }

  function loop(now) {
    const state = getPlayableState();
    if (isActive && state) {
      if (now >= endTime) deactivate(state);
      else updateEarthquake(state, now);
    } else if (isActive) {
      resetShake();
      isActive = false;
    }
    window.requestAnimationFrame(loop);
  }

  function updateEarthquake(state, now) {
    const duration = Math.max(1, endTime - activatedAt);
    const remaining = Math.max(0, endTime - now);
    const remainingRatio = remaining / duration;

    if (now - lastPulseAt > 900) {
      lastPulseAt = now;
      damageAndStumbleEnemies(state, 1);
      state.effects?.push?.({ x: DESIGN_WIDTH * (0.28 + Math.random() * 0.44), y: 210 + Math.random() * 110, text: 'RUMBLE!', life: 0.38 });
    }

    (state.entities || []).forEach((entity) => {
      if (!entity || entity.dead || !TARGET_TYPES.has(entity.type)) return;
      entity.vx = (entity.vx || 0) * 0.965;
      entity.x += (Math.random() - 0.5) * 5;
      if (entity.y + entity.height > GROUND_Y) entity.y = GROUND_Y - entity.height;
    });

    applyShake(remainingRatio);
  }

  function damageAndStumbleEnemies(state, damage) {
    (state.entities || []).forEach((entity) => {
      if (!entity || entity.dead || !TARGET_TYPES.has(entity.type)) return;
      entity.hp = Math.max(0, (entity.hp || 1) - damage);
      entity.vx = (entity.vx || 0) * 0.35;
      entity.y = Math.min(entity.y, GROUND_Y - entity.height);
      if (entity.hp <= 0) {
        entity.dead = true;
        if ((entity.type === 'bear' || entity.type === 'moose') && state.computer?.results) {
          state.computer.results.clearedObstacle = true;
        }
      }
    });
  }

  function applyShake(remainingRatio) {
    const canvas = document.getElementById('hockey-canvas');
    if (!canvas) return;

    if (prefersReducedMotion()) {
      canvas.style.transform = '';
      if (flashNode) flashNode.style.opacity = '0.18';
      return;
    }

    const intensity = 5 + remainingRatio * 14;
    const offsetX = (Math.random() - 0.5) * intensity;
    const offsetY = (Math.random() - 0.5) * intensity * 0.7;
    canvas.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    if (flashNode) flashNode.style.opacity = String(0.08 + remainingRatio * 0.16);
  }

  function deactivate(state = getPlayableState()) {
    isActive = false;
    resetShake();
    if (state) {
      state.message = 'Earthquake over. Back to the run!';
      if (status) status.textContent = state.message;
    }
  }

  function resetShake() {
    const canvas = document.getElementById('hockey-canvas');
    if (canvas) canvas.style.transform = '';
    if (flashNode) flashNode.style.opacity = '0';
  }

  function ensureFlashNode() {
    if (flashNode) return flashNode;
    flashNode = document.createElement('div');
    flashNode.setAttribute('aria-hidden', 'true');
    Object.assign(flashNode.style, {
      position: 'fixed',
      inset: '0',
      zIndex: '7',
      pointerEvents: 'none',
      opacity: '0',
      transition: 'opacity 120ms linear',
      background: 'radial-gradient(circle at 50% 42%, rgba(254,243,199,.45), rgba(239,68,68,.24) 45%, rgba(69,26,3,.18) 100%)',
    });
    document.body.appendChild(flashNode);
    return flashNode;
  }

  function prefersReducedMotion() {
    return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
  }

  window.activateEarthquake = activateEarthquake;
  window.RTA_HOCKEY_SMASH_EARTHQUAKE = {
    activate: activateEarthquake,
    isActive: () => isActive,
    remainingMs: () => isActive ? Math.max(0, endTime - performance.now()) : 0,
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', onReady);
  else onReady();
})();
