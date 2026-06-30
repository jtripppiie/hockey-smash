(function () {
  const DESIGN_WIDTH = 1024;
  const DESIGN_HEIGHT = 576;
  const GROUND_Y = DESIGN_HEIGHT * 0.82;
  const SALMON_POINTS = 67;
  const MIN_FALL_SPEED = 680;
  const FALL_ACCELERATION = 900;

  let api = null;
  let status = null;
  let activeState = null;
  let collectedThisRun = new Set();
  let lastFrame = performance.now();

  function onReady() {
    api = window.RTA_HOCKEY_SMASH;
    status = document.getElementById('hockey-status');
    window.requestAnimationFrame(loop);
  }

  function state() {
    const s = api?.getState?.();
    if (!s || !s.player || ['splash', 'transition', 'tryAgain'].includes(s.mode)) return null;
    if (!Array.isArray(s.entities)) s.entities = [];
    if (!Array.isArray(s.effects)) s.effects = [];
    return s;
  }

  function playerName() {
    return api?.getPlayerConfig?.()?.name || 'Daniel';
  }

  function salmonId(entity) {
    if (!entity._salmonCollectibleId) {
      entity._salmonCollectibleId = `salmon-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    }
    return entity._salmonCollectibleId;
  }

  function resetForState(s) {
    activeState = s;
    collectedThisRun = new Set();
  }

  function markCollectibleSalmon(entity) {
    entity.damage = 0;
    entity.dodgeDamage = 0;
    entity.collectibleSalmon = true;
    entity.safeCollectible = true;
    entity._salmonRulesOwner = 'hockey-smash-salmon-collectibles';
    entity._dodgeLayerResolved = true;
  }

  function tuneFallSpeed(entity, dt) {
    if (!entity || entity.dead || entity.type !== 'salmon') return;
    entity.vx = Math.max(-70, Math.min(70, Number(entity.vx) || 0));
    entity.vy = Math.max(Number(entity.vy) || 0, MIN_FALL_SPEED);
    entity.vy += FALL_ACCELERATION * dt;
  }

  function playerCatchBox(player) {
    const normalHeight = Math.max(player._duckNormalHeight || 0, player.height || 0, 108);
    const bottom = Math.max((player.y || 0) + (player.height || normalHeight), GROUND_Y);
    return {
      x: (player.x || 0) - 22,
      y: bottom - normalHeight - 34,
      width: (player.width || 104) + 44,
      height: normalHeight + 52,
    };
  }

  function salmonCatchBox(entity) {
    return {
      x: (entity.x || 0) - 10,
      y: (entity.y || 0) - 10,
      width: (entity.width || 54) + 20,
      height: (entity.height || 31) + 20,
    };
  }

  function collectSalmon(s, entity) {
    const id = salmonId(entity);
    if (collectedThisRun.has(id)) return;
    collectedThisRun.add(id);

    entity.dead = true;
    markCollectibleSalmon(entity);
    entity._v139warn?.remove?.();

    s.message = `${playerName()} collected salmon! +${SALMON_POINTS}`;
    if (status) status.textContent = s.message;
    s.effects.push({
      x: entity.x + entity.width / 2,
      y: Math.max(70, entity.y - 8),
      text: `+${SALMON_POINTS}`,
      life: 0.6,
    });

    window.RTA_HOCKEY_SMASH_SCORE?.recordSalmonCollect?.({
      state: s,
      entity,
      points: SALMON_POINTS,
    });
  }

  function missSalmon(entity) {
    entity.dead = true;
    markCollectibleSalmon(entity);
    entity._v139warn?.remove?.();
  }

  function handleSalmon(s, dt) {
    const playerBox = playerCatchBox(s.player);
    s.entities.forEach((entity) => {
      if (!entity || entity.dead || entity.type !== 'salmon') return;
      markCollectibleSalmon(entity);
      tuneFallSpeed(entity, dt);

      if (rectsOverlap(playerBox, salmonCatchBox(entity))) {
        collectSalmon(s, entity);
        return;
      }

      if ((entity.y || 0) > DESIGN_HEIGHT + 80 || (entity.y || 0) + (entity.height || 0) >= GROUND_Y - 6) {
        missSalmon(entity);
      }
    });
  }

  function loop(now) {
    const dt = Math.min(0.05, Math.max(0.008, (now - lastFrame) / 1000 || 0.016));
    lastFrame = now;
    const s = state();
    if (s && s !== activeState) resetForState(s);
    if (s) handleSalmon(s, dt);
    else {
      activeState = null;
      document.querySelectorAll('[data-hockey-fish-warning]').forEach((node) => node.remove());
    }
    window.requestAnimationFrame(loop);
  }

  function rectsOverlap(a, b) {
    return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', onReady);
  else onReady();
})();
