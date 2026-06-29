(function () {
  const DISPLAY_VERSION = 'Hockey Smash v0.9.6';
  const DISPLAY_BUILD = 'Build 2026-06-29.17';
  const DESIGN_WIDTH = 1024;
  const HOLD_SPEED = 265;
  const TAP_DISTANCE = 18;
  const MAX_FRAME_STEP = 24;
  const params = new URLSearchParams(window.location.search);
  const computerMode = params.get('computerMode') === '1';

  function onReady() {
    const api = window.RTA_HOCKEY_SMASH;
    const badge = document.getElementById('hockey-build-badge');
    if (badge) badge.textContent = `${DISPLAY_VERSION} · ${DISPLAY_BUILD}`;
    if (api?.getVersion) api.getVersion = () => DISPLAY_VERSION;
    if (!api || computerMode) return;

    let activeDirection = null;
    let raf = 0;
    let lastTime = 0;
    let lastPointerHandledAt = 0;

    function getPlayableState() {
      const state = api.getState?.();
      if (!state || !state.player || state.mode === 'splash' || state.mode === 'transition' || state.mode === 'tryAgain') return null;
      return state;
    }

    function getDirectionFromEvent(event) {
      const target = event.target?.closest?.('[data-action="left"], [data-action="right"]');
      return target?.dataset?.action || null;
    }

    function move(direction, distance) {
      const state = getPlayableState();
      if (!state) return;
      const player = state.player;
      const delta = direction === 'left' ? -distance : distance;
      player.x = Math.max(22, Math.min(DESIGN_WIDTH - player.width - 22, player.x + delta));
      player.vx = direction === 'left' ? -HOLD_SPEED : HOLD_SPEED;
      player.facing = direction === 'left' ? -1 : 1;
      state.message = direction === 'left' ? 'Daniel glides left.' : 'Daniel glides right.';
    }

    function stopMove() {
      activeDirection = null;
      const state = getPlayableState();
      if (state) state.player.vx = 0;
      if (raf) window.cancelAnimationFrame(raf);
      raf = 0;
    }

    function loop(now) {
      if (!activeDirection) {
        raf = 0;
        return;
      }
      const dt = Math.min(0.045, Math.max(0.012, (now - lastTime) / 1000 || 0.016));
      lastTime = now;
      move(activeDirection, Math.min(MAX_FRAME_STEP, HOLD_SPEED * dt));
      raf = window.requestAnimationFrame(loop);
    }

    function startMove(direction) {
      activeDirection = direction;
      lastTime = performance.now();
      move(direction, TAP_DISTANCE);
      if (!raf) raf = window.requestAnimationFrame(loop);
    }

    function consume(event) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation?.();
    }

    window.addEventListener('pointerdown', (event) => {
      const direction = getDirectionFromEvent(event);
      if (!direction) return;
      consume(event);
      lastPointerHandledAt = performance.now();
      event.target?.setPointerCapture?.(event.pointerId);
      startMove(direction);
    }, { capture: true, passive: false });

    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((eventName) => {
      window.addEventListener(eventName, (event) => {
        if (!activeDirection) return;
        consume(event);
        stopMove();
      }, { capture: true, passive: false });
    });

    window.addEventListener('click', (event) => {
      const direction = getDirectionFromEvent(event);
      if (!direction) return;
      consume(event);
      if (performance.now() - lastPointerHandledAt > 350) {
        move(direction, TAP_DISTANCE);
      }
    }, { capture: true, passive: false });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }
})();
