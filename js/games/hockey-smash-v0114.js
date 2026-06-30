(function () {
  const DISPLAY_VERSION = 'Hockey Smash v0.14.3';
  const DISPLAY_BUILD = 'Build 2026-06-29.59';
  const BEAR_START_SPEED = 82;
  const BEAR_LATE_SPEED = 132;
  const GROUND_Y = 576 * 0.82;
  const CAST_BASE_MS = 1650;
  const CAST_MIN_MS = 760;
  const computerMode = new URLSearchParams(window.location.search).get('computerMode') === '1';
  let nextCastAt = 0;
  let castIndex = 0;

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
        { type: 'alaskanBoy', bubble: 'Nice moves!', message: 'Alaskan boy cheers the dance run!', width: 84, height: 96, speed: 118, hp: 3 },
        ...shared,
        { type: 'danceInstructor', bubble: 'Point those toes!', message: 'Dance instructor challenge moving in!', width: 92, height: 100, speed: 126, hp: 4 },
      ];
    }
    return [
      { type: 'alaskanGirl', bubble: 'Nice shot!', message: 'Alaskan girl cheers the hockey run!', width: 84, height: 96, speed: 118, hp: 3 },
      ...shared,
    ];
  }

  function spawnCastEncounter(state) {
    if (!Array.isArray(state?.entities)) return;
    const activeCast = state.entities.filter((entity) => entity && !entity.dead && entity.fromFinalCastPass);
    const difficulty = difficultyFor(state);
    const activeLimit = difficulty > 0.55 ? 2 : 1;
    if (activeCast.length >= activeLimit) return;
    const cast = castForCurrentCharacter();
    const template = cast[castIndex % cast.length];
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
  }

  function runCastLogic(state) {
    const now = performance.now();
    if (!nextCastAt) nextCastAt = now + 900;
    if (now < nextCastAt) return;
    spawnCastEncounter(state);
    const difficulty = difficultyFor(state);
    nextCastAt = now + Math.max(CAST_MIN_MS, CAST_BASE_MS * (1 - difficulty * 0.45)) + Math.random() * 260;
  }

  function loop() {
    syncFinalReleaseState();
    const state = getState();
    if (state) {
      slowBearsAgain(state);
      runCastLogic(state);
    }
    window.requestAnimationFrame(loop);
  }

  function ready() {
    const badge = document.getElementById('hockey-build-badge');
    if (badge) badge.textContent = `${DISPLAY_VERSION} · ${DISPLAY_BUILD}`;
    if (api()?.getVersion) api().getVersion = () => DISPLAY_VERSION;
    document.body.dataset.hockeyButtonDebug = 'v0.14.3';
    syncFinalReleaseState();
    window.HOCKEY_BOOT_LOG?.log?.('v0114', 'v0.14.3 bear speed reduced again and character cast encounters doubled.');
    window.requestAnimationFrame(loop);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready);
  else ready();
})();
