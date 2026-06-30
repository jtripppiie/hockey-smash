(function () {
  const DISPLAY_VERSION = 'Hockey Smash v0.13.6';
  const DISPLAY_BUILD = 'Build 2026-06-29.52';
  const DESIGN_WIDTH = 1024;
  const DESIGN_HEIGHT = 576;
  const GROUND_Y = DESIGN_HEIGHT * 0.82;

  // Puck / pointe-shoe tuning.
  // A quick tap still shoots immediately on release. Holding the action key/button
  // charges a faster, arcing shot. The cooldown is intentionally short so skilled
  // players can tap quickly or hold briefly for a harder slap shot.
  const PUCK_BASE_SPEED = 680;
  const PUCK_MIN_SPEED = PUCK_BASE_SPEED * 0.65;
  const PUCK_MAX_CHARGE_MS = 720;
  const PUCK_DAMAGE = 2;
  const PUCK_COOLDOWN_MS = 180;
  const PUCK_ARC_GRAVITY = 680;
  const FISH_DODGE_DAMAGE = 8;
  const POWERUP_DURATION_MS = 6500;
  const EARTHQUAKE_POWERUP_CHANCE = 0.25;
  const PUCK_SPEED_POWERUP_CHANCE = 0.3;

  let api = null;
  let canvas = null;
  let status = null;
  let health = null;
  let lastFrame = performance.now();
  let lastPuckAt = 0;
  let lastSeenSwing = 0;
  let puckChargeStart = 0;
  let activePointerChargeId = null;
  let currentPuckType = 'normal';
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
      if (setPuckTypeFromKey(event)) return;
      if (!['f', 'F', 'Enter', ' '].includes(event.key)) return;
      // Holding the action key starts a charge. We fire on keyup so the player can
      // choose between a tap shot and a charged slap shot.
      if (!event.repeat && !puckChargeStart) puckChargeStart = performance.now();
    }, { capture: true });

    window.addEventListener('keyup', (event) => {
      if (!['f', 'F', 'Enter', ' '].includes(event.key) || !puckChargeStart) return;
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

  function setPuckTypeFromKey(event) {
    const key = event.key?.toLowerCase?.() || '';
    const nextType = key === 'q' || (key === 'f' && event.shiftKey)
      ? 'fire'
      : key === 'e'
        ? 'bounce'
        : key === 'r'
          ? 'normal'
          : '';
    if (!nextType) return false;
    currentPuckType = nextType;
    const state = getPlayableState();
    const label = nextType === 'fire' ? 'Fire puck ready!' : nextType === 'bounce' ? 'Bounce puck ready!' : 'Normal puck ready!';
    if (state) state.message = label;
    if (status) status.textContent = label;
    return true;
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

  function earthquakeActive() {
    return window.RTA_HOCKEY_SMASH_EARTHQUAKE?.isActive?.() === true;
  }

  function projectileHitLabel(variant, charged) {
    if (isSofiePlayer()) {
      if (charged) return 'CRUSH SHOE!';
      if (variant === 'aerial') return 'AIR SHOE!';
      if (variant === 'slide') return 'LOW SHOE!';
      return 'POINTE SHOE!';
    }
    if (charged) return 'CRUSH PUCK!';
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
    const chargeBoost = Math.floor(chargeFactor * 3) + (boost ? 1 : 0);
    const boostedGlow = boost ? ', 0 0 34px rgba(140,255,145,.85)' : '';

    if (sofie && airborne) {
      return {
        variant: 'aerial', projectileType: 'pointe-shoe', damage: 4 + chargeBoost,
        width: 40 + chargeFactor * 12, height: 24 + chargeFactor * 4,
        message: charged ? `${name} winds up a huge aerial pointe blast!` : `${name} launches an aerial pointe shoe!`,
        text: '🩰', background: 'linear-gradient(135deg, #fff7ed 0%, #fecdd3 45%, #fb7185 100%)',
        boxShadow: (charged ? '0 0 0 3px rgba(255,255,255,.95), 0 0 32px rgba(244,114,182,.95)' : '0 0 0 2px rgba(255,255,255,.9), 0 0 22px rgba(244,114,182,.75)') + boostedGlow,
        borderRadius: '45% 55% 55% 45%', charged
      };
    }
    if (sofie && sliding) {
      return {
        variant: 'slide', projectileType: 'pointe-shoe', damage: 3 + chargeBoost,
        width: 38 + chargeFactor * 12, height: 22 + chargeFactor * 4,
        message: charged ? `${name} charges a low sweeping pointe shot!` : `${name} sweeps a low pointe shoe!`,
        text: '🩰', background: 'linear-gradient(135deg, #fff1f2 0%, #f9a8d4 48%, #be185d 100%)',
        boxShadow: (charged ? '0 0 0 3px rgba(255,255,255,.9), 0 0 28px rgba(244,114,182,.9)' : '0 0 0 2px rgba(255,255,255,.85), 0 0 18px rgba(244,114,182,.7)') + boostedGlow,
        borderRadius: '45% 55% 55% 45%', charged
      };
    }
    if (sofie) {
      return {
        variant: 'normal', projectileType: 'pointe-shoe', damage: PUCK_DAMAGE + chargeBoost,
        width: 36 + chargeFactor * 12, height: 22 + chargeFactor * 4,
        message: charged ? `${name} winds up a big pointe-shoe shot!` : `${name} throws a pointe shoe at the wildlife!`,
        text: '🩰', background: 'linear-gradient(135deg, #fff7ed 0%, #fda4af 50%, #e11d48 100%)',
        boxShadow: (charged ? '0 0 0 3px rgba(255,255,255,.9), 0 0 28px rgba(244,114,182,.9)' : '0 0 0 2px rgba(255,255,255,.75), 0 8px 12px rgba(0,0,0,.25)') + boostedGlow,
        borderRadius: '45% 55% 55% 45%', charged
      };
    }

    if (airborne) {
      return {
        variant: 'aerial', projectileType: 'puck', damage: 4 + chargeBoost,
        width: 36 + chargeFactor * 12, height: 18 + chargeFactor * 5,
        message: charged ? `${name} winds up a huge aerial slap shot!` : `${name} launches an aerial slapshot!`,
        background: 'radial-gradient(circle at 35% 30%, #fff7a8 0 18%, #f59e0b 45%, #7c2d12 100%)',
        boxShadow: (charged ? '0 0 0 3px rgba(255,255,255,.95), 0 0 32px rgba(250,204,21,.95)' : '0 0 0 2px rgba(255,255,255,.8), 0 0 22px rgba(250,204,21,.75)') + boostedGlow,
        borderRadius: '999px', charged
      };
    }
    if (sliding) {
      return {
        variant: 'slide', projectileType: 'puck', damage: 3 + chargeBoost,
        width: 34 + chargeFactor * 12, height: 14 + chargeFactor * 4,
        message: charged ? `${name} charges a low rocket puck!` : `${name} fires a low slide puck!`,
        background: 'radial-gradient(circle at 35% 30%, #dbeafe 0 18%, #2563eb 46%, #0f172a 100%)',
        boxShadow: (charged ? '0 0 0 3px rgba(255,255,255,.9), 0 0 28px rgba(96,165,250,.9)' : '0 0 0 2px rgba(255,255,255,.75), 0 0 18px rgba(96,165,250,.7)') + boostedGlow,
        borderRadius: '999px', charged
      };
    }
    return {
      variant: 'normal', projectileType: 'puck', damage: PUCK_DAMAGE + chargeBoost,
      width: 32 + chargeFactor * 12, height: 18,
      message: charged ? `${name} winds up a BIG slap shot!` : `${name} sends the puck away!`,
      background: charged ? 'radial-gradient(circle at 35% 30%, #fef08a 0 18%, #f97316 46%, #111827 100%)' : 'radial-gradient(circle at 35% 30%, #ddd 0 14%, #555 60%, #111 100%)',
      boxShadow: (charged ? '0 0 0 3px rgba(255,255,255,.9), 0 0 30px rgba(251,191,36,.95)' : '0 0 0 2px rgba(255,255,255,.65), 0 0 12px rgba(170,170,170,.75)') + boostedGlow,
      borderRadius: '999px', charged
    };
  }

  function firePuck(chargeTime = 0, type = currentPuckType) {
    const state = getPlayableState();
    if (!state) return;
    const now = performance.now();
    const cooldown = earthquakeActive() ? Math.round(PUCK_COOLDOWN_MS * 0.55) : PUCK_COOLDOWN_MS;
    if (now - lastPuckAt < cooldown) return;
    lastPuckAt = now;
    const player = state.player;
    const shotDirection = 1;
    const chargeFactor = Math.min(1, Math.max(0, chargeTime / PUCK_MAX_CHARGE_MS));
    const speedMultiplier = speedBoostActive() ? 1.25 : 1;
    const speed = (PUCK_MIN_SPEED + (PUCK_BASE_SPEED * 0.65 * chargeFactor)) * speedMultiplier;
    const puckStats = puckStatsForPlayer(player, chargeFactor);
    const puckType = ['fire', 'bounce'].includes(type) ? type : 'normal';
    const heightOffset = chargeFactor * -20;
    pucks.push({
      x: player.x + player.width + 10,
      y: player.y + player.height * 0.45 + heightOffset,
      width: puckStats.width,
      height: puckStats.height,
      vx: speed * shotDirection * (puckType === 'fire' ? 1.25 : 1),
      vy: puckType === 'bounce' ? -280 : chargeFactor * -220,
      life: 2.2,
      damage: puckStats.damage + (puckType === 'fire' ? 1 : 0),
      type: puckType,
      bounces: puckType === 'bounce' ? 2 : 0,
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

  function decorateProjectileNode(puck) {
    if (!puck?.node) return;
    puck.node.dataset.puckType = puck.type || 'normal';
    if (puck.type === 'fire') {
      puck.node.style.background = 'radial-gradient(circle at 35% 30%, #fff7ad 0 18%, #f97316 44%, #dc2626 72%, #111827 100%)';
      puck.node.style.boxShadow = '0 0 0 3px rgba(255,255,255,.85), 0 0 30px rgba(248,113,113,.95), 0 0 54px rgba(249,115,22,.72)';
    }
    if (puck.type === 'bounce') {
      puck.node.style.background = 'radial-gradient(circle at 35% 30%, #dcfce7 0 18%, #22c55e 48%, #14532d 100%)';
      puck.node.style.boxShadow = '0 0 0 3px rgba(255,255,255,.85), 0 0 28px rgba(74,222,128,.9)';
    }
  }

  function runPuckAndDodgeLayer(now) {
    const dt = Math.min(0.034, Math.max(0.008, (now - lastFrame) / 1000 || 0.016));
    lastFrame = now;
    const state = getPlayableState();
    if (!state) clearLayerObjects();
    else {
      neutralizeSalmonDamage(state);
      launchFromCoreStickSwing(state);
      updateBurningTargets(state, dt);
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
      if (puck.type === 'bounce') maybeBouncePuck(puck);
      const target = (state.entities || []).find((entity) => {
        if (!entity || entity.dead) return false;
        if (!['bear', 'moose', 'chargingMoose', 'bird'].includes(entity.type)) return false;
        return rectsOverlap(puck, entity);
      });
      if (!target) return;
      target.hp -= puck.damage || PUCK_DAMAGE;
      if (puck.type === 'fire') target.burning = Math.max(target.burning || 0, 2.5);
      puck.life = 0;
      const hitLabel = projectileHitLabel(puck.variant, puck.charged);
      state.effects?.push?.({ x: target.x + target.width / 2, y: target.y - 10, text: hitLabel, life: 0.35 });
      const destroyed = target.hp <= 0;
      const word = puck.projectileType === 'pointe-shoe' ? 'pointe shoe' : 'puck';
      if (destroyed) {
        target.dead = true;
        maybeDropPowerup(target);
        if (state.computer?.results) state.computer.results.clearedObstacle = true;
        state.message = `${targetName(target)} DOWN after the ${word} hit!`;
      } else {
        state.message = `${capitalize(word)} hit the ${targetName(target).toLowerCase()}${puck.type === 'fire' ? ' and set it burning!' : '!'}`;
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

  function maybeBouncePuck(puck) {
    if (!puck.bounces || puck.life <= 0.3 || puck.vy <= 0) return;
    const bounceFloor = GROUND_Y - puck.height * 0.65;
    if (puck.y < bounceFloor) return;
    puck.y = bounceFloor;
    puck.vy = -Math.abs(puck.vy) * 0.7;
    puck.bounces -= 1;
    puck.life += 0.18;
  }

  function updateBurningTargets(state, dt) {
    (state.entities || []).forEach((entity) => {
      if (!entity?.burning || entity.dead) return;
      entity.burning = Math.max(0, entity.burning - dt);
      entity._burnTick = (entity._burnTick || 0) + dt;
      if (entity._burnTick < 0.5) return;
      entity._burnTick = 0;
      entity.hp = (entity.hp || 1) - 1;
      state.effects?.push?.({ x: entity.x + entity.width / 2, y: entity.y - 18, text: 'BURN!', life: 0.35 });
      if (entity.hp <= 0) {
        entity.dead = true;
        maybeDropPowerup(entity);
        notifyScoreLayer('recordPuckHit', { state, target: entity, destroyed: true, puckVariant: 'fire', projectileType: 'puck', damage: 1, charged: false });
      }
    });
  }

  function targetName(target) {
    if (target?.type === 'chargingMoose') return 'CHARGING MOOSE';
    if (target?.type === 'bird') return 'BIRD';
    if (target?.type === 'moose') return 'MOOSE';
    return 'BEAR';
  }

  function maybeDropPowerup(target) {
    // Power-ups stay in this layer instead of state.entities. The old core loop
    // damages the player for every entity overlap, so storing power-ups locally
    // avoids accidentally turning a reward into a hazard.
    if (!target) return;
    const roll = Math.random();
    if (roll >= EARTHQUAKE_POWERUP_CHANCE + PUCK_SPEED_POWERUP_CHANCE) return;
    const power = roll < EARTHQUAKE_POWERUP_CHANCE ? 'earthquake' : 'puckSpeed';
    powerups.push({
      x: target.x + target.width / 2 - 24,
      y: Math.max(80, target.y - 40),
      vx: -80,
      width: 48,
      height: 48,
      life: 5.5,
      power,
      node: createPowerupNode(power),
    });
  }

  function createPowerupNode(power) {
    const earthquake = power === 'earthquake';
    const node = document.createElement('div');
    node.setAttribute('aria-hidden', 'true');
    node.dataset.powerup = power || 'puckSpeed';
    node.textContent = earthquake ? '🌎' : '⚡';
    Object.assign(node.style, {
      position: 'fixed', left: '0', top: '0', width: '28px', height: '28px',
      zIndex: '8', pointerEvents: 'none', borderRadius: '999px',
      display: 'grid', placeItems: 'center',
      background: earthquake
        ? 'radial-gradient(circle, #fef3c7 0 24%, #ef4444 62%, #451a03 100%)'
        : 'radial-gradient(circle, #fef08a 0 30%, #22c55e 72%, #064e3b 100%)',
      boxShadow: earthquake
        ? '0 0 0 3px rgba(255,255,255,.85), 0 0 30px rgba(239,68,68,.9)'
        : '0 0 0 3px rgba(255,255,255,.85), 0 0 26px rgba(34,197,94,.85)',
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
        if (powerup.power === 'earthquake') {
          window.activateEarthquake?.(9000);
          state.effects?.push?.({ x: state.player.x + state.player.width / 2, y: state.player.y - 18, text: 'QUAKE!', life: 0.55 });
          state.message = `${currentPlayerName()} triggered Earthquake Mode!`;
        } else {
          puckSpeedBoostUntil = performance.now() + POWERUP_DURATION_MS;
          state.effects?.push?.({ x: state.player.x + state.player.width / 2, y: state.player.y - 18, text: 'PUCK BOOST!', life: 0.45 });
          state.message = `${currentPlayerName()} grabbed a puck speed boost!`;
        }
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
      const shouldResolve = entity.fallingFish ? fallingFishReachedPlayer(player, entity) : horizontalOverlap(player, entity);
      if (!shouldResolve) return;
      entity._dodgeLayerResolved = true;
      if (playerIsDodgingSalmon(player, entity)) {
        const label = String(entity.variant || '').includes('school') ? 'BIG DODGE!' : 'DODGE!';
        state.effects?.push?.({ x: player.x + player.width / 2, y: player.y - 10, text: label, life: 0.35 });
        state.message = entity.fallingFish ? `${currentPlayerName()} dodged the raining fish!` : entity.variant === 'highArc' ? `${currentPlayerName()} jumped the high salmon arc!` : `${currentPlayerName()} dodged the fish!`;
        notifyScoreLayer('recordDodge', { state, entity });
      } else {
        damagePlayerFromFish(state, entity.dodgeDamage || FISH_DODGE_DAMAGE);
      }
      if (status) status.textContent = state.message;
    });
  }

  function playerIsDodgingSalmon(player, entity) {
    if (entity?.fallingFish) return !rectsOverlap(player, entity);
    const sliding = document.body.classList.contains('hockey-slide-active') || document.getElementById('hockey-player-overlay')?.dataset?.sliding === 'true';
    const jumping = !player.grounded && player.y + player.height < GROUND_Y - 45;
    const highEnough = player.y < GROUND_Y - 120;
    if (entity?.variant === 'low') return sliding;
    if (entity?.variant === 'highArc' || entity?.variant === 'high') return jumping && highEnough;
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
      decorateProjectileNode(puck);
      Object.assign(puck.node.style, {
        left: `${rect.left + puck.x * scaleX}px`,
        top: `${rect.top + puck.y * scaleY}px`,
        width: `${Math.max(14, puck.width * scaleX)}px`,
        height: `${Math.max(7, puck.height * scaleY)}px`,
        transform: puck.projectileType === 'pointe-shoe' ? `rotate(${puck.vy < -100 ? -25 : 12}deg)` : `rotate(${puck.vy < -100 ? -25 : 12}deg)`,
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

  function fallingFishReachedPlayer(player, entity) {
    const playerMidY = player.y + player.height * 0.35;
    return entity.y + entity.height >= playerMidY;
  }

  function rectsOverlap(a, b) {
    return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', onReady);
  else onReady();
})();
