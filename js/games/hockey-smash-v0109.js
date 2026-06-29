(function () {
  const DISPLAY_VERSION = 'Hockey Smash v0.13.3';
  const DISPLAY_BUILD = 'Build 2026-06-29.49';
  const DEV_STORAGE_KEY = 'hockeySmashDevModeSession';
  const DEV_TAP_WINDOW_MS = 1500;
  const DEV_TAP_TARGET = 3;
  let devTapCount = 0;
  let firstDevTapAt = 0;
  let devModeEnabled = false;

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
    return `mode=${state.mode} x=${Math.round(player.x)} y=${Math.round(player.y)} vx=${Math.round(player.vx || 0)} vy=${Math.round(player.vy || 0)} grounded=${player.grounded ? 1 : 0}`;
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
    if (document.body.classList.contains('hockey-earthquake-active')) return;
    if (canvas.dataset.shaking === 'true' || canvas.style.transform) {
      canvas.style.transform = '';
      delete canvas.dataset.shaking;
    }
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

  function onReady() {
    const api = window.RTA_HOCKEY_SMASH;
    const badge = document.getElementById('hockey-build-badge');
    if (badge) badge.textContent = `${DISPLAY_VERSION} · ${DISPLAY_BUILD}`;
    if (api?.getVersion) api.getVersion = () => DISPLAY_VERSION;
    document.body.dataset.hockeyButtonDebug = 'v0.13.3';

    normalizeSofieLabels();
    if (shouldAutoEnableDevMode()) enableDevMode('debug/dev URL or active session');
    else disableDevModeByDefault();
    bindDevModeUnlock();

    window.HOCKEY_BOOT_LOG?.log?.('v0109', 'Normal splash hides dev controls. Triple-tap splash image to unlock dev mode.');
    window.HOCKEY_BOOT_LOG?.snapshot?.('v0109-ready');

    ['pointerdown', 'pointerup', 'click', 'touchstart', 'touchend'].forEach((type) => {
      document.addEventListener(type, (event) => {
        const action = actionFromTarget(event.target);
        if (action === 'none') return;
        log('button', type, {
          action,
          detail: describeTarget(event.target),
        });
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
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', onReady);
  else onReady();
})();
