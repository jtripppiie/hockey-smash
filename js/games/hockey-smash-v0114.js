(function () {
  const DISPLAY_VERSION = 'Hockey Smash v0.14.3';
  const DISPLAY_BUILD = 'Build 2026-06-29.59';
  const BEAR_START_SPEED = 82;
  const BEAR_LATE_SPEED = 132;

  function api() { return window.RTA_HOCKEY_SMASH; }
  function getState() {
    const state = api()?.getState?.();
    if (!state || !state.player || ['splash', 'transition', 'tryAgain'].includes(state.mode)) return null;
    return state;
  }
  function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
  function difficultyFor(state) { return clamp(Number(state?.difficulty) || ((state?.time || 0) / 140), 0, 1); }

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

  function loop() {
    const state = getState();
    if (state) slowBearsAgain(state);
    window.requestAnimationFrame(loop);
  }

  function ready() {
    const badge = document.getElementById('hockey-build-badge');
    if (badge) badge.textContent = `${DISPLAY_VERSION} · ${DISPLAY_BUILD}`;
    if (api()?.getVersion) api().getVersion = () => DISPLAY_VERSION;
    document.body.dataset.hockeyButtonDebug = 'v0.14.3';
    window.HOCKEY_BOOT_LOG?.log?.('v0114', 'v0.14.3 bear speed reduced again.');
    window.requestAnimationFrame(loop);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready);
  else ready();
})();
