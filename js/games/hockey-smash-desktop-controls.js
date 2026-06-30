(function () {
  const DISPLAY_VERSION = 'Hockey Smash v0.14.5 Desktop Controls';
  const GROUND_Y = 576 * 0.82;
  const SLIDE_SPEED = 560;
  const SLIDE_MS = 320;
  const SLIDE_COOLDOWN_MS = 430;
  const SLIDE_TRANSFORM = 'translateY(14px) scaleX(1.14) scaleY(0.70)';

  let slideUntil = 0;
  let slideCooldownUntil = 0;

  function api() {
    return window.RTA_HOCKEY_SMASH;
  }

  function state() {
    const s = api()?.getState?.();
    if (!s || !s.player || ['splash', 'transition', 'tryAgain'].includes(s.mode)) return null;
    return s;
  }

  function playerName() {
    return api()?.getPlayerConfig?.()?.name || 'Daniel';
  }

  function setSlideVisual(active) {
    const overlay = document.getElementById('hockey-player-overlay');
    document.body.classList.toggle('hockey-slide-active', active);
    if (!overlay) return;
    overlay.dataset.sliding = active ? 'true' : 'false';
    overlay.style.transform = active ? SLIDE_TRANSFORM : '';
    overlay.style.transformOrigin = active ? 'bottom center' : '';
  }

  function markButton(active) {
    document.querySelectorAll('.hockey-controls [data-action="slide"]').forEach((button) => {
      button.classList.toggle('is-pressed', Boolean(active));
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  function startArrowDownSlide(event) {
    if (event.repeat) return;
    const s = state();
    if (!s) return;
    const now = performance.now();
    if (now < slideCooldownUntil) return;

    const player = s.player;
    const direction = player.facing < 0 ? -1 : 1;
    slideUntil = now + SLIDE_MS;
    slideCooldownUntil = now + SLIDE_COOLDOWN_MS;
    player.facing = direction;
    player.vx = direction * SLIDE_SPEED;
    player.y = Math.min(player.y, GROUND_Y - player.height);
    s.message = `${playerName()} ducks!`;
    const status = document.getElementById('hockey-status');
    if (status) status.textContent = s.message;
    setSlideVisual(true);
    markButton(true);
  }

  function loop() {
    const active = performance.now() < slideUntil;
    if (!active) {
      setSlideVisual(false);
      markButton(false);
    }
    window.requestAnimationFrame(loop);
  }

  window.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowDown') return;
    event.preventDefault();
    startArrowDownSlide(event);
  }, { capture: true });

  window.addEventListener('keyup', (event) => {
    if (event.key !== 'ArrowDown') return;
    event.preventDefault();
  }, { capture: true });

  window.requestAnimationFrame(loop);
})();
