(function () {
  const DISPLAY_VERSION = 'Hockey Smash v0.14.8 Salmon Collectibles';
  const DESIGN_WIDTH = 1024;
  const DESIGN_HEIGHT = 576;
  const GROUND_Y = DESIGN_HEIGHT * 0.82;
  const SALMON_POINTS = 67;

  let api = null;
  let status = null;
  let activeState = null;
  let collectedThisRun = new Set();

  function onReady() {
    api = window.RTA_HOCKEY_SMASH;
    status = document.getElementById('hockey-status');
    const badge = document.getElementById('hockey-build-badge');
    if (badge) badge.textContent = 'Hockey Smash v0.14.8 · Build 2026-06-30.64';
    if (api?.getVersion) api.getVersion = () => 'Hockey Smash v0.14.8';
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

  function neutralizeSalmon(entity) {
    entity.damage = 0;
    entity.dodgeDamage = 0;
    entity._dodgeLayerResolved = true;
    entity.collectibleSalmon = true;
    entity.safeCollectible = true;
  }

  function collectSalmon(s, entity) {
    const id = salmonId(entity);
    if (collectedThisRun.has(id)) return;
    collectedThisRun.add(id);

    entity.dead = true;
    entity.damage = 0;
    entity.dodgeDamage = 0;
    entity._dodgeLayerResolved = true;
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
    entity.damage = 0;
    entity.dodgeDamage = 0;
    entity._dodgeLayerResolved = true;
    entity._v139warn?.remove?.();
  }

  function handleSalmon(s) {
    const player = s.player;
    s.entities.forEach((entity) => {
      if (!entity || entity.dead || entity.type !== 'salmon') return;
      neutralizeSalmon(entity);

      if (rectsOverlap(player, entity)) {
        collectSalmon(s, entity);
        return;
      }

      // Missing salmon has no penalty. Kill it before the old splash-zone layer
      // can resolve the landing as damage or dodge scoring.
      if ((entity.y || 0) > DESIGN_HEIGHT + 80 || (entity.y || 0) + (entity.height || 0) >= GROUND_Y - 6) {
        missSalmon(entity);
      }
    });
  }

  function loop() {
    const s = state();
    if (s && s !== activeState) resetForState(s);
    if (s) handleSalmon(s);
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
