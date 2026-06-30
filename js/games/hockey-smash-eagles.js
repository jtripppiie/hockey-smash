(function () {
  const DISPLAY_VERSION = 'Hockey Smash v0.14.30 Eagles';
  const DISPLAY_BUILD = 'Build 2026-06-30.86';
  const W = 1024;
  const H = 576;
  const GROUND_Y = H * 0.82;
  const EAGLE_Y = GROUND_Y - 126;
  const EAGLE_WIDTH = 88;
  const EAGLE_HEIGHT = 58;
  const EAGLE_DAMAGE = 9;
  const DUCK_TRANSFORM = 'translate(-50%, 0) scaleX(1.12) scaleY(0.58)';
  const EAGLE_FRAME_SOURCES = [
    'assets/hockey-smash/sprites/eagle_wings_up.webp',
    'assets/hockey-smash/sprites/eagle_mid_flap.webp',
    'assets/hockey-smash/sprites/eagle_wings_down.webp',
  ];

  let duckHeld = false;
  let duckOverlay = null;
  let eagleLayer = null;
  const eagleNodes = new Map();
  const eagleFrames = [];

  function api() { return window.RTA_HOCKEY_SMASH; }
  function state() {
    const s = api()?.getState?.();
    if (!s || !s.player || ['splash', 'transition', 'tryAgain'].includes(s.mode)) return null;
    if (!Array.isArray(s.entities)) s.entities = [];
    if (!Array.isArray(s.effects)) s.effects = [];
    return s;
  }
  function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
  function overlap(a, b) { return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y; }
  function playerName(s) { return api()?.getPlayerConfig?.()?.name || s?.player?.name || 'Daniel'; }

  function preloadEagleFrames() {
    if (eagleFrames.length) return;
    EAGLE_FRAME_SOURCES.forEach((src) => {
      const image = new Image();
      const frame = { src, image, ready: false, failed: false };
      image.decoding = 'async';
      image.onload = () => { frame.ready = true; };
      image.onerror = () => { frame.failed = true; };
      image.src = src;
      eagleFrames.push(frame);
    });
  }

  function availableEagleFrames() {
    const ready = eagleFrames.filter((frame) => frame.ready && !frame.failed);
    return ready.length ? ready : eagleFrames.filter((frame) => frame.src.includes('eagle_mid_flap'));
  }

  function currentEagleFrame(now) {
    const frames = availableEagleFrames();
    if (!frames.length) return EAGLE_FRAME_SOURCES[1];
    return frames[Math.floor(now / 115) % frames.length].src;
  }

  function setDuckHeld(active) {
    if (duckHeld === active) return;
    duckHeld = active;
    document.body.classList.toggle('hockey-duck-active', duckHeld);
    const s = state();
    if (s?.player) {
      s.player.ducking = duckHeld;
      s.player.isDucking = duckHeld;
      s.message = duckHeld ? `${playerName(s)} ducks under the fly-by!` : s.message;
      const status = document.getElementById('hockey-status');
      if (status && duckHeld) status.textContent = s.message;
    }
  }

  function bindDuckKey() {
    if (document.body.dataset.hockeyDuckKeyBound === 'v0.14.30') return;
    document.body.dataset.hockeyDuckKeyBound = 'v0.14.30';

    window.addEventListener('keydown', (event) => {
      if (event.key !== 'ArrowDown') return;
      const s = state();
      if (!s) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      setDuckHeld(true);
    }, { capture: true, passive: false });

    window.addEventListener('keyup', (event) => {
      if (event.key !== 'ArrowDown') return;
      event.preventDefault();
      event.stopImmediatePropagation();
      setDuckHeld(false);
    }, { capture: true, passive: false });

    window.addEventListener('blur', () => setDuckHeld(false));
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) setDuckHeld(false);
    });
  }

  function playerStandingBox(player) {
    return {
      x: player.x + 18,
      y: player.y + 10,
      width: player.width - 36,
      height: player.height - 18,
    };
  }

  function playerDuckBox(player) {
    return {
      x: player.x + 18,
      y: player.y + 74,
      width: player.width - 36,
      height: Math.max(24, player.height - 76),
    };
  }

  function eagleBox(entity) {
    return {
      x: entity.x + 8,
      y: entity.y + 8,
      width: entity.width - 16,
      height: entity.height - 16,
    };
  }

  function tuneEagle(entity, now) {
    if (!entity || entity.dead || entity.type !== 'bird') return;
    entity.y = EAGLE_Y + Math.sin((now + (entity._eagleOffset || 0)) / 280) * 7;
    entity.width = Math.max(entity.width || 0, EAGLE_WIDTH);
    entity.height = Math.max(entity.height || 0, EAGLE_HEIGHT);
    entity.vx = -Math.max(300, Math.abs(entity.vx || 330));
    entity.damage = 0;
    entity.maxHp = Math.max(entity.maxHp || 1, entity.hp || 1);
    entity._eagleManaged = true;
    if (!entity._eagleOffset) entity._eagleOffset = Math.random() * 800;
  }

  function damageFromEagle(s, entity) {
    const p = s.player;
    const ducking = Boolean(duckHeld || p.ducking || p.isDucking || document.body.classList.contains('hockey-duck-active'));
    const bird = eagleBox(entity);
    const standing = playerStandingBox(p);
    const ducked = playerDuckBox(p);

    if (ducking) {
      p.ducking = true;
      p.isDucking = true;
      if (overlap(bird, standing) && !overlap(bird, ducked) && !entity._duckClearShown) {
        entity._duckClearShown = true;
        s.effects.push({ x: p.x + p.width / 2, y: p.y - 14, text: 'DUCKED!', life: 0.55 });
        s.message = `${playerName(s)} ducked under the eagle!`;
        document.getElementById('hockey-status')?.replaceChildren(document.createTextNode(s.message));
        window.RTA_HOCKEY_SMASH_SCORE?.recordDodge?.({ state: s, entity });
      }
      return;
    }

    p.ducking = false;
    p.isDucking = false;
    if (!overlap(bird, standing) || p.invincible > 0) return;

    p.health = Math.max(0, p.health - EAGLE_DAMAGE);
    p.invincible = 0.82;
    entity._duckClearShown = true;
    s.effects.push({ x: p.x + p.width / 2, y: p.y - 18, text: 'EAGLE HIT!', life: 0.55 });
    s.message = `Eagle clipped ${playerName(s)}! Press Down Arrow to duck.`;
    const health = document.getElementById('hockey-health');
    if (health) {
      health.value = p.health;
      health.textContent = `${p.health} health`;
    }
    const status = document.getElementById('hockey-status');
    if (status) status.textContent = s.message;
    window.RTA_HOCKEY_SMASH_SCORE?.recordDamage?.({ state: s, amount: EAGLE_DAMAGE, source: 'eagle' });
  }

  function ensureDuckOverlay() {
    if (duckOverlay?.isConnected) return duckOverlay;
    duckOverlay = document.createElement('img');
    duckOverlay.className = 'hockey-duck-overlay';
    duckOverlay.alt = '';
    duckOverlay.setAttribute('aria-hidden', 'true');
    Object.assign(duckOverlay.style, {
      position: 'fixed',
      left: '0',
      top: '0',
      width: '0',
      height: '0',
      zIndex: '16',
      pointerEvents: 'none',
      objectFit: 'contain',
      filter: 'drop-shadow(0 8px 10px rgba(0,0,0,.32))',
      transformOrigin: 'bottom center',
      display: 'none',
    });
    document.body.appendChild(duckOverlay);
    return duckOverlay;
  }

  function syncDuckOverlay(s) {
    const overlay = ensureDuckOverlay();
    const canvas = document.getElementById('hockey-canvas');
    const rect = canvas?.getBoundingClientRect?.();
    if (!overlay || !rect?.width || !rect?.height || !s?.player || !duckHeld) {
      if (overlay) overlay.style.display = 'none';
      return;
    }
    const config = api()?.getPlayerConfig?.();
    const src = config?.slideSprite || (config?.character === 'sofie' ? 'assets/hockey-smash/sprites/sister-spinning.webp' : 'assets/hockey-smash/sprites/hockey-player-sliding.webp');
    if (!overlay.src.endsWith(src)) overlay.src = src;
    const p = s.player;
    const sx = rect.width / W;
    const sy = rect.height / H;
    overlay.style.display = 'block';
    overlay.style.left = `${rect.left + (p.x + p.width / 2) * sx}px`;
    overlay.style.top = `${rect.top + (p.y + 32) * sy}px`;
    overlay.style.width = `${p.width * sx}px`;
    overlay.style.height = `${p.height * sy}px`;
    overlay.style.transform = DUCK_TRANSFORM;
  }

  function ensureEagleLayer() {
    if (eagleLayer?.isConnected) return eagleLayer;
    eagleLayer = document.createElement('div');
    eagleLayer.className = 'hockey-eagle-layer';
    eagleLayer.setAttribute('aria-hidden', 'true');
    Object.assign(eagleLayer.style, {
      position: 'fixed',
      left: '0',
      top: '0',
      width: '0',
      height: '0',
      zIndex: '14',
      pointerEvents: 'none',
    });
    document.body.appendChild(eagleLayer);
    return eagleLayer;
  }

  function idForEagle(entity) {
    if (!entity._eagleDomId) entity._eagleDomId = `eagle-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    return entity._eagleDomId;
  }

  function syncEagleSprites(s, now) {
    const layer = ensureEagleLayer();
    const canvas = document.getElementById('hockey-canvas');
    const rect = canvas?.getBoundingClientRect?.();
    if (!layer || !rect?.width || !rect?.height || !Array.isArray(s?.entities)) {
      eagleNodes.forEach((node) => node.remove());
      eagleNodes.clear();
      return;
    }

    const alive = new Set();
    const sx = rect.width / W;
    const sy = rect.height / H;
    const frame = currentEagleFrame(now);

    s.entities.forEach((entity) => {
      if (!entity || entity.dead || entity.type !== 'bird') return;
      const id = idForEagle(entity);
      alive.add(id);
      let node = eagleNodes.get(id);
      if (!node) {
        node = document.createElement('img');
        node.alt = '';
        node.className = 'hockey-eagle-flap-sprite';
        Object.assign(node.style, {
          position: 'fixed',
          pointerEvents: 'none',
          objectFit: 'contain',
          filter: 'drop-shadow(0 6px 8px rgba(0,0,0,.32))',
          transform: 'translate(-50%, -50%)',
        });
        layer.appendChild(node);
        eagleNodes.set(id, node);
      }
      if (!node.src.endsWith(frame)) node.src = frame;
      node.style.left = `${rect.left + (entity.x + entity.width / 2) * sx}px`;
      node.style.top = `${rect.top + (entity.y + entity.height / 2) * sy}px`;
      node.style.width = `${entity.width * sx}px`;
      node.style.height = `${entity.height * sy}px`;
      node.style.opacity = entity.x > W || entity.x + entity.width < 0 ? '0' : '1';
    });

    eagleNodes.forEach((node, id) => {
      if (!alive.has(id)) {
        node.remove();
        eagleNodes.delete(id);
      }
    });
  }

  function eagleLoop(now) {
    const s = state();
    if (s) {
      s.player.ducking = duckHeld;
      s.player.isDucking = duckHeld;
      s.entities.forEach((entity) => {
        tuneEagle(entity, now);
        if (entity?.type === 'bird' && !entity.dead) damageFromEagle(s, entity);
      });
      syncDuckOverlay(s);
      syncEagleSprites(s, now);
    } else {
      setDuckHeld(false);
      syncDuckOverlay(null);
      syncEagleSprites(null, now || performance.now());
    }
    window.requestAnimationFrame(eagleLoop);
  }

  function ready() {
    const badge = document.getElementById('hockey-build-badge');
    if (badge) badge.textContent = `${DISPLAY_VERSION} · ${DISPLAY_BUILD}`;
    if (api()?.getVersion) api().getVersion = () => DISPLAY_VERSION;
    document.body.dataset.hockeyEagles = 'v0.14.30';
    preloadEagleFrames();
    bindDuckKey();
    window.HOCKEY_BOOT_LOG?.log?.('eagles', 'Low eagle fly-bys loaded. Down Arrow ducks under eagle collision. Optional up/mid/down eagle frames animate when present.');
    window.requestAnimationFrame(eagleLoop);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready);
  else ready();
})();
