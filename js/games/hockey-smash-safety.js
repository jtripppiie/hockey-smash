(function () {
  const DEV_STORAGE_KEY = 'hockeySmashDevModeSession';
  const DEV_TAP_WINDOW_MS = 1500;
  const DEV_TAP_TARGET = 3;
  const START_COUNTDOWN_SECONDS = 10;
  const HAZARD_TYPES = new Set(['salmon', 'bear', 'moose', 'dad', 'sister', 'teacher', 'danceInstructor', 'dadJoke']);
  const GROUND_Y = 576 * 0.82;
  const GRAVITY = 2250;
  const countdownStartByState = new WeakMap();
  const countdownPhysicsByState = new WeakMap();
  let devTapCount = 0;
  let firstDevTapAt = 0;
  let devModeEnabled = false;
  let countdownBadge = null;

  function actionFromTarget(target) {
    return target?.closest?.('[data-action]')?.dataset?.action || 'none';
  }

  function describeTarget(target) {
    if (!target) return 'missing-target';
    const button = target.closest?.('[data-action]');
    if (button) return `[data-action=${button.dataset.action}] class=${button.className || 'none'}`;
    return `${target.tagName || 'unknown'}#${target.id || 'no-id'}.${target.className || 'no-class'}`;
  }

  function stateSummary() {
    const state = window.RTA_HOCKEY_SMASH?.getState?.();
    const player = state?.player;
    if (!state || !player) return 'state/player missing';
    const countdown = state.readyCountdownActive ? ` countdown=${Math.ceil(state.readyCountdownSeconds || 0)}` : '';
    return `mode=${state.mode} x=${Math.round(player.x)} y=${Math.round(player.y)} vx=${Math.round(player.vx || 0)} vy=${Math.round(player.vy || 0)} grounded=${player.grounded ? 1 : 0}${countdown}`;
  }

  function log(source, event, extra) {
    const message = `${event} action=${extra?.action || 'none'} ${extra?.detail || ''} | ${stateSummary()}`;
    window.HOCKEY_BOOT_LOG?.log?.(source, message);
  }

  function normalizeSofieLabels() {
    document.querySelectorAll('[data-character="sofie"]').forEach((button) => {
      if (button.textContent.trim() !== 'Sofie') button.textContent = 'Sofie';
      button.setAttribute('aria-label', 'Choose Sofie');
    });
  }

  function lockAccidentalCameraShake() {
    const canvas = document.getElementById('hockey-canvas');
    if (!canvas) return;
    if (canvas.dataset.shaking === 'true' || canvas.style.transform) {
      canvas.style.transform = '';
      delete canvas.dataset.shaking;
    }
  }

  function isComputerMode() {
    return new URLSearchParams(window.location.search).get('computerMode') === '1';
  }

  function shouldAutoEnableDevMode() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('debug') === '1' || params.get('dev') === '1' || params.get('computerMode') === '1') return true;
    try {
      return window.sessionStorage.getItem(DEV_STORAGE_KEY) === 'true';
    } catch (error) {
      return false;
    }
  }

  function setDevElementState(enabled) {
    const watch = document.getElementById('hockey-watch');
    if (watch) {
      watch.hidden = !enabled;
      watch.setAttribute('aria-hidden', enabled ? 'false' : 'true');
      if (enabled) watch.removeAttribute('tabindex');
      else watch.setAttribute('tabindex', '-1');
    }

    const bootLog = document.getElementById('hockey-boot-log');
    if (bootLog) {
      bootLog.hidden = !enabled;
      bootLog.setAttribute('aria-hidden', enabled ? 'false' : 'true');
    }
  }

  function enableDevMode(reason) {
    devModeEnabled = true;
    document.body.classList.add('hockey-dev-mode');
    document.body.dataset.hockeyDevMode = 'true';
    setDevElementState(true);
    try {
      window.sessionStorage.setItem(DEV_STORAGE_KEY, 'true');
    } catch (error) {
      // sessionStorage can be unavailable in strict/private browsing contexts.
    }
    window.HOCKEY_BOOT_LOG?.log?.('dev', `Dev mode enabled: ${reason || 'manual unlock'}.`);
    window.HOCKEY_BOOT_LOG?.snapshot?.('dev-mode-enabled');
  }

  function disableDevModeByDefault() {
    devModeEnabled = false;
    document.body.classList.remove('hockey-dev-mode');
    document.body.dataset.hockeyDevMode = 'false';
    setDevElementState(false);
  }

  function bindDevModeUnlock() {
    const splashHero = document.getElementById('splash-hero');
    if (!splashHero || splashHero.dataset.devUnlockBound === 'true') return;
    splashHero.dataset.devUnlockBound = 'true';
    splashHero.title = 'Character preview';

    splashHero.addEventListener('pointerup', () => {
      if (devModeEnabled) return;
      const now = performance.now();
      if (!firstDevTapAt || now - firstDevTapAt > DEV_TAP_WINDOW_MS) {
        firstDevTapAt = now;
        devTapCount = 0;
      }
      devTapCount += 1;
      if (devTapCount >= DEV_TAP_TARGET) enableDevMode('splash image triple tap');
    }, { passive: true });
  }

  function ensureCountdownBadge() {
    if (countdownBadge) return countdownBadge;
    const game = document.getElementById('hockey-game');
    if (!game) return null;
    if (!game.style.position) game.style.position = 'relative';

    countdownBadge = document.createElement('div');
    countdownBadge.id = 'hockey-start-countdown';
    countdownBadge.setAttribute('role', 'status');
    countdownBadge.setAttribute('aria-live', 'polite');
    countdownBadge.hidden = true;
    countdownBadge.style.cssText = [
      'position:absolute',
      'left:50%',
      'top:50%',
      'transform:translate(-50%,-50%)',
      'z-index:40',
      'min-width:min(520px,calc(100% - 2rem))',
      'padding:1rem 1.2rem',
      'border:3px solid #fff27a',
      'border-radius:22px',
      'background:rgba(5,8,13,.88)',
      'color:#fff2cf',
      'box-shadow:0 18px 48px rgba(0,0,0,.45)',
      'text-align:center',
      'font:900 clamp(1.1rem,3vw,2rem)/1.2 system-ui,sans-serif',
      'pointer-events:none',
    ].join(';');
    game.appendChild(countdownBadge);
    return countdownBadge;
  }

  function hideCountdownBadge() {
    const badge = ensureCountdownBadge();
    if (badge) badge.hidden = true;
    document.body.classList.remove('hockey-countdown-active');
    delete document.body.dataset.hockeyCountdown;
  }

  function showCountdownBadge(seconds) {
    const badge = ensureCountdownBadge();
    const wholeSeconds = Math.max(1, Math.ceil(seconds));
    if (!badge) return;
    badge.hidden = false;
    badge.innerHTML = `<span style="display:block;color:#fff27a;font-size:1.15em;">${wholeSeconds}</span><span style="display:block;font-size:.52em;letter-spacing:.08em;text-transform:uppercase;">Practice the buttons before the salmon run starts</span>`;
    document.body.classList.add('hockey-countdown-active');
    document.body.dataset.hockeyCountdown = String(wholeSeconds);
  }

  function holdSpawnTimers(state) {
    if (!state?.spawn) return;
    state.spawn.wildlife = Math.max(state.spawn.wildlife || 0, 0.75);
    state.spawn.salmon = Math.max(state.spawn.salmon || 0, 0.75);
    state.spawn.family = Math.max(state.spawn.family || 0, 0.75);
    state.spawn.dadJoke = Math.max(state.spawn.dadJoke || 0, 0.75);
  }

  function clearCountdownHazards(state) {
    if (!Array.isArray(state?.entities)) return;
    state.entities = state.entities.filter((entity) => !HAZARD_TYPES.has(entity?.type));
  }

  function advanceCountdownPlayerPractice(state) {
    const player = state?.player;
    if (!player) return;
    const now = performance.now();
    let snapshot = countdownPhysicsByState.get(state);
    if (!snapshot) {
      snapshot = { at: now, y: player.y, vy: player.vy, grounded: player.grounded };
      countdownPhysicsByState.set(state, snapshot);
      return;
    }

    const changedElsewhere =
      Math.abs((player.y || 0) - snapshot.y) > 0.01 ||
      Math.abs((player.vy || 0) - snapshot.vy) > 0.01 ||
      Boolean(player.grounded) !== Boolean(snapshot.grounded);

    if (changedElsewhere) {
      snapshot.at = now;
      snapshot.y = player.y;
      snapshot.vy = player.vy;
      snapshot.grounded = player.grounded;
      return;
    }

    const dt = Math.min(0.034, Math.max(0.008, (now - snapshot.at) / 1000 || 0.016));
    snapshot.at = now;
    if (!player.grounded || player.vy) {
      player.vy = (Number(player.vy) || 0) + GRAVITY * dt;
      player.y += player.vy * dt;
      if (player.y + player.height >= GROUND_Y) {
        player.y = GROUND_Y - player.height;
        player.vy = 0;
        player.grounded = true;
      }
    }
    snapshot.y = player.y;
    snapshot.vy = player.vy;
    snapshot.grounded = player.grounded;
  }

  function runStartCountdown() {
    const state = window.RTA_HOCKEY_SMASH?.getState?.();
    if (!state?.player || state.mode !== 'playing' || isComputerMode()) {
      hideCountdownBadge();
      return;
    }

    if (!countdownStartByState.has(state)) {
      countdownStartByState.set(state, performance.now());
      state.readyDelayComplete = false;
      window.HOCKEY_BOOT_LOG?.log?.('countdown', '10-second practice countdown started.');
    }

    const elapsedSeconds = (performance.now() - countdownStartByState.get(state)) / 1000;
    const remainingSeconds = Math.max(0, START_COUNTDOWN_SECONDS - elapsedSeconds);

    if (remainingSeconds > 0) {
      state.time = 0;
      state.salmonRunStarted = false;
      state.salmonRunTimer = 0;
      state.bossIntroTimer = 0;
      state.dad = null;
      state.readyCountdownActive = true;
      state.readyCountdownSeconds = remainingSeconds;
      state.readyDelayComplete = false;
      state.message = `Get ready: ${Math.ceil(remainingSeconds)} seconds. Practice the buttons!`;
      advanceCountdownPlayerPractice(state);
      holdSpawnTimers(state);
      clearCountdownHazards(state);
      showCountdownBadge(remainingSeconds);
      return;
    }

    if (state.readyCountdownActive || !state.readyDelayComplete) {
      state.readyCountdownActive = false;
      state.readyCountdownSeconds = 0;
      state.readyDelayComplete = true;
      state.message = 'Go! Salmon incoming from the right!';
      if (state.spawn) {
        state.spawn.wildlife = Math.max(state.spawn.wildlife || 0, 1.1);
        state.spawn.salmon = Math.max(state.spawn.salmon || 0, 1.4);
        state.spawn.family = Math.max(state.spawn.family || 0, 3.5);
      }
      hideCountdownBadge();
      window.HOCKEY_BOOT_LOG?.log?.('countdown', 'Practice countdown complete. Hazards released.');
    }
  }

  function forceSalmonFromRight() {
    const state = window.RTA_HOCKEY_SMASH?.getState?.();
    if (!Array.isArray(state?.entities)) return;
    const canvasWidth = document.getElementById('hockey-canvas')?.width || 1024;

    state.entities.forEach((entity) => {
      if (entity?.type !== 'salmon') return;
      if (entity.fallingFish) return;
      const cameFromLeft = entity.vx > 0 || entity.flip === 1;
      if (!cameFromLeft) return;
      entity.x = canvasWidth + 90 + Math.random() * 36;
      entity.vx = -Math.abs(entity.vx || 390);
      entity.flip = -1;
    });
  }

  function gameplaySafetyLoop() {
    runStartCountdown();
    forceSalmonFromRight();
    window.requestAnimationFrame(gameplaySafetyLoop);
  }

  function onReady() {
    document.body.dataset.hockeySafety = 'v0.14.42';

    normalizeSofieLabels();
    if (shouldAutoEnableDevMode()) enableDevMode('debug/dev URL or active session');
    else disableDevModeByDefault();
    bindDevModeUnlock();

    window.HOCKEY_BOOT_LOG?.log?.('safety', 'Safety loaded without owning the version badge.');
    window.HOCKEY_BOOT_LOG?.snapshot?.('safety-ready');

    ['pointerdown', 'pointerup', 'click', 'touchstart', 'touchend'].forEach((type) => {
      document.addEventListener(type, (event) => {
        const action = actionFromTarget(event.target);
        if (action === 'none') return;
        log('button', type, { action, detail: describeTarget(event.target) });
      }, { capture: true, passive: true });
    });

    window.setInterval(() => {
      normalizeSofieLabels();
      bindDevModeUnlock();
      setDevElementState(devModeEnabled);
      const state = window.RTA_HOCKEY_SMASH?.getState?.();
      if (devModeEnabled && state?.mode === 'playing') window.HOCKEY_BOOT_LOG?.log?.('heartbeat', stateSummary());
    }, 1500);

    function cameraSafetyLoop() {
      lockAccidentalCameraShake();
      window.requestAnimationFrame(cameraSafetyLoop);
    }
    window.requestAnimationFrame(cameraSafetyLoop);
    window.requestAnimationFrame(gameplaySafetyLoop);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', onReady);
  else onReady();
})();
