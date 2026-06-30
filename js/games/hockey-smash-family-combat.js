(function () {
  const W = 1024;
  const BIG_TYPES = new Set(['bear', 'moose', 'chargingMoose']);
  const CAST_TYPES = new Set(['teacher', 'danceInstructor', 'sister', 'adultCoach', 'dad', 'mom', 'daniel']);
  let nextEntityId = 0;
  let nextOrder = 0;
  let doubleJumpBound = false;

  function api() { return window.RTA_HOCKEY_SMASH; }
  function state() {
    const s = api()?.getState?.();
    if (!s || !s.player || ['splash', 'transition', 'tryAgain'].includes(s.mode)) return null;
    if (!Array.isArray(s.entities)) s.entities = [];
    if (!Array.isArray(s.effects)) s.effects = [];
    return s;
  }
  function playerName() { return api()?.getPlayerConfig?.().name || 'Daniel'; }
  function entityId(entity) { return entity._familyCombatId || (entity._familyCombatId = `family-${Date.now()}-${++nextEntityId}`); }
  function order(entity) { return entity._familyCombatOrder || (entity._familyCombatOrder = ++nextOrder); }
  function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
  function overlap(a, b) { return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y; }
  function effect(s, x, y, text, life = 0.45) { s.effects?.push?.({ x, y, text, life }); }
  function status(text) { const el = document.getElementById('hockey-status'); if (el && text) el.textContent = text; }
  function syncHealth(s) { const el = document.getElementById('hockey-health'); if (el && s?.player) { el.value = s.player.health; el.textContent = `${s.player.health} health`; } }
  function invincibleSeconds() { return Math.max(0.1, Number(api()?.tuning?.invincibleMs || 760) / 1000); }

  function endRun(s) {
    s.mode = 'tryAgain';
    document.body.classList.remove('hockey-playing');
    const game = document.getElementById('hockey-game');
    const again = document.getElementById('hockey-try-again');
    if (game) game.hidden = true;
    if (again) again.hidden = false;
  }

  function bindDoubleJump() {
    if (doubleJumpBound) return;
    doubleJumpBound = true;
    document.body.dataset.doubleJumpBound = 'true';
    window.addEventListener('keydown', (event) => {
      if (event.repeat || !['ArrowUp', 'w', 'W', 'j', 'J'].includes(event.key || '')) return;
      doubleJump();
    }, { capture: true });
    window.addEventListener('pointerdown', (event) => {
      if (event.target?.closest?.('[data-action]')?.dataset?.action === 'jump') doubleJump();
    }, { capture: true, passive: true });
  }

  function doubleJump() {
    const s = state();
    const p = s?.player;
    if (!s || !p || p.grounded || p._doubleJumpUsed) return;
    p._doubleJumpUsed = true;
    p.vy = Math.max(-980, Math.min(-720, (Number(p.vy) || 0) - 320));
    s.message = `${playerName()} double jumps higher!`;
    effect(s, p.x + p.width / 2, p.y - 12, 'DOUBLE JUMP!', 0.5);
    status(s.message);
  }

  function contactAmount(type) {
    if (type === 'danceInstructor') return 7;
    if (type === 'dad') return 6;
    if (type === 'mom') return 5;
    if (type === 'sister') return 4;
    if (type === 'daniel') return 4;
    return 5;
  }

  function labelFor(type) {
    if (type === 'danceInstructor' || type === 'adultCoach') return 'Dance instructor';
    if (type === 'dad') return 'Dad';
    if (type === 'mom') return 'Mom';
    if (type === 'sister') return 'Sister';
    if (type === 'daniel') return 'Brother Daniel';
    if (type === 'teacher') return 'Teacher';
    return 'Cast member';
  }

  function tuneCastEntity(s, entity) {
    if (!CAST_TYPES.has(entity?.type) || entity.dead) return;
    if (entity.type === 'adultCoach') entity.type = 'danceInstructor';
    order(entity);
    entity.damage = 0;
    entity._dodgeLayerResolved = true;
    if (!entity._familyCombatReady) {
      entity._familyCombatReady = true;
      const hp = entity.type === 'sister' || entity.type === 'daniel' ? 3 : 4;
      entity.hp = Math.max(Number(entity.hp) || 0, hp);
      entity.maxHp = Math.max(Number(entity.maxHp) || 0, hp);
      entity._contactAmount = Math.max(Number(entity._contactAmount) || 0, contactAmount(entity.type));
    }
    if (entity.type === 'danceInstructor') entity.prettyBubble = entity.prettyBubble || 'Big finish!';
    if (entity.type === 'daniel') entity.prettyBubble = entity.prettyBubble || 'Hockey brother assist!';
    if (entity.type === 'dad') entity.prettyBubble = `${playerName()}, do your homework!`;
    entity.bubble = '';

    const delta = s.player.x + s.player.width / 2 - (entity.x + entity.width / 2);
    const speed = entity.type === 'danceInstructor' ? 170 : entity.type === 'daniel' ? 155 : 145;
    entity.vx = Math.abs(delta) > 28 ? clamp(delta * 1.35, -speed, speed * 0.72) : 0;
  }

  function playerBox(player) {
    return {
      x: player.x + 12,
      y: player.y + 8,
      width: Math.max(24, player.width - 24),
      height: Math.max(24, player.height - 10),
    };
  }

  function entityBox(entity) {
    return {
      x: entity.x + 10,
      y: entity.y + 10,
      width: Math.max(24, entity.width - 20),
      height: Math.max(24, entity.height - 14),
    };
  }

  function resolveCastContact(s) {
    const p = s.player;
    if (!p || p.invincible > 0) return;
    const pBox = playerBox(p);
    const contact = s.entities.find((entity) => entity && !entity.dead && CAST_TYPES.has(entity.type) && !entity._familyContactResolved && overlap(pBox, entityBox(entity)));
    if (!contact) return;

    const amount = Math.max(1, Number(contact._contactAmount) || contactAmount(contact.type));
    p.health = Math.max(0, p.health - amount);
    p.invincible = invincibleSeconds();
    contact._familyContactResolved = true;
    contact.dead = true;

    const label = labelFor(contact.type);
    s.message = `${label} bumped ${playerName()} for ${amount}.`;
    effect(s, contact.x + contact.width / 2, contact.y - 14, contact.type === 'danceInstructor' ? 'DANCE!' : contact.type === 'daniel' ? 'BROTHER!' : 'BUMP!', 0.55);
    status(s.message);
    syncHealth(s);
    if (p.health <= 0) endRun(s);
  }

  function projectileBox(node) {
    const canvas = document.getElementById('hockey-canvas');
    if (!canvas || !node?.isConnected) return null;
    const canvasRect = canvas.getBoundingClientRect();
    const rect = node.getBoundingClientRect();
    if (!canvasRect.width || !canvasRect.height || !rect.width || !rect.height) return null;
    return {
      x: (rect.left - canvasRect.left) / canvasRect.width * 1024,
      y: (rect.top - canvasRect.top) / canvasRect.height * 576,
      width: rect.width / canvasRect.width * 1024,
      height: rect.height / canvasRect.height * 576,
    };
  }

  function shotPower(node) {
    const variant = node.dataset.puckVariant || 'normal';
    if (node.dataset.charged === 'true' || variant === 'aerial') return 4;
    return variant === 'slide' ? 3 : 2;
  }

  function resolveProjectileContacts(s) {
    const targets = s.entities.filter((entity) => CAST_TYPES.has(entity?.type) && !entity.dead);
    if (!targets.length) return;
    document.querySelectorAll('[data-projectile-type]').forEach((node) => {
      const box = projectileBox(node);
      if (!box) return;
      targets.forEach((entity) => {
        const key = entityId(entity);
        const seen = new Set((node.dataset.familyHits || '').split(',').filter(Boolean));
        if (seen.has(key) || !overlap(box, entity)) return;
        seen.add(key);
        node.dataset.familyHits = Array.from(seen).join(',');
        const amount = shotPower(node);
        entity.hp = Math.max(0, (Number(entity.hp) || 1) - amount);
        effect(s, entity.x + entity.width / 2, entity.y - 12, 'SHOT!');
        if (entity.hp <= 0) {
          entity.dead = true;
          s.message = `${labelFor(entity.type)} cleared by the shot.`;
        } else {
          s.message = `${labelFor(entity.type)} HP ${entity.hp}/${entity.maxHp || 4}.`;
        }
        window.RTA_HOCKEY_SMASH_SCORE?.recordPuckHit?.({ state: s, target: entity, destroyed: entity.dead, puckVariant: node.dataset.puckVariant || 'normal', projectileType: node.dataset.projectileType || 'puck', damage: amount, charged: node.dataset.charged === 'true' });
        status(s.message);
      });
    });
  }

  function keepOneBigAnimal(s) {
    const active = s.entities.filter((entity) => BIG_TYPES.has(entity?.type) && !entity.dead).sort((a, b) => {
      const aVisible = a.x < W;
      const bVisible = b.x < W;
      if (aVisible !== bVisible) return aVisible ? -1 : 1;
      return order(a) - order(b);
    });
    active.slice(1).forEach((entity) => {
      entity.dead = true;
      effect(s, clamp(entity.x, 80, W - 80), Math.max(70, entity.y - 10), 'ONE AT A TIME!');
    });
  }

  function loop() {
    const s = state();
    if (s) {
      if (s.player.grounded) s.player._doubleJumpUsed = false;
      s.entities.forEach((entity) => { if (entity && !entity.dead) tuneCastEntity(s, entity); });
      keepOneBigAnimal(s);
      resolveProjectileContacts(s);
      resolveCastContact(s);
      syncHealth(s);
    }
    window.requestAnimationFrame(loop);
  }

  function ready() {
    document.body.dataset.hockeyFamilyCombat = 'v0.14.43';
    bindDoubleJump();
    window.HOCKEY_BOOT_LOG?.log?.('family-combat', 'Family/cast combat loaded with shared invincibility timing and non-versioned double-jump binding.');
    window.requestAnimationFrame(loop);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready);
  else ready();
})();
