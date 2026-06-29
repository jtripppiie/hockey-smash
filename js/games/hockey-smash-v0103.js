(function () {
  const DISPLAY_VERSION = 'Hockey Smash v0.13.6';
  const DISPLAY_BUILD = 'Build 2026-06-29.52';
  const DESIGN_WIDTH = 1024;
  const DESIGN_HEIGHT = 576;
  const GROUND_Y = DESIGN_HEIGHT * 0.82;

  // Puck / pointe-shoe tuning.
  // A quick tap still shoots immediately on release. Holding the action key/button
  // charges a faster, slightly arcing shot. This keeps the controls simple while
  // giving better players a stronger timing choice.
  const PUCK_BASE_SPEED = 720;
  const PUCK_MIN_SPEED = 450;
  const PUCK_MAX_CHARGE_MS = 650;
  const PUCK_DAMAGE = 2;
  const PUCK_COOLDOWN_MS = 260;
  const PUCK_ARC_GRAVITY = 420;
  const FISH_DODGE_DAMAGE = 8;
  const POWERUP_DURATION_MS = 6500;

  let api = null;
  let canvas = null;
  let status = null;
  let health = null;
  let lastFrame = performance.now();
  let lastPuckAt = 0;
  let lastSeenSwing = 0;
  let puckChargeStart = 0;
  let activePointerChargeId = null;
  let puckSpeedBoostUntil = 0;
  let pucks = [];
  let powerups = [];

  function onReady() {
    api = window.RTA_HOCKEY_SMASH;
    canvas = document.getElementById('hockey-canvas');
    status = document.getElementById('hockey-status');
    health = document.getElementById('hockey-health');
    const badge = document.getElementById('hockey-build-badge');
    if (badge) badge.textContent = `${DISPLAY_VERSION} · ${DISPLAY_BUILD}`;
    if (api?.getVersion) api.getVersion = () => DISPLAY_VERSION;
    if (!api || !canvas) return;
    bindStickLaunchers();
    window.requestAnimationFrame(runPuckAndDodgeLayer);
  }

  function bindStickLaunchers() {
    window.addEventListener('keydown', (event) => {
      if (!['f', 'F', 'Enter'].includes(event.key)) return;
      // Holding the action key starts a charge. We fire on keyup so the player can
      // choose between a tap shot and a charged slap shot.
      if (!event.repeat && !puckChargeStart) puckChargeStart = performance.now();
    }, { capture: true });

    window.addEventListener('keyup', (event) => {
      if (!['f', 'F', 'Enter'].includes(event.key) || !puckChargeStart) return;
      firePuck(performance.now() - puckChargeStart);
      puckChargeStart = 0;
    });

    window.addEventListener('pointerdown', (event) => {
      if (actionFromEvent(event) !== 'stick') return;
      activePointerChargeId = event.pointerId;
      puckChargeStart = performance.now();
    }, { capture: true, passive: true });

    window.addEventListener('pointerup', (event) => {
      if (activePointerChargeId == null || event.pointerId !== activePointerChargeId || !puckChargeStart) return;
      firePuck(performance.now() - puckChargeStart);
      puckChargeStart = 0;
      activePointerChargeId = null;
    }, { capture: true, passive: true });

    window.addEventListener('pointercancel', (event) => {
      if (activePointerChargeId == null || event.pointerId !== activePointerChargeId) return;
      puckChargeStart = 0;
      activePointerChargeId = null;
    }, { capture: true, passive: true });

    window.addEventListener('blur', () => {
      puckChargeStart = 0;
      activePointerChargeId = null;
    });
  }

  function notifyScoreLayer(method, payload) {
    window.RTA_HOCKEY_SMASH_SCORE?.[method]?.(payload);
  }

  function actionFromEvent(event) {
    return event.target?.closest?.('[data-action]')?.dataset?.action || null;
  }

  function getPlayableState() {
    const state = api?.getState?.();
    if (!state || !state.player || ['splash', 'transition', 'tryAgain'].includes(state.mode)) return null;
    return state;
  }

  function currentPlayerConfig() {
    return api?.getPlayerConfig?.() || { name: 'Daniel', character: 'daniel' };
  }

  function currentPlayerName() {
    return currentPlayerConfig().name || 'Daniel';
  }

  function isSofiePlayer() {
    return currentPlayerConfig().character === 'sofie';
  }

  function speedBoostActive() {
    return performance.now() < puckSpeedBoostUntil;
  }

  function projectileHitLabel(variant, charged) {
    if (isSofiePlayer()) {
      if (charged) return 'CHARGED SHOE!';
      if (variant === 'aerial') return 'AIR SHOE!';
      if (variant === 'slide') return 'LOW SHOE!';
      return 'POINTE SHOE!';
    }
    if (charged) return 'CHARGED PUCK!';
    if (variant === 'aerial') return 'AIR PUCK!';
    if (variant === 'slide') return 'LOW PUCK!';
    return 'PUCK!';
  }

  function puckStatsForPlayer(player, chargeFactor) {
    const sliding = document.body.classList.contains('hockey-slide-active') || document.getElementById('hockey-player-overlay')?.dataset?.sliding === 'true';
    const airborne = !player.grounded && player.y + player.height < GROUND_Y - 18;
    const name = currentPlayerName();
    const sofie = isSofiePlayer();
    const charged = chargeFactor > 0.6;
    const boost = speedBoostActive();
    const chargeBoost = Math.floor(chargeFactor * 2) + (boost ? 1 : 0);
    const boostedGlow = boost ? ', 0 0 34px rgba(140,255,145,.85)' : '';

    if (sofie && airborne) {
      return {
        variant: 'aerial', projectileType: 'pointe-shoe', damage: 4 + chargeBoost,
        width: 40 + chargeFactor * 8, height: 24 + chargeFactor * 4,
        message: charged ? `${name} winds up an aerial pointe blast!` : `${name} launches an aerial pointe shoe!`,
        text: '🩰', background: 'linear-gradient(135deg, #fff7ed 0%, #fecdd3 45%, #fb7185 100%)',
        boxShadow: (charged ? '0 0 0 3px rgba(255,255,255,.95), 0 0 30px rgba(244,114,182,.95)' : '0 0 0 2px rgba(255,255,255,.9), 0 0 22px rgba(244,114,182,.75)') + boostedGlow,
        borderRadius: '45% 55% 55% 45%', charged
      };
    }
    if (sofie && sliding) {
      return {
        variant: 'slide', projectileType: 'pointe-shoe', damage: 3 + chargeBoost,
        width: 38 + chargeFactor * 8, height: 22 + chargeFactor * 4,
        message: charged ? `${name} charges a low sweeping pointe shot!` : `${name} sweeps a low pointe shoe!`,
        text: '🩰', background: 'linear-gradient(135deg, #fff1f2 0%, #f9a8d4 48%, #be185d 100%)',
        boxShadow: (charged ? '0 0 0 3px rgba(255,255,255,.9), 0 0 28px rgba(244,114,182,.9)' : '0 0 0 2px rgba(255,255,255,.85), 0 0 18px rgba(244,114,182,.7)') + boostedGlow,
        borderRadius: '45% 55% 55% 45%', charged
      };
    }
    if (sofie) {
      return {
        variant: 'normal', projectileType: 'pointe-shoe', damage: PUCK_DAMAGE + chargeBoost,
        width: 36 + chargeFactor * 9, height: 22 + chargeFactor * 4,
        message: charged ? `${name} winds up a big pointe-shoe shot!` : `${name} throws a pointe shoe at the wildlife!`,
        text: '🩰', background: 'linear-gradient(135deg, #fff7ed 0%, #fda4af 50%, #e11d48 100%)',
        boxShadow: (charged ? '0 0 0 3px rgba(255,255,255,.9), 0 0 26px rgba(244,114,182,.9)' : '0 0 0 2px rgba(255,255,255,.75), 0 8px 12px rgba(0,0,0,.25)') + boostedGlow,
        borderRadius: '45% 55% 55% 45%', charged
      };
    }

    if (airborne) {
      return {
        variant: 'aerial', projectileType: 'puck', damage: 4 + chargeBoost,
        width: 36 + chargeFactor * 10, height: 18 + chargeFactor * 5,
        message: charged ? `${name} winds up a huge aerial slapshot!` : `${name} launches an aerial slapshot!`,
        background: 'radial-gradient(circle at 35% 30%, #fff7a8 0 18%, #f59e0b 45%, #7c2d12 100%)',
        boxShadow: (charged ? '0 0 0 3px rgba(255,255,255,.95), 0 0 30px rgba(250,204,21,.95)' : '0 0 0 2px rgba(255,255,255,.8), 0 0 22px rgba(250,204,21,.75)') + boostedGlow,
        borderRadius: '999px', charged
      };
    }
    if (sliding) {
      return {
        variant: 'slide', projectileType: 'puck', damage: 3 + chargeBoost,
        width: 34 + chargeFactor * 10, height: 14 + chargeFactor * 4,
        message: charged ? `${name} charges a low rocket puck!` : `${name} fires a low slide puck!`,
        background: 'radial-gradient(circle at 35% 30%, #dbeafe 0 18%, #2563eb 46%, #0f172a 100%)',
        boxShadow: (charged ? '0 0 0 3px rgba(255,255,255,.9), 0 0 28px rgba(96,165,250,.9)' : '0 0 0 2px rgba(255,255,255,.75), 0 0 18px rgba(96,165,250,.7)') + boostedGlow,
        borderRadius: '999px', charged
      };
    }
    return {
      variant: 'normal', projectileType: 'puck', damage: PUCK_DAMAGE + chargeBoost,
      width: 30 + chargeFactor * 10, height: 16 + chargeFactor * 5,
      message: charged ? `${name} winds up a big slap shot!` : `${name} slaps a puck at the wildlife!`,
      background: charged ? 'radial-gradient(circle at 35% 30%, #fef08a 0 18%, #f97316 46%, #111827 100%)' : 'radial-gradient(circle at 35% 30%, #5b6370 0 12%, #1b2028 42%, #05070a 100%)',
      boxShadow: (charged ? '0 0 0 3px rgba(255,255,255,.9), 0 0 28px rgba(251,191,36,.95)' : '0 0 0 2px rgba(255,255,255,.65), 0 8px 12px rgba(0,0,0,.25)') + boostedGlow,
      borderRadius: '999px', charged
    };
  }

  function firePuck(chargeTime = 0) {
    const state = getPlayableState();
    if (!state) return;
    const now = performance.now();
    if (now - lastPuckAt < PUCK_COOLDOWN_MS) return;
    lastPuckAt = now;
    const player = state.player;
    const facing = player.facing < 0 ? -1 : 1;
    const chargeFactor = Math.min(1, Math.max(0, chargeTime / PUCK_MAX_CHARGE_MS));
    const speedMultiplier = speedBoostActive() ? 1.25 : 1;
    const speed = (PUCK_MIN_SPEED + (PUCK_BASE_SPEED - PUCK_MIN_SPEED) * chargeFactor) * speedMultiplier;
    const puckStats = puckStatsForPlayer(player, chargeFactor);
    const heightOffset = chargeFactor * -25;
    pucks.push({
      x: facing > 0 ? player.x + player.width + 6 : player.x - 34,
      y: player.y + player.height * 0.48 + heightOffset,
      width: puckStats.width,
      height: puckStats.height,
      vx: speed * facing,
      vy: chargeFactor * -180,
      life: 1.8,
      damage: puckStats.damage,
      variant: puckStats.variant,
      projectileType: puckStats.projectileType,
      charged: puckStats.charged,
      chargeFactor,
      node: createProjectileNode(puckStats),
    });
    state.message = puckStats.message;
    if (status) status.textContent = state.message;
  }

  function createProjectileNode(puckStats) {
    const node = document.createElement('div');
    node.setAttribute('aria-hidden', 'true');
    node.dataset.puckVariant = puckStats.variant;
    node.dataset.projectileType = puckStats.projectileType || 'puck';
    node.dataset.charged = puckStats.charged ? 'true' : 'false';
    if (puckStats.text) node.textContent = puckStats.text;
    Object.assign(node.style, {
      position: 'fixed', left: '0', top: '0', width: '20px', height: '10px',
      zIndex: '8', pointerEvents: 'none', borderRadius: puckStats.borderRadius || '999px',
      background: puckStats.background, boxShadow: puckStats.boxShadow,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: puckStats.charged ? '24px' : '20px', lineHeight: '1',
      transform: puckStats.projectileType === 'pointe-shoe' ? 'rotate(-18deg)' : '',
    });
    document.body.appendChild(node);
    return node;
  }

  function runPuckAndDodgeLayer(now) {
    const dt = Math.min(0.034, Math.max(0.008, (now - lastFrame) / 1000 || 0.016));
    lastFrame = now;
    const state = getPlayableState();
    if (!state) clearLayerObjects();
    else {
      neutralizeSalmonDamage(state);
      launchFromCoreStickSwing(state);
      updatePucks(state, dt);
      updatePowerups(state, dt);
      handleSalmonDodgeRules(state);
      syncPuckNodes();
      syncPowerupNodes();
      syncHud(state);
    }
    window.requestAnimationFrame(runPuckAndDodgeLayer);
  }

  function launchFromCoreStickSwing(state) {
    const swingStamp = state.player?.lastSwing || 0;
    if (!swingStamp || swingStamp === lastSeenSwing) return;
    lastSeenSwing = swingStamp;
    // The core game still records a stick swing as soon as the input starts.
    // If we are charging, ignore that early swing and wait for release.
    if (puckChargeStart) return;
    firePuck(0);
  }

  function neutralizeSalmonDamage(state) {
    (state.entities || []).forEach((entity) => {
      if (entity?.type !== 'salmon') return;
      if (entity._dodgeLayerOriginalDamage == null) entity._dodgeLayerOriginalDamage = entity.damage || FISH_DODGE_DAMAGE;
      entity.dodgeDamage = entity.dodgeDamage || entity._dodgeLayerOriginalDamage || FISH_DODGE_DAMAGE;
      entity.damage = 0;
    });
  }

  function updatePucks(state, dt) {
    pucks.forEach((puck) => {
      puck.x += puck.vx * dt;
      puck.y += (puck.vy || 0) * dt;
      puck.vy = (puck.vy || 0) + PUCK_ARC_GRAVITY * dt;
      puck.life -= dt;
      const target = (state.entities || []).find((entity) => {
        if (!entity || entity.dead) return false;
        if (!(entity.type === 'bear' || entity.type === 'moose')) return false;
        return rectsOverlap(puck, entity);
      });
      if (!target) return;
      target.hp -= puck.damage || PUCK_DAMAGE;
      puck.life = 0;
      const hitLabel = projectileHitLabel(puck.variant, puck.charged);
      state.effects?.push?.({ x: target.x + target.width / 2, y: target.y - 10, text: hitLabel, life: 0.35 });
      const destroyed = target.hp <= 0;
      const word = puck.projectileType === 'pointe-shoe' ? 'pointe shoe' : 'puck';
      if (destroyed) {
        target.dead = true;
        maybeDropPowerup(target);
        if (state.computer?.results) state.computer.results.clearedObstacle = true;
        state.message = target.type === 'moose' ? `Moose clears the sidewalk after the ${word} hit!` : `Bear backs off after the ${word} hit!`;
      } else {
        state.message = target.type === 'moose' ? `${capitalize(word)} hit the moose. One more!` : `${capitalize(word)} hit the bear!`;
      }
      notifyScoreLayer('recordPuckHit', { state, target, destroyed, puckVariant: puck.variant, projectileType: puck.projectileType, damage: puck.damage || PUCK_DAMAGE, charged: puck.charged });
      if (status) status.textContent = state.message;
    });
    pucks = pucks.filter((puck) => {
      const alive = puck.life > 0 && puck.x > -100 && puck.x < DESIGN_WIDTH + 100 && puck.y > -120 && puck.y < DESIGN_HEIGHT + 120;
      if (!alive) puck.node?.remove?.();
      return alive;
    });
  }

  function maybeDropPowerup(target) {
    // Power-ups stay in this layer instead of state.entities. The old core loop
    // damages the player for every entity overlap, so storing power-ups locally
    // avoids accidentally turning a reward into a hazard.
    if (!target || Math.random() >= 0.4) return;
    powerups.push({
      x: target.x + target.width / 2 - 24,
      y: Math.max(80, target.y - 40),
      vx: -80,
      width: 48,
      height: 48,
      life: 5.5,
      power: 'puckSpeed',
      node: createPowerupNode(),
    });
  }

  function createPowerupNode() {
    const node = document.createElement('div');
    node.setAttribute('aria-hidden', 'true');
    node.textContent = '⚡';
    Object.assign(node.style, {
      position: 'fixed', left: '0', top: '0', width: '28px', height: '28px',
      zIndex: '8', pointerEvents: 'none', borderRadius: '999px',
      display: 'grid', placeItems: 'center',
      background: 'radial-gradient(circle, #fef08a 0 30%, #22c55e 72%, #064e3b 100%)',
      boxShadow: '0 0 0 3px rgba(255,255,255,.85), 0 0 26px rgba(34,197,94,.85)',
      fontSize: '22px', lineHeight: '1',
    });
    document.body.appendChild(node);
    return node;
  }

  function updatePowerups(state, dt) {
    powerups.forEach((powerup) => {
      powerup.x += (powerup.vx || 0) * dt;
      powerup.life -= dt;
      if (rectsOverlap(powerup, state.player)) {
        powerup.life = 0;
        puckSpeedBoostUntil = performance.now() + POWERUP_DURATION_MS;
        state.effects?.push?.({ x: state.player.x + state.player.width / 2, y: state.player.y - 18, text: 'PUCK BOOST!', life: 0.45 });
        state.message = `${currentPlayerName()} grabbed a puck speed boost!`;
        if (status) status.textContent = state.message;
      }
    });
    powerups = powerups.filter((powerup) => {
      const alive = powerup.life > 0 && powerup.x > -90 && powerup.x < DESIGN_WIDTH + 100;
      if (!alive) powerup.node?.remove?.();
      return alive;
    });
  }

  function handleSalmonDodgeRules(state) {
    const player = state.player;
    (state.entities || []).forEach((entity) => {
      if (!entity || entity.dead || entity.type !== 'salmon' || entity._dodgeLayerResolved) return;
      if (!horizontalOverlap(player, entity)) return;
      entity._dodgeLayerResolved = true;
      if (playerIsDodgingSalmon(player, entity)) {
        const label = entity.variant === 'school' ? 'BIG DODGE!' : 'DODGE!';
        state.effects?.push?.({ x: player.x + player.width / 2, y: player.y - 10, text: label, life: 0.35 });
        state.message = entity.variant === 'high' ? `${currentPlayerName()} jumped the high salmon arc!` : `${currentPlayerName()} dodged the fish!`;
        notifyScoreLayer('recordDodge', { state, entity });
      } else {
        damagePlayerFromFish(state, entity.dodgeDamage || FISH_DODGE_DAMAGE);
      }
      if (status) status.textContent = state.message;
    });
  }

  function playerIsDodgingSalmon(player, entity) {
    const sliding = document.body.classList.contains('hockey-slide-active') || document.getElementById('hockey-player-overlay')?.dataset?.sliding === 'true';
    const jumping = !player.grounded && player.y + player.height < GROUND_Y - 45;
    const highEnough = player.y < GROUND_Y - 120;
    if (entity?.variant === 'low') return sliding;
    if (entity?.variant === 'high') return jumping && highEnough;
    return sliding || jumping;
  }

  function damagePlayerFromFish(state, amount) {
    const player = state.player;
    if (player.invincible > 0) return;
    player.health = Math.max(0, player.health - amount);
    player.invincible = 0.85;
    state.message = `Fish clipped ${currentPlayerName()}. Duck or jump next time!`;
    notifyScoreLayer('recordDamage', { state, amount, source: 'salmon' });
    if (player.health <= 0) showTryAgain(state);
  }

  function showTryAgain(state) {
    state.mode = 'tryAgain';
    document.body.classList.remove('hockey-playing');
    const game = document.getElementById('hockey-game');
    const tryAgain = document.getElementById('hockey-try-again');
    if (game) game.hidden = true;
    if (tryAgain) tryAgain.hidden = false;
    clearLayerObjects();
  }

  function syncPuckNodes() {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const scaleX = rect.width / DESIGN_WIDTH;
    const scaleY = rect.height / DESIGN_HEIGHT;
    pucks.forEach((puck) => {
      Object.assign(puck.node.style, {
        left: `${rect.left + puck.x * scaleX}px`,
        top: `${rect.top + puck.y * scaleY}px`,
        width: `${Math.max(14, puck.width * scaleX)}px`,
        height: `${Math.max(7, puck.height * scaleY)}px`,
      });
      puck.node.hidden = false;
    });
  }

  function syncPowerupNodes() {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const scaleX = rect.width / DESIGN_WIDTH;
    const scaleY = rect.height / DESIGN_HEIGHT;
    powerups.forEach((powerup) => {
      Object.assign(powerup.node.style, {
        left: `${rect.left + powerup.x * scaleX}px`,
        top: `${rect.top + powerup.y * scaleY}px`,
        width: `${Math.max(24, powerup.width * scaleX)}px`,
        height: `${Math.max(24, powerup.height * scaleY)}px`,
      });
      powerup.node.hidden = false;
    });
  }

  function clearLayerObjects() {
    pucks.forEach((puck) => puck.node?.remove?.());
    powerups.forEach((powerup) => powerup.node?.remove?.());
    pucks = [];
    powerups = [];
    puckChargeStart = 0;
    activePointerChargeId = null;
  }

  function syncHud(state) {
    if (!health || !state?.player) return;
    health.value = state.player.health;
    health.textContent = `${state.player.health} health`;
  }

  function capitalize(value) {
    return String(value || '').charAt(0).toUpperCase() + String(value || '').slice(1);
  }

  function horizontalOverlap(a, b) {
    return a.x < b.x + b.width && a.x + a.width > b.x;
  }

  function rectsOverlap(a, b) {
    return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', onReady);
  else onReady();
})();
