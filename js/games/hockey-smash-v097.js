(function () {
  const DISPLAY_VERSION = 'Hockey Smash v0.9.7';
  const DISPLAY_BUILD = 'Build 2026-06-29.18';
  const DESIGN_WIDTH = 1024;
  const SLIDE_DISTANCE = 128;
  const SLIDE_DURATION = 260;
  const SLIDE_COOLDOWN = 420;
  const params = new URLSearchParams(window.location.search);
  const computerMode = params.get('computerMode') === '1';

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function onReady() {
    const api = window.RTA_HOCKEY_SMASH;
    const badge = document.getElementById('hockey-build-badge');
    const playerOverlay = document.getElementById('hockey-player-overlay');
    if (badge) badge.textContent = `${DISPLAY_VERSION} · ${DISPLAY_BUILD}`;
    if (api?.getVersion) api.getVersion = () => DISPLAY_VERSION;
    if (!api || computerMode) return;

    let slideRaf = 0;
    let lastSlideAt = 0;
    let lastPointerHandledAt = 0;

    function getPlayableState() {
      const state = api.getState?.();
      if (!state || !state.player || state.mode === 'splash' || state.mode === 'transition' || state.mode === 'tryAgain') return null;
      return state;
    }

    function isSlideEvent(event) {
      return Boolean(event.target?.closest?.('[data-action="slide"]'));
    }

    function consume(event) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation?.();
    }

    function setSliding(active) {
      document.body.classList.toggle('hockey-slide-active', active);
      if (playerOverlay) playerOverlay.dataset.sliding = active ? 'true' : 'false';
    }

    function startSlide() {
      const state = getPlayableState();
      if (!state) return;
      const now = performance.now();
      if (now - lastSlideAt < SLIDE_COOLDOWN) return;
      lastSlideAt = now;

      if (slideRaf) window.cancelAnimationFrame(slideRaf);
      const player = state.player;
      const startX = player.x;
      const direction = player.facing < 0 ? -1 : 1;
      const minX = 22;
      const maxX = DESIGN_WIDTH - player.width - 22;
      const targetX = Math.max(minX, Math.min(maxX, startX + direction * SLIDE_DISTANCE));
      const startedAt = performance.now();
      setSliding(true);
      state.message = 'Daniel slides!';

      function tick(time) {
        const activeState = getPlayableState();
        if (!activeState) {
          setSliding(false);
          slideRaf = 0;
          return;
        }
        const t = Math.min(1, (time - startedAt) / SLIDE_DURATION);
        const eased = easeOutCubic(t);
        activeState.player.x = startX + (targetX - startX) * eased;
        activeState.player.vx = direction * 320 * (1 - t);
        activeState.player.facing = direction;
        if (t < 1) {
          slideRaf = window.requestAnimationFrame(tick);
          return;
        }
        activeState.player.x = targetX;
        activeState.player.vx = 0;
        setSliding(false);
        slideRaf = 0;
      }

      slideRaf = window.requestAnimationFrame(tick);
    }

    window.addEventListener('pointerdown', (event) => {
      if (!isSlideEvent(event)) return;
      consume(event);
      lastPointerHandledAt = performance.now();
      event.target?.setPointerCapture?.(event.pointerId);
      startSlide();
    }, { capture: true, passive: false });

    window.addEventListener('click', (event) => {
      if (!isSlideEvent(event)) return;
      consume(event);
      if (performance.now() - lastPointerHandledAt > 350) startSlide();
    }, { capture: true, passive: false });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }
})();
