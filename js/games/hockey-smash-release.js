(function () {
  const DISPLAY_VERSION = 'Hockey Smash v0.14.6';
  const DISPLAY_BUILD = 'Build 2026-06-30.62';
  const BEAR_START_SPEED = 82;
  const BEAR_LATE_SPEED = 132;
  const GROUND_Y = 576 * 0.82;
  const CAST_BASE_MS = 1650;
  const CAST_MIN_MS = 760;
  const computerMode = new URLSearchParams(window.location.search).get('computerMode') === '1';
  const CAMEO_ASSETS = {
    daniel: {
      src: 'assets/hockey-smash/sprites/alaskan_girl.webp',
      label: "Hey, you're cute",
    },
    sofie: {
      src: 'assets/hockey-smash/sprites/alaskan_boy.webp',
      label: "Hey, you're cute",
    },
  };
  let nextCastAt = 0;
  let castIndex = 0;
  let castDebugButton = null;
  let cameoNode = null;
  let cameoSprite = null;
  let cameoLabel = null;

  function api() { return window.RTA_HOCKEY_SMASH; }
  function getState() {
    const state = api()?.getState?.();
    if (!state || !state.player || ['splash', 'transition', 'tryAgain'].includes(state.mode)) return null;
    return state;
  }
  function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
  function difficultyFor(state) { return clamp(Number(state?.difficulty) || ((state?.time || 0) / 140), 0, 1); }
  function character() { return api()?.getPlayerConfig?.()?.character || getState()?.playerCharacter || 'daniel'; }

  function syncFinalReleaseState() {
    const badge = document.getElementById('hockey-build-badge');
    if (badge && badge.textContent !== `${DISPLAY_VERSION} · ${DISPLAY_BUILD}`) {
      badge.textContent = `${DISPLAY_VERSION} · ${DISPLAY_BUILD}`;
    }
    if (api()?.getVersion) api().getVersion = () => DISPLAY_VERSION;

    if (!computerMode) return;
    const overlay = document.getElementById('hockey-player-overlay');
    if (!overlay) return;
    overlay.hidden = true;
    overlay.style.display = 'none';
    document.body.classList.add('hockey-canvas-player-only');
  }

  function slowBearsAgain(state) {
    if (!Array.isArray(state?.entities)) return;
    const difficulty = difficultyFor(state);
    const speed = BEAR_START_SPEED + (BEAR_LATE_SPEED - BEAR_START_SPEED) * difficulty;
    state.entities.forEach((entity) => {
      if (!entity || entity.dead || entity.type !== 'bear') return;
      entity.vx = -speed;
      entity._bearFinalSpeed = Number(speed.toFixed(1));
    });
  }

  function castForCurrentCharacter() {
    const shared = [
      { type: 'mom', bubble: 'Keep going!', message: 'Mom cheering from the sidewalk!', width: 88, height: 96, speed: 92, hp: 3 },
      { type: 'dad', bubble: 'You got this!', message: 'Dad joins the sideline!', width: 92, height: 96, speed: 88, hp: 4 },
      { type: 'teacher', bubble: 'Eyes on the puck!', message: 'Teacher challenge moving in!', width: 90, height: 96, speed: 104, hp: 4 },
    ];
    if (character() === 'sofie') {
      return [
        { type: 'alaskanBoy', bubble: "Hey, you're cute", message: 'Alaskan boy cheers the dance run!', width: 84, height: 96, speed: 118, hp: 3 },
        ...shared,
        { type: 'danceInstructor', bubble: 'Point those toes!', message: 'Dance instructor challenge moving in!', width: 92, height: 100, speed: 126, hp: 4 },
      ];
    }
    return [
      { type: 'alaskanGirl', bubble: "Hey, you're cute", message: 'Alaskan girl cheers the hockey run!', width: 84, height: 96, speed: 118, hp: 3 },
      ...shared,
    ];
  }

  function devModeActive() {
    const params = new URLSearchParams(window.location.search);
    return params.get('debug') === '1' || params.get('dev') === '1' || params.get('computerMode') === '1' || document.body.classList.contains('hockey-dev-mode');
  }

  function spawnCastEncounter(state, options = {}) {
    if (!Array.isArray(state?.entities)) return null;
    const activeCast = state.entities.filter((entity) => entity && !entity.dead && entity.fromFinalCastPass);
    const difficulty = difficultyFor(state);
    const activeLimit = difficulty > 0.55 ? 2 : 1;
    if (!options.force && activeCast.length >= activeLimit) return null;
    const cast = castForCurrentCharacter();
    const requestedType = options.type || '';
    const template = cast.find((entry) => entry.type === requestedType) || cast[castIndex % cast.length];
    castIndex += 1;
    const speedBoost = 1 + difficulty * 0.28;
    const entity = {
      ...template,
      key: `final-cast-${template.type}-${Date.now()}-${castIndex}`,
      x: 1024 + 60 + Math.random() * 100,
      y: GROUND_Y - template.height,
      vx: -template.speed * speedBoost,
      damage: template.type === 'dad' ? 7 : 5,
      maxHp: template.hp,
      fromFinalCastPass: true,
      fromMovingGameplayPass: true,
      variant: 'cast',
    };
    state.entities.push(entity);
    state.message = entity.message;
    const status = document.getElementById('hockey-status');
    if (status) status.textContent = entity.message;
    window.HOCKEY_BOOT_LOG?.log?.('cast', `Spawned ${entity.type}${options.force ? ' by debug shortcut' : ''}.`);
    return entity;
  }

  function runCastLogic(state) {
    const now = performance.now();
    if (!nextCastAt) nextCastAt = now + 900;
    if (now < nextCastAt) return;
    spawnCastEncounter(state);
    const difficulty = difficultyFor(state);
    nextCastAt = now + Math.max(CAST_MIN_MS, CAST_BASE_MS * (1 - difficulty * 0.45)) + Math.random() * 260;
  }

  function wildlifeStageHasStarted(state) {
    if (!state) return false;
    const time = Number(state.time) || 0;
    const hasWildlife = Array.isArray(state.entities) && state.entities.some((entity) => entity && !entity.dead && ['bear', 'moose', 'chargingMoose'].includes(entity.type));
    return hasWildlife || time > 32;
  }

  function ensureCameoNode() {
    if (cameoNode?.isConnected) return cameoNode;
    const game = document.getElementById('hockey-game');
    if (!game) return null;
    if (getComputedStyle(game).position === 'static') game.style.position = 'relative';

    cameoNode = document.createElement('div');
    cameoNode.className = 'hockey-sideline-cameo';
    cameoNode.dataset.hockeySidelineCameo = 'v0.14.6';
    cameoNode.setAttribute('aria-hidden', 'true');
    Object.assign(cameoNode.style, {
      position: 'absolute',
      right: '2.2%',
      bottom: '13.5%',
      zIndex: '8',
      width: 'clamp(54px, 8vw, 92px)',
      pointerEvents: 'none',
      filter: 'drop-shadow(0 8px 12px rgba(0,0,0,.34))',
      transform: 'translateY(0)',
      transition: 'opacity 180ms ease, transform 180ms ease',
    });

    cameoSprite = document.createElement('img');
    cameoSprite.alt = '';
    Object.assign(cameoSprite.style, {
      display: 'block',
      width: '100%',
      height: 'auto',
      objectFit: 'contain',
    });

    cameoLabel = document.createElement('span');
    Object.assign(cameoLabel.style, {
      position: 'absolute',
      left: '50%',
      top: '-1.3rem',
      transform: 'translateX(-50%)',
      padding: '.2rem .44rem',
      border: '2px solid rgba(255,255,255,.92)',
      borderRadius: '999px',
      background: 'rgba(15,23,42,.86)',
      color: '#dbeafe',
      font: '900 12px/1.05 system-ui,sans-serif',
      whiteSpace: 'nowrap',
      textShadow: '0 1px 3px rgba(0,0,0,.65)',
    });

    cameoNode.appendChild(cameoSprite);
    cameoNode.appendChild(cameoLabel);
    game.appendChild(cameoNode);
    return cameoNode;
  }

  function syncSidelineCameo(state) {
    const node = ensureCameoNode();
    if (!node) return;
    const shouldShow = Boolean(state && wildlifeStageHasStarted(state));
    node.hidden = !shouldShow;
    node.style.opacity = shouldShow ? '1' : '0';
    node.style.transform = shouldShow ? 'translateY(0)' : 'translateY(8px)';
    if (!shouldShow) return;

    const config = CAMEO_ASSETS[character() === 'sofie' ? 'sofie' : 'daniel'];
    if (cameoSprite && cameoSprite.src !== new URL(config.src, window.location.href).href) cameoSprite.src = config.src;
    if (cameoLabel) cameoLabel.textContent = config.label;
  }

  function spawnCastNow(type) {
    const state = getState();
    if (!state) return null;
    return spawnCastEncounter(state, { force: true, type });
  }

  function exposeCastDebugApi() {
    window.RTA_HOCKEY_SMASH_CAST = {
      spawnNow: spawnCastNow,
      currentCast: () => castForCurrentCharacter().map((entry) => entry.type),
    };
  }

  function ensureCastDebugButton() {
    const game = document.getElementById('hockey-game');
    if (!game) return;
    if (!devModeActive()) {
      if (castDebugButton) castDebugButton.hidden = true;
      return;
    }
    if (castDebugButton?.isConnected) {
      castDebugButton.hidden = false;
      return;
    }
    castDebugButton = document.createElement('button');
    castDebugButton.id = 'hockey-spawn-cast-debug';
    castDebugButton.type = 'button';
    castDebugButton.textContent = 'Spawn Cast';
    castDebugButton.setAttribute('aria-label', 'Spawn cast encounter now');
    castDebugButton.style.cssText = [
      'position:absolute',
      'right:.75rem',
      'bottom:.75rem',
      'z-index:45',
      'padding:.45rem .65rem',
      'border:2px solid #fff27a',
      'border-radius:8px',
      'background:rgba(5,8,13,.86)',
      'color:#fff2cf',
      'font:800 12px/1 system-ui,sans-serif',
      'box-shadow:0 8px 18px rgba(0,0,0,.35)',
    ].join(';');
    castDebugButton.addEventListener('click', () => spawnCastNow());
    game.appendChild(castDebugButton);
  }

  function loop() {
    syncFinalReleaseState();
    exposeCastDebugApi();
    ensureCastDebugButton();
    const state = getState();
    if (state) {
      slowBearsAgain(state);
      runCastLogic(state);
      syncSidelineCameo(state);
    } else {
      syncSidelineCameo(null);
    }
    window.requestAnimationFrame(loop);
  }

  function ready() {
    const badge = document.getElementById('hockey-build-badge');
    if (badge) badge.textContent = `${DISPLAY_VERSION} · ${DISPLAY_BUILD}`;
    if (api()?.getVersion) api().getVersion = () => DISPLAY_VERSION;
    document.body.dataset.hockeyButtonDebug = 'v0.14.6';
    syncFinalReleaseState();
    exposeCastDebugApi();
    ensureCastDebugButton();
    window.HOCKEY_BOOT_LOG?.log?.('release', 'v0.14.6 removes the Mom acknowledgement button and auto-dismisses the clean-room interruption.');
    window.requestAnimationFrame(loop);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready);
  else ready();
})();
